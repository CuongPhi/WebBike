var RequestRepos =  require ('../repos/request-receiver');
const requestRepos = new RequestRepos();
var moment = require('moment');

var eventGetAll = (io)=>{
    requestRepos.getAll_Stt0()
    .then(rows=>{
        io.sockets.emit('event-request-reciever', JSON.stringify(rows));
    })
    .catch(err=>{
        io.sockets.emit('event-request-reciever', JSON.stringify({
            msg: 'error to get list request-reciever',
            err: err
        }));
    })
}
var eventGetAllReq = (io)=>{
    requestRepos.getAll()
    .then(rows=>{
        io.sockets.emit('event-request-management', JSON.stringify(rows));
    })
    .catch(err=>{
        io.sockets.emit('event-request-management', JSON.stringify({
            msg: 'error to get list request-reciever',
            err: err
        }));
    })
}

module.exports.response = function(io, client){
    eventGetAll(io);
    eventGetAllReq(io);
    client.on('disconnecting', (reason)=>{
        console.log('disconnecting, id = ' + client.id + reason);        
    });
    client.on('event-add-request', (obj)=>{
        var newReq = JSON.parse(obj);
        newReq.iat = moment().unix();
        requestRepos.addRequest(newReq)
        .then(()=>{
            eventGetAll(io);
        })
        .catch(err => console.log(err));
    });
    client.on('event-change-stt-to-1', (req)=>{
        var _req = JSON.parse(req);
        requestRepos.locatedRequest(_req)
        .then(()=>{
            io.sockets.emit('event-change-stt-to-1-ok', req);
        })
    });
}