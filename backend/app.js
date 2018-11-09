var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 1234;
var app = express();
var reqCtrl = require('./APIcontrollers/requestCtrl')
var userCtrl = require('./APIcontrollers/userCtrl');
var io = require('socket.io', {origins:"*"}).listen(PORT + 1);
var request_io = require('./Socket.ioController/request.io');
var AuthRepos = require('./repos/auth');
const SECRET = 'ABCDEF';
var jwt = require('jsonwebtoken');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

var event_req = io.use(function(socket, next){
    if (socket.handshake.query && socket.handshake.query.token){
      jwt.verify(socket.handshake.query.token, SECRET, function(err, decoded) {
        if(err) return next(new Error('Authentication error'));
        socket.decoded = decoded;
        next();
      });
    } else {
        next(new Error('Authentication error'));
    }    
  })
.on('connection', client =>{
    request_io.response(io, client); 

});
 


app.use('/api/req/', reqCtrl);

app.use('/api/user/', userCtrl);



// catch bad request
app.use((req,res)=>{
    res.status(404).send({url: req.originalUrl + ' not found'})
});
app.listen(PORT, ()=>{
    console.log('Server running at port ' + PORT);
});