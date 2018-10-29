var RequestRepos =  require ('../repos/request-receiver');
const requestRepos = new RequestRepos();
var moment = require('moment');

var eventGetAll = (io)=>{
    requestRepos.getAll()
    .then(rows=>{
        console.log('sending.........................');
        io.sockets.emit('event-request-reciever', JSON.stringify(rows));
    })
    .catch(err=>{
        io.sockets.emit('event-request-reciever', JSON.stringify({
            msg: 'error to get list request-reciever',
            err: err
        }));
    })
}

module.exports.response = function(io, client){
    eventGetAll(io);
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
}