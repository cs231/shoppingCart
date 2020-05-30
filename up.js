var fs = require('fs');
var express = require('express')
var app = express();
var busboy = require('connect-busboy');

app.use(busboy());
var busboyBodyParser = require('busboy-body-parser');
app.use(busboyBodyParser({ multi: true }));
app.post('/fileupload', function(req, res) {
    var fstream;
	var fname=req.files.fname;
		var lname=req.files.lname;
			var id=req.files.id;
			
			
			
	var path="fname" + "lname" + "id" + ".pdf";
	//var fname=req.body.fname;
	console.log(fname);
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename); 

        fstream = fs.createWriteStream(__dirname + '/public/'  + path);
        file.pipe(fstream);
        fstream.on('close', function () {
            res.redirect('back');
        });
    });

});


app.listen(3000,function(){
	
console.log('server started')}
);