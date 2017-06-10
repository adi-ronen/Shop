var express = require('express');
var bodyParser = require('body-parser');
var TYPES = require('tedious').TYPES;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var cors = require('cors');
app.use(cors());
var router = express.Router();
var DButilsAzure = require('../DBAzureUtils');

router.get('/ListProducts', function (req, res) {
    DButilsAzure.Select("Select * from Products WHERE Active='true'").then(function (result) {
        res.send({"status": "OK", "Message":"successfully get Products","resObject":{"Products" : result} });
    }).catch(function(err) {
        res.send({"status": "ERROR", "Message": err});
    });
});

router.get('/HotProducts/:numberOfProducts', function (req, res) {
    let numberOfProducts = req.params.numberOfProducts;
    DButilsAzure.Select("Select * from Products WHERE Active='true' ORDER BY soldInPastWeek").then(function (result) {
        res.send({"status": "OK", "Message":"successfully get Products","resObject":{"Products" : result.slice(0,numberOfProducts)} });
    }).catch(function(err) {
        res.send({"status": "ERROR", "Message": err});
    });
});

router.get('/LastestProducts', function (req, res) {
    DButilsAzure.Select("Select * from Products WHERE Active='true' ORDER BY CreateDate DESC").then(function (result) {
        res.send({"status": "OK", "Message":"successfully get Products","resObject":{"Products" : result} });
    }).catch(function(err) {
        res.send({"status": "ERROR", "Message": err});
    });
});

router.get('/LastestProducts/:numberOfProducts', function (req, res) {
    let numberOfProducts = req.params.numberOfProducts;
    DButilsAzure.Select("Select * from Products WHERE Active='true' ORDER BY CreateDate DESC").then(function (result) {
        res.send({"status": "OK", "Message":"successfully get Products","resObject":{"Products" : result.slice(0,numberOfProducts)} });
    }).catch(function(err) {
        res.send({"status": "ERROR", "Message": err});
    });
});

router.get('/RecomandedProducts/:userName/:numberOfProducts', function (req, res) {
    let userName = req.params.userName;
    let numberOfProducts = req.params.numberOfProducts;
    DButilsAzure.Select("Select Id from Users Where UserName='"+userName+"'").then(function (result) {
        if (result.length > 0) {
            let userId = result[0].Id;
           DButilsAzure.Select("Select CategoryId FROM UserCategories Where UserId='"+userId+"'").then(function (result) {
            if (result.length > 0) {
                let isFirst= true;
                let query= "SELECT ProductId FROM ProductCategories WHERE"
                result.forEach(function(element) {
                    if (isFirst){
                        isFirst=false;
                        query+= " CategoryId='"+element.CategoryId+"'";
                    }
                    else
                        query+= " OR CategoryId='"+element.CategoryId+"'";
                });

                DButilsAzure.Select(query).then(function (result) {
                   if (result.length > 0) {
                    let isFirst= true;
                    let query= "SELECT * FROM Products WHERE"
                    result.forEach(function(element) {
                        if (isFirst){
                            isFirst=false;
                            query+= " Id='"+element.ProductId+"'";
                        }
                        else
                            query+= " OR Id='"+element.ProductId+"'";
                    });
                    query+= " ORDER BY soldInPastWeek";
                    DButilsAzure.Select(query).then(function (result) {
                        res.send({"status": "OK", "Message":"successfully get RecomandedProducts for this user","resObject":{"Products" : result.slice(0,numberOfProducts)} });
                    }).catch(function(err) {
                        res.send({"status": "ERROR", "Message": err});
                    });
                }else
                res.send({"status": "ERROR", "Message" : "canot find RecomandedProducts for this user, the list is empty", "resObject":{"Products" : []} });

            }).catch(function(err) {
                res.send({"status": "ERROR", "Message": err});
            });
        }else
        res.send({"status": "ERROR", "Message" : "canot find RecomandedProducts for this user, the list is empty", "resObject":{"Products" : []} });
    }).catch(function(err) {
        res.send({"status": "ERROR", "Message": err});
    });
    }else
    res.send({"status": "ERROR", "Message" : "user canot be found" });
    }).catch(function(err) {
        res.send({"status": "ERROR", "Message": err});
    });
});

router.get('/ProductById/:productId', function (req, res) {
    let productId = req.params.productId;
    DButilsAzure.Select("Select * from Products WHERE Id='"+productId+"'").then(function (result) {
        res.send({"status": "OK", "Message":"successfully get Products","resObject":{ "Products" : result } });
    }).catch(function(err) {
        res.send({"status": "ERROR", "Message": err});
    });
});

router.get('/ProductCategoriesById/:productId', function(req,res){
    let productId = req.params.productId;
    DButilsAzure.Select("Select CategoryId from ProductCategories WHERE ProductId='"+productId+"'").then(function (result) {
        res.send({"status": "OK", "Message":"successfully get Product Categories","resObject":{ "Categories" : result } });
    }).catch(function(err) {
        res.send({"status": "ERROR", "Message": err});
    });
});
module.exports = router;