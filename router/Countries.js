var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var cors = require('cors');
app.use(cors());
var router = express.Router();
var parser = require('xml2json');
 var fs = require('fs'),
    path = require('path'),
    xmlReader = require('read-xml');
var options = {
    object: true,
    reversible: false,
    coerce: false,
    sanitize: true,
    trim: true,
    arrayNotation: false,
    alternateTextNode: false
};
router.get('/CountriesList', function (req, res) {

 
	var FILE = path.join(__dirname, 'Countries.xml');
	 
	// pass a buffer or a path to a xml file 
	xmlReader.readXML(fs.readFileSync(FILE), function(err, data) {
	  if (err) {
	    console.error(err);
	  }
	 
	  		// console.log('xml encoding:', data.encoding);
	  		// console.log('Decoded xml:', data.content);
	  		var json = parser.toJson(data.content,options);
			// console.log("to json -> %s", json);
			res.send({"status": "OK", "Message":"successfully get Products","resObject":{"Countries" : json.Countries.Country} });
	});
	// var xml = "<foo attr=\"value\">bar</foo>";
	// console.log("input -> %s", xml)
 
	// xml to json 
	
 
	// json to xml 
	// var xml = parser.toXml(json);
	// console.log("back to xml -> %s", xml)
});

module.exports = router;