var RequestRepos =  require ('../repos/request-receiver');
const requestRepos = new RequestRepos();
var moment = require('moment');

var eventGetAll = (io,client)=>{
    client.type = 'LI';
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
var eventGetAllReq = (io,client)=>{
    client.type = 'RM';
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

var driverConnect= (io, client) =>{
    console.log('driver connect id = ' + client.id)    
    client.type = 'DR';
    io.emit("event-driver-connecting", "aaaaaaaaaaaa");
}
module.exports.response = function(io, client){
    eventGetAll(io,client);
    eventGetAllReq(io,client);
    driverConnect(io,client);
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
    // client.on("event-driver-connecting", (req)=>{

    // });
}