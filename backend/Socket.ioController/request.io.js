var RequestRepos =  require ('../repos/request-receiver');
var DriverRepos = require('../repos/driver');
var moment = require('moment');
const haversine = require('haversine')

var eventGetAll = (io,client)=>{
    RequestRepos.getAll_Stt0()
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
    RequestRepos.getAll()
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

var driverConnect = (io, client) =>{
    findRequest(client.u_id).then(user=>{
        client.emit("find-user-successfuly", JSON.stringify( user));
    })
    .catch(err => console.log(err));

}
    
/**
 * Function find request for driver
 */
var findRequest= (id) =>{
    return new Promise((resolve, reject)=>{
        DriverRepos.getById(id)
        .then(driver=>{
            if(driver){
                RequestRepos.getAll_Stt1().then(rows=>{
                    var min = null;
                    var user =null;
                    rows.forEach(element => {
                        req_location = {
                            latitude : element.lat,
                            longitude : element.lng
                        }
                        driver_location = {
                            latitude : driver.lat,
                            longitude : driver.lng
                        }                        
                        var long = haversine(driver_location, req_location);

                        if(!min || min >long) {
                            min=long;
                            user = element;
                        }
                    });
                    resolve(user);


                }).catch(err => reject(err));
            }
          
        }).catch(err => reject(err));
    });
   
}






module.exports.response = function(io, client){
    console.log(client.u_type)
    switch (client.u_type){
        case '2':
            driverConnect(io,client);
            break;
        case '0':
            eventGetAll(io,client);
            break;
        case '1':
            eventGetAllReq(io,client);
            break;    
    }

    client.on('disconnecting', (reason)=>{
        console.log('disconnecting, id = ' + client.id + reason);        
    });
    client.on('event-add-request', (obj)=>{
        var newReq = JSON.parse(obj);
        newReq.iat = moment().unix();
        RequestRepos.addRequest(newReq)
        .then(()=>{
           // eventGetAll(io);
        })
        .catch(err => console.log(err));
    });
    client.on('event-change-stt-to-1', (req)=>{
        var _req = JSON.parse(req);
        RequestRepos.locatedRequest(_req)
        .then(()=>{
            io.sockets.emit('event-change-stt-to-1-ok', req);
        })
    });
    // client.on("event-driver-connecting", (req)=>{

    // });
}