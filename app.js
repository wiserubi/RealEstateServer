var express = require('express');
var bodyParser = require('body-Parser');
var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname+'/public'));

var cors = require('cors')();
app.use(cors);

var users =[];
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'test1234',
  database : 'realestat'
});
 
connection.connect();

var MongoClient = require('mongodb').MongoClient;
 var url = 'mongodb://localhost:27017/restful';
 var dbObj = null;
 MongoClient.connect(url, function(err, db) {
   console.log("Connected correctly to server");
   dbObj = db;
 });

var multer = require('multer');
var Storage = multer.diskStorage({
     destination: function(req, file, callback) {
         callback(null, "./public/upload_image/");
     },
     filename: function(req, file, callback) {
     		file.uploadedFile = file.fieldname + "_" + 
     			Date.now() + "_" + file.originalname;
     		console.log('file.uploadedFile:'+file.uploadedFile);
         callback(null, file.uploadedFile);
     }
 });
 var upload = multer({
     storage: Storage
 }).single("image");
app.post('/user/picture',function(req, res) {
	upload(req, res, function(err) {
		if (err) {
			res.send(JSON.stringify(err));
		} else {
			res.send(JSON.stringify({url:req.file.uploadedFile,
				description:req.body.description}));
		}
	});
});

app.get('/user/message',function(req,res){
	console.log(req.query.sender_id);
	var condition = {};
	if(req.query.sender_id != undefined)
		condition = {sender_id:req.query.sender_id};

	var messages = dbObj.collection('messages');

	messages.find(condition)
	.toArray(function(err,results){
		if (err) {
 		    res.send(JSON.stringify(err));
 		} else {
 			res.send(JSON.stringify(results));
 		}

	});


});
var ObjectID = require('mongodb').ObjectID;

app.get('/user/message/:id',function(req,res){
	var messages = dbObj.collection('messages');
	messages.findOne(
 		{_id:ObjectID.createFromHexString(req.params.id)},
 		function(err, result){
 			if (err) {
 				res.send(JSON.stringify(err));
 			} else {
 				res.send(JSON.stringify(result));
 			}
 		});
  });

app.post('/user/message',function(req,res) {
 	console.log(req.body.sender_id);
 	console.log(req.body.reciever_id);
 	console.log(req.body.message);
 	connection.query(
		'select id,name from user where id=? or id=?',
 		[req.body.sender_id,req.body.reciever_id],
 		function(err, results, fields) {
 			if (err) {
 				res.send(JSON.stringify(err));
 			} else {
 				var sender = {};
 				var reciever = {};
 				for (var i = 0; i < results.length; i++){
 					if (results[i].id == 
 						Number(req.body.sender_id)) {
 						sender = results[i];
 					}
 					if (results[i].id ==
 						Number(req.body.reciever_id)) {
 						reciever = results[i];
 					}
 				}
 				var object = {
 					sender_id:req.body.sender_id,
 					reciever_id:req.body.reciever_id,
 					sender:sender, reciever:reciever,
 					message:req.body.message,
 					created_at:new Date()
 				}
 				var messages = dbObj.collection('messages');
 				messages.save(object, function(err, result){
 					if (err) {
 						res.send(JSON.stringify(err));
 					} else {
 						res.send(JSON.stringify(result));
 					}
 				});
 			}
 		});
 });

app.delete('/user/message/:id',function(req,res) {
 
 	var messages = dbObj.collection('messages');
 	messages.remove(
 		{_id:ObjectID.createFromHexString(req.params.id)},
 		function(err, result){
 			if (err) {
 				res.send(JSON.stringify(err));
 			} else {
				res.send(JSON.stringify(result));
 			}
 		});
  });
  


app.get('/user',function(req ,res){
	//res.send(JSON.stringify(users));
	connection.query('select * from users',
		function(err,result,fields){
			if(err){
				res.send(JSON.stringify(err));
			} else{
				res.send(JSON.stringify(result));
			}
		});
});

app.get('/offer',function(req ,res){
	//res.send(JSON.stringify(loan));
	connection.query('select * from offer',
		function(err,result,fields){
			if(err){
				res.send(JSON.stringify(err));
			} else{
				res.send(JSON.stringify(result));
			}
		});
});

app.get('/loan',function(req ,res){
	//res.send(JSON.stringify(loan));
	connection.query('select * from loan',
		function(err,result,fields){
			if(err){
				res.send(JSON.stringify(err));
			} else{
				res.send(JSON.stringify(result));
			}
		});
});


app.get('/user/:id',function(req,res){
	connection.query('select * from users where id=?',
		[req.params.id],function(err,results,fields){
			if(err){
				res.send(JSON.stringify(err));
			} else{
				if(results.length > 0){
					res.send(JSON.stringify(results[0]));

				}else{
					res.send(JSON.stringfy({}));
				}
			
			}

		});

});
app.post('/user',function(req,res){ 
	connection.query(
 		'insert into users(id,password,name,email,phone,address) values(?,? ,? ,? ,?,?)',
 		[ req.body.id, req.body.password , req.body.name, 
 		  req.body.email, req.body.phone , req.body.address], 
 		function(err, result) {
 			if (err) {
 				res.send(JSON.stringify(err));
 			} else {
 				res.send(JSON.stringify(result));
 			}
 		})
  });

app.post('/offer',function(req,res){ 
	connection.query(
 		'insert into offer(id,date,location_code,location_dong,location_dcode, total_amt,'+
 		 'original_amt, premium, rent , migration_fee, tax , jisang, myinterest '+
 		 'values(?,? ,? ,? ,?,? ,?,? ,? ,? ,?,? ,?,?)',
 		[ req.body.id, req.body.date , req.body.location, 
 		  req.body.location_code, req.body.location_dong , req.body.location_dcode,
 		  req.body.total_amt, req.body.original_amt , req.body.premium,
 		  req.body.total_amt, req.body.original_amt , req.body.premium,
 		  req.body.rent, req.body.migration_fee , req.body.tax , req.body.jisang , req.body.myinterest  ], 
 		function(err, result) {
 			if (err) {
 				res.send(JSON.stringify(err));
 			} else {
 				res.send(JSON.stringify(result));
 			}
 		})
  });


app.put('/user/:id',function(req,res){
	connection.query(
		'update users set name=?,age=? where id=?',
		[req.body.name, req.body.age, req.params.id],
		function(err,result){
			if(err){
				res.send(JSON.stringify(err));
			} else{
				res.send(JSON.stringify(result));
			}
		});

});
app.delete('/user/:id',function(req,res){
 
 	connection.query('delete from users where id=?',
 		[ req.params.id ], function(err, result) {
 			if (err) {
 				res.send(JSON.stringify(err));
 			} else {
 				res.send(JSON.stringify(result));
 			}
 		});
  });

app.delete('/offer/:id',function(req,res){
 
 	connection.query('delete from offer where id=?',
 		[ req.params.id ], function(err, result) {
 			if (err) {
 				res.send(JSON.stringify(err));
 			} else {
 				res.send(JSON.stringify(result));
 			}
 		});
  });
app.listen(52273,function(){
	console.log('Sever running');
});