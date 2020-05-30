var express = require('express')
var bodyParser = require('body-parser')
var mysql= require('mysql') 
var app = express()
 //var FormData = require('form-data');
 var upload=require("express-fileupload");
var fs = require('fs');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true}))
 var busboy = require('connect-busboy');

app.use(busboy());
var busboyBodyParser = require('busboy-body-parser');
app.use(busboyBodyParser({ multi: true }));
// parse application/json
app.use(bodyParser.json())
app.use(upload());
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "login1"
});

connection.connect(function (error) {
  if (error) throw error;
  console.log("connection established");
 
});

app.listen(8081);

  app.post('/read', function (req, res, next){
var readdata= fs.readFile('12.txt','utf-8',
function(error,results){
	console.log(readdata);
  res.jsonp({
		   status: 1,
          error: null,
         data:results

});

});

  });

  app.post('/signup', function (req, res, next) {
	  		//	 console.log(req.body)
//var email=req.body.email;
	     connection.query("SELECT * FROM mytask WHERE email = ?",[req.body.email], function (error, results, fields) {
		//	 console.log(results)
  if (results.length>0) {

	  res.jsonp({
		   status: 1,
          error: null,
          "message":"User is already exists"
  })
  
  
  }

	else {
		var email=req.body.email;
		if(email){
	  connection.query("INSERT INTO mytask (fname,lname,mobile,email,password) VALUES (?,?,?,?,?)", 
	  [req.body.fname,
	  req.body.lname,
	  req.body.mobile,
	  req.body.email,
	  req.body.password]
	  
	  , function (
    error,
    results,
    fields
  ) {
    if (error) {
      res.jsonp({ status: 0, error: error });
    } else {
      if (results.insertId) {
        res.jsonp({
          status: 1,
          error: null,
          message: "you are Registered Successfully"
        });
      } else {
        res.jsonp({ status: 0, error: null, message: "no data available" });
      }
    }
  })
		}
			else{
			res.send({  
			message:"all fileds are Required"
			})
		}
		
		
        
  }
    })
  });

  app.post('/login',function(req,res){
  var email= req.body.email;
  var password = req.body.password;
  var usertype=req.body.usertype;

  if(usertype==0){  

  connection.query('SELECT * FROM vendor WHERE username = ? && password=? ',[req.body.username,req.body.password],
  function (error, results, fields) {
	
    if(results.length >0){
      if(results[0].password == password){
		  
        res.send({
         
          "message":"vendor is sucessfully logged in",
			data:results,
		  
            });  }
	
	}

  })

  }  
else{
				
if(email && password){
  connection.query('SELECT * FROM mytask WHERE email = ? && password=? ',[req.body.email,req.body.password],
  function (error, results, fields) {
	
    if(results.length >0){
      if(results[0].password == password){
		  
        res.send({
         
          "message":"login sucessful",
			data:results,
		  
            });
		
		
			
		
      }
      else{
        res.send({
      
          "message":"Email and password does not match"
            });
      }
    }
    else{
      res.send({
       
        "message":"Email does not exits"
          });
    }
  
  });
}


else{  res.send({
      
          "message":"all fields are required"
            });}
}
}); 


app.post('/reset',function(req,res){
	 console.log(req.body)
	connection.query('SELECT * FROM mytask WHERE email = ? AND password=?',[req.body.email,req.body.password],
	 function (error, results, fields) {
	 console.log(results)
	 if(results.length >0){
	connection.query("UPDATE mytask SET password = ? WHERE email=?", [req.body.newpassword,req.body.email] ,
	function (error, results) {
		res.jsonp({
              status: 1,
              error: null,
              message: "Password reset succesfully",
			
            }); 	
	})
	 }
   
   else {
		
	 res.jsonp({
              status: 0,
              error: null,
              message: "all fields are required",
			 
            }); 
   }
   
  });
  
   });
 
 
app.post('/view_profile',function(req,res){
var email=req.body.email;
var password=req.body.password;
if(email && password){
 connection.query("select * from mytask where password = ? && email = ?", [req.body.password,req.body.email], 
 function(error, results){
    
	 if(results.length>0){
		 
			res.jsonp({
              status: 1,
              error: null,
              message: "view profile details" ,
			  data: results
            });
		 
		 
	 }
	  else{
			 res.jsonp({
              status: 0,
              error: null,
              message: "There is no such profile for this username",
            });
		 }
	 
 }); 
}else{ res.jsonp({
              status: 0,
              error: null,
              message: "All fields are required",
            }); }
 
});

