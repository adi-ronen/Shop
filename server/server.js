var express = require('express');
var bodyParser = require('body-parser');
var TYPES = require('tedious').TYPES;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var cors = require('cors');
app.use(cors());

var Users = require('./router/Users');
var Products = require('./router/Products');
var Orders = require('./router/Orders');
var Admins = require('./router/Admins');
var Countries = require('./router/Countries');
app.use("/Users", Users);
app.use("/Products", Products);
app.use("/Orders", Orders);
app.use("/Admins", Admins);
app.use("/Countries", Countries);

var port = 4000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
