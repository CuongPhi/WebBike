var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 1234;
var app = express();
var CategoriesReps =  require ('./repos/categories');

const categoriesReps = new CategoriesReps();

app.use(cors());
app.use(bodyParser.json());



categoriesReps.getAll()
.then((rows) => console.log(rows));








// catch bad request
app.use((req,res)=>{
    res.status(404).send({url: req.originalUrl + ' not found'})
});
app.listen(PORT, ()=>{
    console.log('Server running at port ' + PORT);
});