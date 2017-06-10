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

router.post('/AddToBasket', function (req, res) {
	let userId = req.body.UserId;
	let productId = req.body.ProductId;
	let quantity = req.body.Quantity;
	if(req.body && ( typeof req.body.UserId == 'undefined' || typeof req.body.ProductId == 'undefined' || typeof req.body.Quantity == 'undefined')){
		res.send({"status": "ERROR", "Message": "Wrong Data"});
	}else{
		DButilsAzure.Select("Select Id from Basket WHERE UserId='"+userId+"' And Submitted = 'false'").then(function (result){
			if(result.length==0){
				let query= "INSERT INTO Basket (Submitted, UserId) VALUES ('false','"+userId+"')";
				console.log(query);
				DButilsAzure.Insert(query).then(function(result){
					DButilsAzure.Select("SELECT Id FROM Basket WHERE UserId='"+userId+"' AND Submitted = 'false'").then(function(result){
						let basketId = result[0].Id;
						DButilsAzure.Insert("INSERT INTO BasketProducts VALUES ('"+basketId+"','"+productId+"','"+quantity+"')").then(function(result){
							res.send({"status": "OK", "Message":"successfully add Product to the bascket","resObject":{} });
						}).catch(function(err) {
							res.send({"status": "ERROR", "Message": err});
						});
					}).catch(function(err) {
						res.send({"status": "ERROR", "Message": err});
					});
				}).catch(function(err) {
					res.send({"status": "ERROR", "Message": err});
				});
			}else{
				let basketId = result[0].Id;
				DButilsAzure.Select("SELECT * FROM BasketProducts WHERE BasketId='"+basketId+"' AND ProductId = '"+productId+"'").then(function(result){
					if(result.length==0){					
						DButilsAzure.Insert("INSERT INTO BasketProducts VALUES ('"+basketId+"','"+productId+"','"+quantity+"')").then(function(result){
							res.send({"status": "OK", "Message":"successfully add Product to the bascket","resObject":{} });
						}).catch(function(err) {
							res.send({"status": "ERROR", "Message": err});
						});
					}else{
						DButilsAzure.Insert("UPDATE BasketProducts SET Quantity = '"+quantity+"' WHERE BasketId = '"+basketId+"' AND ProductId = '"+productId+"'").then(function(result){
							res.send({"status": "OK", "Message":"successfully add Product to the bascket","resObject":{} });
						}).catch(function(err) {
							res.send({"status": "ERROR", "Message": err});
						});
					}
				}).catch(function(err) {
					res.send({"status": "ERROR", "Message": err});
				});
			}
		}).catch(function(err) {
			res.send({"status": "ERROR", "Message": err});
		});
	}
});

router.get('/ActiveBaket/:userId', function (req, res) {
	let query ="Select Basket.Id as Id, BasketProducts.ProductId as ProductId, BasketProducts.Quantity as Quantity, Products.Name as ProductName,"+
	" Products.Weight as ProductWeight, Products.Color as ProductColor, Products.Price as ProductPrice, Products.Description as Description,"+
	" Products.QuantityInStock as ProductQuantityInStock, Products.Active as ProductIsActive from ((Basket INNER JOIN BasketProducts ON Basket.Id = BasketProducts.BasketId)"+
	" INNER JOIN Products ON BasketProducts.ProductId = Products.Id) WHERE Basket.UserId = '"+req.params.userId+"' AND Basket.Submitted='false'"; 
	DButilsAzure.Select(query).then(function (result){
		res.send({"status": "OK", "Message":"successfully get bascket","resObject": result});
	}).catch(function(err) {
		res.send({"status": "ERROR", "Message": err});
	});
});

router.put('/RemoveFromBasket', function (req, res) {
	let userId = req.body.UserId;
	let productId = req.body.ProductId;
	if(req.body && ( typeof req.body.UserId == 'undefined' || typeof req.body.ProductId == 'undefined')){
		res.send({"status": "ERROR", "Message": "Wrong Data"});
	}else{
		DButilsAzure.Select("Select Id from Basket WHERE UserId='"+userId+"' And Submitted = 'false'").then(function (result){
			if(result.length==0){
				res.send({"status": "ERROR", "Message": "No Active Bascket For This User"});
			}else{
				let basketId = result[0].Id;
				DButilsAzure.Insert("DELETE FROM BasketProducts WHERE BasketId='"+basketId+"' And ProductId = '"+productId+"'").then(function (result){
					res.send({"status": "OK", "Message":"successfully delet Product from bascket"});
				}).catch(function(err) {
					res.send({"status": "ERROR", "Message": err});
				});
			}
		}).catch(function(err) {
			res.send({"status": "ERROR", "Message": err});
		});
	}
});

