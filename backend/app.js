var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 1234;
var app = express();
var reqCtrl = require('./APIcontrollers/requestCtrl')

var RequestRepos =  require ('./repos/request-receiver');
const requestRepos = new RequestRepos();


app.use(cors());
app.use(bodyParser.json());



requestRepos.getAll()
.then((rows) => console.log(rows));



app.use('/api/req/', reqCtrl);




// catch bad request
app.use((req,res)=>{
    res.status(404).send({url: req.originalUrl + ' not found'})
});
app.listen(PORT, ()=>{
    console.log('Server running at port ' + PORT);
});