app.post('/view_products',function(req,res){
console.log(req.body);
if({}){
connection.query("select * from products where username = ? ", [req.body.username], 
 function(error, results){
	 if(results.length>0){
	  res.jsonp({
              status: 1,
              error: null,
              data:results
            });
	 }

else{   res.jsonp({
              status: 1,
              error: null,
             message:"NO SUCH ITEMS FOR THIS USERNAME ",
            });   }	 
 })
}
else{
	
res.jsonp({
              status: 0,
              error: null,
              message: "No fields are required",
            });

 }
 
});

 
app.post('/place_order',function(req,res){
var id=req.body.id;
var email=	req.body.email;
if(id && email){
connection.query("SELECT * FROM products where id=?", [req.body.id], function(error, results){

	 if(results.length>0){
	 connection.query("INSERT INTO orders (id, email) VALUES (? , ?)", [req.body.id,req.body.email],
	 function(error, results){

	  if(results.affectedRows==1){
	res.jsonp({
              status: 1,
              error: null,
			  message:"your order has been placed",
            });
		}
	 else{  
	console.log("jds");
			}
		})
	 }
	 else {   res.jsonp({
              status: 0,
              error: null,
			  message:"No such items for this id ",
				}); 
				}
 })
}
else{  res.jsonp({
              status: 0,
              error: null,
			  message:"email and id are required ",
				});  }


	 });
	 
 
app.post('/place_order',function(req,res){
var id=req.body.id;
var email=	req.body.email;
if(id && email){
connection.query("SELECT * FROM products where id=?", [req.body.id], function(error, results){

	 if(results.length>0){
	 connection.query("INSERT INTO orders (id, email) VALUES (? , ?)", [req.body.id,req.body.email],
	 function(error, results){

	  if(results.affectedRows==1){
	res.jsonp({
              status: 1,
              error: null,
			  message:"your order has been placed",
            });
		}
	 else{  
	console.log("jds");
			}
		})
	 }
	 else {   res.jsonp({
              status: 0,
              error: null,
			  message:"No such items for this id ",
				}); 
				}
 })
}
else{  res.jsonp({
              status: 0,
              error: null,
			  message:"email and id are required ",
				});  }


	 });
	 
 
app.post('/place_order',function(req,res){
var id=req.body.id;
var email=	req.body.email;
if(id && email){
connection.query("SELECT * FROM products where id=?", [req.body.id], function(error, results){

	 if(results.length>0){
	 connection.query("INSERT INTO orders (id, email) VALUES (? , ?)", [req.body.id,req.body.email],
	 function(error, results){

	  if(results.affectedRows==1){
	res.jsonp({
              status: 1,
              error: null,
			  message:"your order has been placed",
            });
		}
	 else{  
	console.log("jds");
			}
		})
	 }
	 else {   res.jsonp({
              status: 0,
              error: null,
			  message:"No such items for this id ",
				}); 
				}
 })
}
else{  res.jsonp({
              status: 0,
              error: null,
			  message:"email and id are required ",
				});  }


	 });

	  app.post('/view_orders',function(req,res){
		  var email=req.body.email;
		  if(email){
 connection.query(" SELECT * FROM orders,products where orders.id=products.id && email=?",[req.body.email],
    function(error, results){
	// console.log(results)
	if(results.length>0){
	  res.jsonp({
              status: 1,
              error: null,
			  message:"your orders",
              data:results
            }); 
			
	}else{    res.jsonp({
              status: 0,
              error: null,
			  message:"No such orders for this id",
            
            });    }
			
 })
		  }
		  
		  else{   res.jsonp({
              status: 0,
              error: null,
			  message:"email is required",
            
            }); }
});
 	  


