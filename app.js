var express = require('express');
var path=require('path');
var app = express();
var pdfkit=require('pdfkit');
var port=5000;
var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true}));


app.use(express.static(path.join(__dirname,'public')));

app.post('/',function(req,res){
	
	res.sendFile("index.html");
});

var pdfRoute=require('./routes/pdfmake');
 app.use('/pdfMake',pdfRoute); 
app.listen(5000,function(){ 
	
console.log('server is running at http://localhost:5000/')}
);d