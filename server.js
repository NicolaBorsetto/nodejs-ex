var express = require('express');
var multer = require('multer');
var fs = require("fs");
var bodyParser = require('body-parser');

var upload = multer({
  dest: 'uploads/' // this saves your file into a directory called "uploads"
	  
}); 

var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));


var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'


app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})


app.post('/fileupload', upload.single('file-to-upload'), (req, res) => {
	  var originalFileName = req.file.originalname;
	  
	  console.log(req.file.path);	   
	   	 
	  fs.rename(req.file.path, 'uploads/'+originalFileName, function(err) {
		    if ( err ) console.log('ERROR: ' + err);
		}); 
	
	 res.redirect('/');
});



app.listen(port, ip);
console.log("Example app listening at http://%s:%s", ip, port);

