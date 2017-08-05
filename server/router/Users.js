var express = require('express');
var moment = require('moment');
var bodyParser = require('body-parser');
var TYPES = require('tedious').TYPES;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var cors = require('cors');
app.use(cors());
var router = express.Router();
var DButilsAzure = require('../DBAzureUtils');

router.post('/Login', function (req, res) {
    var username = req.body.UserName;
    var password = req.body.Password;
    DButilsAzure.Select("Select Id,IsAdmin,Active,LastLogin from Users Where UserName='"+username+"' And Password='"+password+"' ").then(function (result) {
        var userId = result[0].Id;
        if(result.length==0){
              res.send({"status": "ERROR", "Message": "UserName Or Password not correct"});
        }else{
            var isAdmin =result[0].IsAdmin;
            var isActive =result[0].Active;
            var lastLogin=result[0].LastLogin;
            var query="UPDATE Users SET LastLogin='"+moment().format('YYYY-MM-DDThh:mm:ss')+"' WHERE UserName='"+username+"'";
            DButilsAzure.Insert(query).then(function (result) {
                res.send({"status": "OK", "Message":"User '"+userId+"' Loged in successfully", "resObject":{"UserId":userId,"IsActive":isActive,"IsAdmin":isAdmin,"LastLogin":lastLogin}});
            }).catch(function(err) {
                res.send({"status": "ERROR", "Message": "canot update LastLogin"});
            });
        }
    }).catch(function(err) {
        res.send({"status": "ERROR", "Message": err});
    });
});

router.post('/Register', function (req, res) {
    DButilsAzure.Select("Select Id from Users Where UserName='"+req.body.UserName+"'").then(function (result) {
        if(result.length>0) 
            res.send({"status": "ERROR", "Message": "Username Already Exist"});
        else{
            if(req.body && ( typeof req.body.UserName == 'undefined' || typeof req.body.Password == 'undefined' || typeof req.body.CountryId == 'undefined' ||
                typeof  req.body.ForgetPassQuastion == 'undefined' || typeof req.body.ForgetPassAns == 'undefined'|| typeof req.body.CategoriesId == 'undefined' || req.body.CategoriesId.length<1)){
                res.send({"status": "ERROR", "Message": "Wrong Data"});
            }else{
                var userValues=[ req.body.UserName,
                req.body.Password, 
                req.body.CountryId, 
                req.body.ForgetPassQuastion, 
                req.body.ForgetPassAns, 
                moment().format('YYYY-MM-DDThh:mm:ss'), 
                true, 
                false
                ];
                var userCategories=req.body.CategoriesId;
                console.log("userCategories: "+userCategories);
                var query= "INSERT INTO Users (UserName, Password, Country, PasswordQuastion, PasswordAnswer, LastLogin, Active, IsAdmin) VALUES (";
                var firstElement=true;
                userValues.forEach(function(element) {
                    if(!firstElement){
                        query+= ","
                    }
                    firstElement=false;
                    query+= "'" + element +"'";
                });
                query+= ")";
                DButilsAzure.Insert(query).then(function (result) {
                    DButilsAzure.Select("Select Id from Users Where UserName='"+req.body.UserName+"'").then(function (result) {
                        var userId = result[0].Id;
                        var query="";
                            userCategories.forEach(function(element) {
                                query+= "INSERT INTO UserCategories (UserId,CategoryId) VALUES ('"+userId+"','"+element+"');";
                            });
                            DButilsAzure.Insert(query).then(res.send({"status": "OK", "Message":"User '"+userId+"' added successfully"}))
                            .catch(function(err) {
                                res.send({"status": "ERROR", "Message": err});
                            });
                    }).catch(function(err) {
                        res.send({"status": "ERROR", "Message": err});
                    });
                }).catch(function(err) {
                    res.send({"status": "ERROR", "Message": err});
                });
            }
        }
    }).catch(function(err) {
        res.send({"status": "ERROR", "Message": err});
    });
});

router.get('/ForgetPassword/:username', function (req, res) {
    console.log("usernam : "+req.params.UserName);
    DButilsAzure.Select("Select PasswordQuastion from Users Where UserName='"+req.params.username+"'").then(function (result) {
        if(result.length>0)
            res.send({"status": "OK", "Message":"successfully get PasswordQuastion","resObject":{"PasswordQuastion" : result[0].PasswordQuastion} });
        else
            res.send({"status": "ERROR", "Message" : "user canot be found" });
    }).catch(function(err) {
        res.send({"status": "ERROR", "Message": err});
    });
});

router.post('/ForgetPassAnswer', function (req, res) {
    var UserName = req.body.UserName;
    var PasswordAns = req.body.ForgetPassAns;
    DButilsAzure.Select("Select Password from Users Where UserName='"+UserName+"' and PasswordAnswer='"+PasswordAns+"'" ).then(function (result) {
        if(result.length>0)
        {
            res.send({"status": "OK", "Message":"successfully get PasswordAnswer","resObject":{"Password" : result[0].Password} });
        }
        else
            res.send({"status": "ERROR", "Message" : "PasswordAnswer not correct" });
    }).catch(function(err) {
        res.send({"status": "ERROR", "Message": err});
    });

});

//-------------Categories------------------//
router.get('/CategoriesList', function (req, res) {
    DButilsAzure.Select('Select * from Categories').then(function (result) {
        res.send({"status": "OK", "Message":"successfully get Categories","resObject":{"Categories" : result} });
    }).catch(function(err) {
        res.send({"status": "ERROR", "Message": err});
    });
});

module.exports = router;