router.get('/PreviousOrders/:userId', function (req, res) {
	let userId = req.params.userId;
	if(typeof userId == 'undefined'){
		res.send({"status": "ERROR", "Message": "Wrong Data"});
	}else{
		let query ="Select Basket.Id as Id, BasketProducts.ProductId as ProductId, BasketProducts.Quantity as Quantity, Products.Name as ProductName,"+
		" Products.Weight as ProductWeight, Products.Color as ProductColor, Products.Price as ProductPrice, Products.Description as Description,"+
		" Products.QuantityInStock as ProductQuantityInStock, Products.Active as ProductIsActive from ((Basket INNER JOIN BasketProducts ON Basket.Id = BasketProducts.BasketId)"+
		" INNER JOIN Products ON BasketProducts.ProductId = Products.Id) WHERE Basket.UserId = '"+req.params.userId+"' AND Basket.Submitted='true'"; 
		DButilsAzure.Select(query).then(function (result){
			res.send({"status": "OK", "Message":"successfully get older orders","resObject": result});
		}).catch(function(err) {
			res.send({"status": "ERROR", "Message": err});
		});
	}
});

router.get('/PreviousOrderById/:userId/:orderId', function (req, res) {
	let userId = req.params.userId;
	let orderId = req.params.orderId;
	if(typeof userId == 'undefined'|| typeof orderId == 'undefined'){
		res.send({"status": "ERROR", "Message": "Wrong Data"});
	}else{
		let query ="Select Basket.Id as Id, BasketProducts.ProductId as ProductId, BasketProducts.Quantity as Quantity, Products.Name as ProductName,"+
		" Products.Weight as ProductWeight, Products.Color as ProductColor, Products.Price as ProductPrice, Products.Description as Description,"+
		" Products.QuantityInStock as ProductQuantityInStock, Products.Active as ProductIsActive from ((Basket INNER JOIN BasketProducts ON Basket.Id = BasketProducts.BasketId)"+
		" INNER JOIN Products ON BasketProducts.ProductId = Products.Id) WHERE Basket.UserId = '"+userId+"' AND Basket.Submitted='true' AND Basket.Id = '"+orderId+"'"; 
		DButilsAzure.Select(query).then(function (result){
			res.send({"status": "OK", "Message":"successfully get older orders","resObject": result});
		}).catch(function(err) {
			res.send({"status": "ERROR", "Message": err});
		});
	}
});

router.post('/BuyBasket', function (req, res) {
	let userId = req.body.UserId;
	let basketId = req.body.BasketId;
	let shippingDate = req.body.ShippingDate;
	let numberOfProductsInBasket = 0;
	let productsIdsInBasket = [];
	let bascket;
	if(typeof userId == 'undefined'|| typeof basketId == 'undefined' || typeof req.body.ShippingDate == 'undefined'){
		res.send({"status": "ERROR", "Message": "Wrong Data"});
	}else{
		DButilsAzure.Select("SELECT * FROM Basket WHERE UserId='"+userId+"' AND Id='"+basketId+"' AND Submitted='false'").then(function (result){
			if(result.length==0){
				res.send({"status": "ERROR", "Message": "Wrong Basket or UserId"});
			}			
			else{	
				bascket = result;			
				DButilsAzure.Select("SELECT ProductId, Quantity FROM BasketProducts WHERE BasketId='"+basketId+"'").then(function (result){
					numberOfProductsInBasket = result.length;
					productsIdsInBasket = result;
					if(result.length==0){
						res.send({"status": "ERROR", "Message": "There are no Products in bascket"});
					}else{	
						let query = "SELECT * FROM Products WHERE";
						let isFirst = true;
						result.forEach(function(element){
							if(isFirst){
								isFirst=false;
								query+=" Id='"+result[0].ProductId+"'";
							}else{
								query+=" Or Id='"+result[0].ProductId+"'";
							}
						});
						DButilsAzure.Select(query).then(function (result){
							let okAmount = true;
							let notInStack = [];
							result.forEach(function(realProducts){
								productsIdsInBasket.forEach(function(wantToBuy){
									if(realProducts.Id == wantToBuy.ProductId){
										if(realProducts.QuantityInStock<wantToBuy.Quantity)
										{
											notInStack.push("There are not enough from"+realProducts.Id+" Product in stok");
											okAmount = false;
										}
									}
								});
							});
							if(!okAmount){
								res.send({"status": "ERROR", "Message": "Products Amount in stok error", "resObject":notInStack});
							}else{
								let query = "";
								productsIdsInBasket.forEach(function(product){
									query += "UPDATE Products SET QuantityInStock = QuantityInStock-"+product.Quantity+", SoldInPastWeek= SoldInPastWeek+"+product.Quantity+" WHERE Id ="+product.ProductId+";";
								});
								DButilsAzure.Select(query).then(function (result){
									DButilsAzure.Select("UPDATE Basket SET Submitted = 'true', ShippingDate='"+shippingDate+"' WHERE Id='"+basketId+"'").then(function (result){
										DButilsAzure.Select("SELECT * FROM Basket WHERE Id='"+basketId+"'").then(function (result){
											res.send({"status": "OK", "Message": "successfully buy bascket", "resObject":result});
										}).catch(function(err) {
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
				}).catch(function(err) {
					res.send({"status": "ERROR", "Message": err});
				});
			}
		}).catch(function(err) {
			res.send({"status": "ERROR", "Message": err});
		});
	}
});

module.exports = router;