app.post('/cancel_order',function(req,res){
	var id=req.body.id;
	if(id){
 connection.query(" DELETE FROM `orders` WHERE `orders`.`id` = ? " , [req.body.id],
 function(error, results){
	// console.log(results)
	 if(results.affectedRows>0){
	  res.jsonp({
              status: 1,
              error: null,
              message:"Your order has been cancelled",
            });
	 }
	 
	 else{
		 // console.log(results)
		   res.jsonp({
              status: 0,
              error: null,
              message:"no such items for this id",
            }); 
	 }
 })
	} else {  
	
	   res.jsonp({
              status: 0,
              error: null,
              message:"Id is required for cancelling the item",
            })
	}
});	 

 app.post('/address',function(req,res){
var id=req.body.id;
var address1=req.body.address1;
if(id && address1){
 connection.query("INSERT INTO address (address1,address2,id) VALUES (? ,?,?)",
 [req.body.address1,req.body.address2,req.body.id], 
 function(error, results){
	// console.log(results);
	  res.jsonp({
              status: 1,
              error: null,
			  message:"address updated succesfully",
            });
			
 })
}else
{ 
 res.jsonp({
              status: 1,
              error: null,
			  message:"address1 and id are required",
            });
		
}	

});

 app.post('/view_address',function(req,res){
 var email=req.body.email;
 if(email){
 connection.query("SELECT * FROM orders,address WHERE orders.id=address.id && orders.email=? ", [req.body.email], 
 function(error, results){
	 
	 if(results.length>0){
	// console.log(results);
	  res.jsonp({
              status: 1,
              error: null,
				data:results,
	 }); }
	 
	 else{ 
	 
			  res.jsonp({
              status: 0,
              error: null,
			  message:"email is required",
				
	 }); }
			
 })
 }
 
 else{	  res.jsonp({
              status: 0,
              error: null,
			  message:"all fields are required",
				
	 });  }
 
 
});

	 	 
app.post('/add_products',function(req,res){
	   var prod_name= req.body.prod_name; 
		var price= req.body.price;
	     var username=req.body.username;
			var categories= req.body.categories;
		if(prod_name && price && username && categories)
		{ 
	
connection.query(" SELECT * FROM products,vendor where prod_name = ? && price=? && vendor.username=? " , 
[req.body.prod_name,req.body.price,req.body.username],
 function(error, results){
  console.log(results);
  if(results.length>0){
	  
  res.jsonp({
              status: 1,
              error: null,
			  message:"This item is already present in the store",
				
	 }); 
  
  }
  else { 

  connection.query("INSERT INTO products (prod_name,price,username,categories) VALUES (?,?,?,?)",
  [req.body.prod_name,req.body.price,req.body.username,req.body.categories] ,
  function (error, results, fields){
    if(results.affectedRows>0){  
		
connection.query("SELECT * FROM vendor where username=?",[req.body.username],function(error, results, fields){
 
if(results.length>0){ 
	
res.jsonp({
              status: 1,
              error: null,
			  message:"this Item has been added",
				
	 }); 
	 
}else { res.jsonp({
              status: 0,
              error: null,
			  message:"Username is Incorrect",
				
	 });   }
	}) 
	
	}
	 else{ 
		 res.jsonp({
              status: 0,
              error: null,
			  message:"add items",
				
	 }); }
})

 }
 
});

  }
       else{

			res.jsonp({
              status: 0,
              error: null,
			  message:"all fields are required",
				
	 }); }
		
}); 


app.post('/remove_products',function(req,res){
	var id=req.body.id;
	var username=req.body.username;
	if(id && username){
 connection.query(" DELETE FROM products WHERE products.id = ? && products.username=? " , [req.body.id,req.body.username],
 function(error, results){
	// console.log(results)
	 if(results.affectedRows>0){
	  res.jsonp({
              status: 1,
              error: null,
              message:"Your product has been removed",
            });
	 }
	 
	 else{
		 // console.log(results)
		   res.jsonp({
              status: 0,
              error: null,
              message:"no such items for this username",
            }); 
	 }
 })
	} else {  
	
	   res.jsonp({
              status: 0,
              error: null,
              message:"Id and username is required for removing  the item",
            })
	}
});	 

app.post('/update_products',function(req,res){
	 var id=req.body.id;
	 var username=req.body.username;
	 var newprice=req.body.newprice;
	 if( id && username && newprice){
	connection.query('SELECT * FROM products WHERE username =? && id=?',[req.body.username,req.body.id],
	 function (error, results, fields) {
	 console.log(results)
	 if(results.length >0){
	connection.query("UPDATE products SET price = ? WHERE username=?", [req.body.newprice,req.body.username] ,
	function (error, results) {
		res.jsonp({
              status: 1,
              error: null,
              message: "Products updated succesfully",
			
            }); 	
	})
	 }
   
   else {
		
	 res.jsonp({
              status: 0,
              error: null,
              message: "add new price first",
			 
            }); 
   }
   
	 
   
  });
	 }
	 else{  res.jsonp({
              status: 0,
              error: null,
              message: "all fields are required",
			 
            });  }
	 
   });


 app.post('/count_products',function(req,res){
 // var email=req.body.email;
 if(true){
 connection.query("SELECT COUNT(prod_name) FROM products ", [], 
 function(error, results){
	 
	 if(results.length>0){
	// console.log(results);
	  res.jsonp({
              status: 1,
              error: null,
				data:results,
	 }); }
	 
	 else{ 
	 
			  res.jsonp({
              status: 0,
              error: null,
			  message:"email is required",
				
	 }); }
			
 })
 }
 
 else{	  res.jsonp({
              status: 0,
              error: null,
			  message:"all fields are required",
				
	 });  }
 
 
});


