var express = require('express');
var multer = require('multer');
var cookieParser = require('cookie-parser')
var fs = require("fs");
var bodyParser = require('body-parser');

var upload = multer({
	dest : 'uploads/' // this saves your file into a directory called "uploads"

});

var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
	extended : false
}));

app.use(cookieParser())

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
	ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'


var user = {
	"user4" : {
		"name" : "mohit",
		"password" : "password4",
		"profession" : "teacher",
		"id" : 4
	}
}


app.get('/', function(req, res) {
	console.log("Cookies: ", req.cookies)
	res.sendFile(__dirname + "/" + "index.html");
})


app.post('/fileupload', upload.single('file-to-upload'), (req, res) => {
	var originalFileName = req.file.originalname;

	console.log(req.file.path);

	fs.rename(req.file.path, 'uploads/' + originalFileName, function(err) {
		if (err) console.log('ERROR: ' + err);
	});

	res.redirect('/');
});


app.get('/listUsers', function(req, res) {
	fs.readFile(__dirname + "/" + "users.json", 'utf8', function(err, data) {
		//console.log(data);
		res.end(data);
	});
})

app.post('/addUser', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       data["user4"] = user;
       console.log( data );
       res.end( JSON.stringify(data));
   });
})


app.get('/getUser/:id', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      var users = JSON.parse( data );
      var user = users["user" + req.params.id] 
      console.log( user );
      res.end( JSON.stringify(user));
   });
})


app.delete('/deleteUser/:id', function (req, res) {

   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       delete data["user" + req.params.id];
       
       console.log( data );
       res.end( JSON.stringify(data));
   });
})


app.listen(port, ip);
console.log("Example app listening at http://%s:%s", ip, port);