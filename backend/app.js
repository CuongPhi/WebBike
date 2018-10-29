var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 1234;
var app = express();
var reqCtrl = require('./APIcontrollers/requestCtrl')

var io = require('socket.io').listen(PORT + 1);
var request_io = require('./Socket.ioController/request.io');

app.use(cors());
app.use(bodyParser.json());

var event_req = io.on('connection', client =>{
    console.log('client connected, id = ' + client.id);
    request_io.response(io, client); 

});
 


app.use('/api/req/', reqCtrl);




// catch bad request
app.use((req,res)=>{
    res.status(404).send({url: req.originalUrl + ' not found'})
});
app.listen(PORT, ()=>{
    console.log('Server running at port ' + PORT);
});