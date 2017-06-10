﻿var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment');
var TYPES = require('tedious').TYPES;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var cors = require('cors');
app.use(cors());
var router = express.Router();
var DButilsAzure = require('../DBAzureUtils');

router.use( function (req, res, next) {
    let adminusername = req.body.AdminUserName;
    let adminpassword = req.body.AdminPassword;
    DButilsAzure.Select("Select Id,IsAdmin from Users Where UserName='"+adminusername+"' And Password='"+adminpassword+"'").then(function (result) {
        if(result.length==0){
          res.send({"status": "ERROR", "Message": "Admin User Name Or Admin Password is not correct"});
      }else{
        if(result[0].IsAdmin)
            next();
        else
          res.send({"status": "ERROR", "Message": "Permission Denied!"});
  }

}).catch(function(err) {
    res.send({"status": "ERROR", "Message": err});
});
});

router.post('/AdminListUsers', function (req, res) {
   DButilsAzure.Select("Select * from Users").then(function (result) {
     res.send({"status": "OK", "Message":"get User List successfully to Admin", "resObject": result});
 }).catch(function(err) {
     res.send({"status": "ERROR", "Message": err});
 });
});

router.post('/AdminListOrders', function (req, res) {
   DButilsAzure.Select("Select * from Basket").then(function (result) {
     res.send({"status": "OK", "Message":"get Basket List successfully to Admin", "resObject": result});
 }).catch(function(err) {
     res.send({"status": "ERROR", "Message": err});
 });
});

router.post('/AdminListProducts', function (req, res) {
   DButilsAzure.Select("Select * from Products").then(function (result) {
     res.send({"status": "OK", "Message":"get Products List successfully to Admin", "resObject": result});
 }).catch(function(err) {
     res.send({"status": "ERROR", "Message": err});
 });
});