app.post('/categories',function(req,res){
 var cat=req.body.categories;
 if(cat){ 
 
 if(cat=='A'){
 connection.query("INSERT INTO items(phone,price) SELECT prod_name,price FROM products where categories=? ", [req.body.categories], 
 function(error, results){
	 
	 if(results.affectedRows>0){
		 
	
// console.log(results);
connection.query("SELECT phone,price FROM items WHERE NOT phone='' GROUP BY phone", [], 
 function(error, results){
// console.log(results);
if(results.length>0){
res.jsonp({
              status: 1,
              error: null,
				data:results,
	 });

	 }
		  else{ 	
	  res.jsonp({
              status:0,
              error: null,
	  message:" no products for this category", 
			
	 }); }
 })
 
	 }
	 else{ 
	 
			  res.jsonp({
              status: 0,
              error: null,
			  message:"No items Found",
				
	 }); }
			
 }) 
 }
 else if(cat=='B') {
	 
	 connection.query("INSERT INTO items(laptops,price) SELECT prod_name,price FROM products where categories=? ", [req.body.categories], 
 function(error, results){
	 
	 if(results.affectedRows>0){
		 
	
// console.log(results);
connection.query("SELECT laptops,price FROM items WHERE NOT laptops='' GROUP BY laptops", [], 
 function(error, results){
// console.log(results);
if(results.length>0){
res.jsonp({
              status: 1,
              error: null,
				data:results,
	 });

	 }
		  else{ 	
	  res.jsonp({
              status:0,
              error: null,
	  message:" no products for this category", 
			
	 }); }
 })
 
	 }
	 else{ 
	 
			  res.jsonp({
              status: 0,
              error: null,
			  message:"No items Found",
				
	 }); }
			
 }) 
   }
   
  else if(cat=='C') {
	 
	 connection.query("INSERT INTO items(TV,price) SELECT prod_name,price FROM products where categories=? ", [req.body.categories], 
 function(error, results){
	 
	 if(results.affectedRows>0){
		 
	
// console.log(results);
connection.query("SELECT TV,price FROM items WHERE NOT TV='' GROUP BY TV", [], 
 function(error, results){
// console.log(results);
if(results.length>0){
res.jsonp({
              status: 1,
              error: null,
				data:results,
	 });

	 }
		  else{ 	
	  res.jsonp({
              status:0,
              error: null,
	  message:" no products for this category", 
			
	 }); }
 })
 
	 }
	 else{ 
	 
			  res.jsonp({
              status: 0,
              error: null,
			  message:"No items Found",
				
	 }); }
			
 }) 
   }

 else if(cat=='D') {
	 
	 connection.query("INSERT INTO items(FREEZE,price) SELECT prod_name,price FROM products where categories=?  ", [req.body.categories], 
 function(error, results){
	 
	 if(results.affectedRows>0){
		 
	
// console.log(results);
connection.query("SELECT FREEZE,price FROM items WHERE NOT freeze='' GROUP BY FREEZE;", [], 
 function(error, results){
// console.log(results);
if(results.length>0){
res.jsonp({
              status: 1,
              error: null,
				data:results,
	 });

	 }
		  else{ 	
	  res.jsonp({
              status:0,
              error: null,
	  message:" no products for this category", 
			
	 }); }
 })
 
	 }
	 else{ 
	 
			  res.jsonp({
              status: 0,
              error: null,
			  message:"No items Found",
				
	 }); }
			
 }) 
   }    
    else{ 
	 
			  res.jsonp({
              status: 0,
              error: null,
			  message:"No items Found for this category",
				
	 }); } 
   
 }
 
 else{	  res.jsonp({
              status: 0,
              error: null,
			  message:"all fields are required",
				
	 });  }
 

});


 app.post('/searchbox',function(req,res){
  var prod_name=req.body.prod_name;
 if(prod_name){
 connection.query("SELECT * from products where prod_name LIKE %? ", [prod_name], 
 function(error, results){
	 
	 if(results.length>0){
	// console.log(results);
	  res.jsonp({
              status: 1,
              error: null,
				data:results,
	 }); }
	 
	 else{ 
	 
			  res.jsonp({
              status: 0,
              error: null,
			  message:"No results found",
				
	 }); }
			
 })
 }
 
 else{	  res.jsonp({
              status: 0,
              error: null,
			  message:"all fields are required",
				
	 });  }
 
 
});

app.post('/upload',function(req,res){
	//var file=req.body.filename;
	var fname=req.body.fname;
	var lname=req.body.lname;
	var email=req.body.email;

	
	//	console.log(req.body.filename);
console.log(req.files);
	
if(req.files){
	var file=req.files.filename;
	//	console.log(file.name);
		
	var id=req.files.id;
		var file=req.files.filename,
		filename=file.name;
		console.log(req.files);
		if(id==1){
		file.mv("./vendor1/"+filename,function(err){
			
			if(err){
				
				console.log(err);
				res.send("error occured");
			}
			else{
		
			res.send("done");
			}
		})
}	
else if(id==2){ 	file.mv("./vendor2/"+filename,function(err){
			
			if(err){
				
				console.log(err);
				res.send("error occured");
			}
			else{
		
			res.send("done");
			}
		})
		
		}else{	res.send("error") }
	}
	

});