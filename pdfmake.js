var express = require('express');
var app = express();

var router=express.Router();

module.exports=router;
const pdfMake=require('../pdfmake/pdfmake');
const vfsFont=require('../pdfmake/vfs_fonts');

pdfMake.vfs=vfsFont.pdfMake.vfs;

router.post('/pdf',function(req,res,next){
	
var fname=req.body.fname;
var lname=req.body.lname;

var dd = {
	content: [
		'Hello ${fname} ${lname}',
		'nice to meet you'
	]
	
}

var pdfDoc=pdfMake.createPdf(dd);
pdfDoc.getBase64(function(data){

	res.writeHead(200,
		{
		'content-Type': 'application/pdf',
		'content-Disposition':'attachment;filename="filename.pdf"'
		})
})

var download=Buffer.from(data.toString('utf-8'),'base64');
res.end(download);	


});