router.post('/AdminAddProduct', function (req, res) {
    let name =req.body.Product.Name;
    let weight = req.body.Product.Weight;
    let color = req.body.Product.Color;
    let price = req.body.Product.Price;
    let description = req.body.Product.Description;
    let quantityInStock = req.body.Product.QuantityInStock;
    let active = req.body.Product.Active;
    let soldInPastWeek = req.body.Product.SoldInPastWeek;
    let productCategories = req.body.Product.CategoriesId;
    let imgUrl = req.body.Product.ImgUrl;

    if(req.body && typeof req.body.Product == 'undefined' &&( typeof req.body.Product.Weight == 'undefined' || typeof req.body.Product.Color == 'undefined' || typeof req.body.Product.Price == 'undefined' ||
     typeof  req.body.Product.Name == 'undefined' || typeof req.body.Product.Description == 'undefined'|| typeof req.body.Product.QuantityInStock == 'undefined'|| typeof req.body.Product.Active == 'undefined'||
      typeof req.body.Product.soldInPastWeek == 'undefined' || typeof req.body.Product.productCategories == 'undefined' || productCategories.length<1 ||
      typeof req.body.Product.ImgUrl == 'undefined' )){
       res.send({"status": "ERROR", "Message": "Wrong Data"});
}else{
    let query1="Select Id from Products Where Name='"+name+"'"+
    " AND Weight='"+weight+"'"+
    " AND Color='"+color+"'"+
    " AND Price='"+price+"'"+
    " AND Description='"+description+"'";
    DButilsAzure.Select(query1).then(function (result) {
        if(result.length>0) 
         res.send({"status": "ERROR", "Message" : "Product Already Exist" });
     else{
        let time = moment().format('YYYY-MM-DDThh:mm:ss');
        let productValues=[ name,
        weight,
        color,
        price,
        description,
        quantityInStock,
        active,
        soldInPastWeek,
        imgUrl,
        time
        ];
        let query= "INSERT INTO Products (Name, Weight, Color, Price, Description, QuantityInStock, Active, soldInPastWeek, ImgUrl,CreateDate) VALUES (";
        let firstElement=true;
        productValues.forEach(function(element) {
            if(!firstElement){
                query+= ","
            }
            firstElement=false;
            query+= "'" + element +"'";
        });
        query+= ")";
        DButilsAzure.Insert(query).then(function (result) {
            DButilsAzure.Select(query1).then(function (result) {
                let productId = result[0].Id;
                console.log("productId: "+productId);
                let query="";
                productCategories.forEach(function(element) {
                    console.log("element.CategoryId: "+element);
                    query+= "INSERT INTO ProductCategories (ProductId,CategoryId) VALUES ('"+productId+"','"+element+"');";
                });
                console.log("3: "+query);
                DButilsAzure.Insert(query).then(res.send({"status": "OK", "Message":"User added successfully"}))
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
}).catch(function(err) {
 res.send({"status": "ERROR", "Message": err});
}); 
}
});

router.put('/AdminUpdateProduct', function (req, res) {
    let id = req.body.Product.Id;
    let weight = req.body.Product.Weight;
    let color = req.body.Product.Color;
    let price = req.body.Product.Price;
    let name =req.body.Product.Name;
    let description = req.body.Product.Description;
    let quantityInStock = req.body.Product.QuantityInStock;
    let active = req.body.Product.Active;
    let soldInPastWeek = req.body.Product.SoldInPastWeek;
    let productCategories = req.body.Product.CategoriesId;
    let imgUrl = req.body.Product.ImgUrl;    
    if(req.body && typeof req.body.Product == 'undefined' &&( typeof req.body.Product.Id == 'undefined' ||typeof req.body.Product.Weight == 'undefined' || typeof req.body.Product.Color == 'undefined' || typeof req.body.Product.Price == 'undefined' ||
     typeof  req.body.Product.Name == 'undefined' || typeof req.body.Product.Description == 'undefined'|| 
     typeof req.body.Product.QuantityInStock == 'undefined'|| typeof req.body.Product.Active == 'undefined'|| 
     typeof req.body.Product.SoldInPastWeek == 'undefined' || typeof req.body.Product.CategoriesId == 'undefined' || 
     productCategories.length<1 || typeof req.body.Product.ImgUrl == 'undefined')){
        res.send({"status": "ERROR", "Message": "Wrong Data"});
    }else{
        let query="UPDATE Products SET "+
        " name='"+name+"',"+
        " weight='"+weight+"',"+
        " color='"+color+"',"+
        " price='"+price+"',"+
        " description='"+description+"',"+
        " quantityInStock='"+quantityInStock+"',"+
        " active='"+active+"',"+
        " soldInPastWeek="+soldInPastWeek+","+
        " ImgUrl='"+imgUrl+"'"+
        " Where Id="+id; 
        DButilsAzure.Insert(query).then(function (result) {
            let query="DELETE FROM ProductCategories Where ProductId="+id;
            DButilsAzure.Insert(query).then(function (result) {
                let query="";
                productCategories.forEach(function(element) {
                    query+= "INSERT INTO ProductCategories (ProductId,CategoryId) VALUES ('"+id+"','"+element+"');";
                });
                DButilsAzure.Insert(query).then(res.send({"status": "OK", "Message":"User added successfully"}))
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
});

router.post('/AdminAddUser', function (req, res) {
   DButilsAzure.Select("Select Id from Users Where UserName='"+req.body.User.UserName+"'").then(function (result) {
    if(result.length>0) 
        res.send({"status": "ERROR", "Message": "Username Already Exist"});
    else{
        if(req.body && ( typeof req.body.User.UserName == 'undefined' || typeof req.body.User.Password == 'undefined' || typeof req.body.User.CountryId == 'undefined' ||
          typeof  req.body.User.ForgetPassQuastion == 'undefined' || typeof req.body.User.ForgetPassAns == 'undefined' || typeof req.body.User.Active == 'undefined' || typeof req.body.User.IsAdmin == 'undefined')){
            res.send({"status": "ERROR", "Message": "Wrong Data"});
    }else{
        let userValues=[ req.body.User.UserName,
        req.body.User.Password, 
        req.body.User.CountryId, 
        req.body.User.ForgetPassQuastion, 
        req.body.User.ForgetPassAns, 
        moment().format('YYYY-MM-DDThh:mm:ss'), 
        req.body.User.Active, 
        req.body.User.IsAdmin
        ];
        let userCategories=req.body.User.CategoriesId;
        console.log("userCategories: "+userCategories);
        let query= "INSERT INTO Users (UserName, Password, Country, PasswordQuastion, PasswordAnswer, LastLogin, Active, IsAdmin) VALUES (";
        let firstElement=true;
        userValues.forEach(function(element){
            if(!firstElement){
                query+= ","
            }
            firstElement=false;
            query+= "'" + element +"'";
        });
        query+= ")";
        DButilsAzure.Insert(query).then(function (result) {
            DButilsAzure.Select("Select Id from Users Where UserName='"+req.body.User.UserName+"'").then(function (result) {
                let userId = result[0].Id;
                let query="";
                if (userCategories.length >0){
                    userCategories.forEach(function(element) {
                        console.log("element.CategoryId: "+element);
                        query+= "INSERT INTO UserCategories (UserId,CategoryId) VALUES ('"+userId+"','"+element+"');";
                    });
                    DButilsAzure.Insert(query).then(res.send({"status": "OK", "Message":"User added successfully By Admin"}))
                    .catch(function(err) {
                        res.send({"status": "ERROR", "Message": err});
                    });
                }else
                res.send({"status": "OK", "Message":"User added successfully By Admin"});
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

router.put('/AdminUpdateUser', function (req, res) {
    let userId = req.body.User.Id;
   DButilsAzure.Select("Select * from Users Where Id='"+userId+"'").then(function (result) {
    if(result.length==0) 
        res.send({"status": "ERROR", "Message": "User Not Exist"});
    else{
        if(req.body && typeof req.body.User == 'undefined' &&( typeof req.body.User.UserName == 'undefined' || typeof req.body.User.Password == 'undefined' || typeof req.body.User.CountryId == 'undefined' ||
          typeof  req.body.User.ForgetPassQuastion == 'undefined' || typeof req.body.User.ForgetPassAns == 'undefined' || typeof req.body.User.Active == 'undefined' ||
          typeof req.body.User.IsAdmin == 'undefined')){
            res.send({"status": "ERROR", "Message": "Wrong Data"});
    }else{
       let id = result[0].Id;
       let query = "UPDATE Users SET "+
       "UserName='"+req.body.User.UserName+"' , "+
       "Password='"+req.body.User.Password+"' , "+ 
       "Country='"+req.body.User.CountryId+"' , "+ 
       "PasswordQuastion='"+req.body.User.ForgetPassQuastion+"' , "+ 
       "PasswordAnswer='"+req.body.User.ForgetPassAns+"' , "+ 
       "Active='"+req.body.User.Active+"' , "+ 
       "IsAdmin='"+req.body.User.IsAdmin+"' "+
       "WHERE Id="+id;
       let userCategories=req.body.User.CategoriesId;
       DButilsAzure.Insert(query).then(function (result) {
        DButilsAzure.Insert("DELETE FROM UserCategories WHERE UserId="+id).then(function (result) {
           let query="";
           if (userCategories.length >0){
               userCategories.forEach(function(element) {
                   console.log("element.CategoryId: "+element);
                   query+= "INSERT INTO UserCategories (UserId,CategoryId) VALUES ('"+id+"','"+element+"');";
               });
               DButilsAzure.Insert(query).then(function(element) {
                res.send({"status": "OK", "Message":"User successfully Update By Admin"});
            }).catch(function(err) {
               res.send({"status": "ERROR", "Message": err});
           });
        }else
        res.send({"status": "OK", "Message":"User successfully Update By Admin"});
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

module.exports = router;