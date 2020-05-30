//reading a file assynchronously
var express = require('express')
//var fs= require('fs');
var path=require('path');
var app = express();
app.use(express.static(path.join(__dirname,'public')));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));
//var read = fs.readFileSync('12.txt','utf-8');

// console.log(read);


// creating a directory synchronously 
/*
fs.mkdirSync('stuff');

//creating a server


var http=require('http');
var server=http.createServer(function(req,res){ 
 res.end("hey ninjas");//ending the server and prints this msg

});

server.listen(3000,'127.0.0.1');//listening the server  without it we cant craete the server

//  http://127.0.0.1:3000/ run  on this address */
/*
var upload=require("express-fileupload");

app.use(upload()); */
app.get('/',function(req,res){
	
	res.sendFile("login.html");
});
/*
app.post('/r',function(req,res){
	
if(req.files){
	var file=req.files.filename;
		console.log(file.name);
		

		var file=req.files.filename,
		filename=file.name;
		file.mv("./stuff/"+filename,function(err){
			
			if(err){
				
				console.log(err);
				res.send("error occured");
			}
			else{
				res.send("done");
			}
		})
		
	}
	
	
});
 */
 
var pdfRoute=require('./routes/pdfmake');
 app.use('/pdfmake',pdfRoute);
app.listen(3000,function(){
	
console.log('server started')}
);