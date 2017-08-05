angular.module('shopApp')
.factory('httpService', ['$http','localStorageService','UserService' ,function($http,localStorageService,UserService){
  let service ={};
  let baseUrl="http://localhost:4000";
  service.getAllProducts = function() {
    return $http.get(baseUrl+'/Products/ListProducts')
    .then(function(response) {
        console.log(response);
        if (response.data.status != "OK"){  
          return Promise.reject(response.data.status+": "+ response.data.Message);
      }
      return Promise.resolve(response.data.resObject.Products);
  })
    .catch(function (e) {
      return Promise.reject(e);
  });
};

service.getAllCategories = function() {
    return $http.get(baseUrl+'/Users/CategoriesList')
    .then(function(response) {
        if (response.data.status != "OK"){  
          return Promise.reject(response.data.status+": "+ response.data.Message);
      }
      console.log(response.data.resObject);
      return Promise.resolve(response.data.resObject);
  })
    .catch(function (e) {
      return Promise.reject(e);
  });
};

service.getAllCountries = function() {
    return $http.get(baseUrl+'/Countries/CountriesList')
    .then(function(response) {
        if (response.data.status != "OK"){
          return Promise.reject(response.data.status+": "+ response.data.Message);
      }
      console.log(response.data.resObject);
      return Promise.resolve(response.data.resObject);
  })
    .catch(function (e) {
      return Promise.reject(e);
  });
};

service.getAllProductsByCategory = function(categoryId) {
    if(categoryId == ""){
        return service.getAllProducts();
    }else{
       return $http.get(baseUrl+'/Products/CategoryProductsById/'+categoryId)
       .then(function(response) {
        if (response.data.status != "OK"){  
          return Promise.reject(response.data.status+": "+ response.data.Message);
      }
      console.log(response.data.resObject.Products);
      return Promise.resolve(response.data.resObject.Products);
  })
       .catch(function (e) {
          return Promise.reject(e);
      });
   }
};
service.getHotProductsOfTheWeek = function(numberOfProducts){
    return $http.get(baseUrl+'/Products/HotProducts/'+numberOfProducts)
    .then(function(response) {
        if(response.data.status !="OK"){
            return Promise.reject(response.data.status+": "+ response.data.Message);
        }
        console.log(response.data.resObject.Products);
        return Promise.resolve(response.data.resObject.Products);
    })
    .catch(function(e){
        return Promise.reject(e);
    });
};

service.getNewProductsOfTheMonth = function(numberOfProducts){
    return $http.get(baseUrl+'/Products/LastestProducts/'+numberOfProducts)
    .then(function(response) {
        if(response.data.status !="OK"){
            return Promise.reject(response.data.status+": "+ response.data.Message);
        }
        console.log(response.data.resObject.Products);
        return Promise.resolve(response.data.resObject.Products);
    })
    .catch(function(e){
        return Promise.reject(e);
    });
};

service.getRecommendedProducts = function(numberOfProducts){
    let userName = getUserName();
    return $http.get(baseUrl+'/Products/RecomandedProducts/'+userName+'/'+numberOfProducts)
    .then(function(response) {
        if(response.data.status !="OK"){
                            return Promise.reject(response.data.status+": "+ response.data.Message);//no recommended products... need to change that.
                        }
                        console.log(response.data.resObject.Products);
                        return Promise.resolve(response.data.resObject.Products);
                    })
    .catch(function(e){
        return Promise.reject(e);
    });
};

service.getshoppingCart = function(){
    let userId = getUserId();
    return $http.get(baseUrl+'/Orders/ActiveBaket/'+userId)
    .then(function(response) {
        if(response.data.status !="OK"){
            return Promise.reject(response.data.status+": "+ response.data.Message);
        }
        console.log(response.data.resObject);
        return Promise.resolve(response.data.resObject);
    })
    .catch(function(e){
        return Promise.reject(e);
    });
};

service.getProdctCategories = function(ProductId){
    return $http.get(baseUrl+'/Products/ProductCategoriesById/'+ProductId)
    .then(function(response) {
        if(response.data.status !="OK"){
            return Promise.reject(response.data.status+": "+ response.data.Message);
        }
        console.log(response.data.resObject.Categories);
        return Promise.resolve(response.data.resObject.Categories);
    })
    .catch(function(e){
        return Promise.reject(e);
    });
};

service.getPreviousOrders = function(){
    let userId = getUserId ();
    return $http.get(baseUrl+'/Orders/PreviousOrders/'+ userId)
    .then(function(response) {
        if(response.data.status !="OK"){
            return Promise.reject(response.data.status+": "+ response.data.Message);
        }
        console.log(response.data.resObject);
        return Promise.resolve(response.data.resObject);
    })
    .catch(function(e){
        return Promise.reject(e);
    });
};

service.getPreviousOrder = function(OrderId){
    let userId = getUserId();
    return $http.get(baseUrl+'/Orders/PreviousOrderById/'+ userId+'/'+ OrderId)
    .then(function(response) {
        if(response.data.status !="OK"){
            return Promise.reject("cannot reach the server");
        }
        console.log(response.data.status+": "+ response.data.Message);
        return Promise.resolve(response.data.resObject);
    })
    .catch(function(e){
        return Promise.reject(e);
    });
};

service.addToBasket = function(dinoId,quantity,toAlert){
    let userId = getUserId();
    let ans = {
        UserId : userId,
        ProductId : dinoId,
        Quantity : quantity
    }
    if(UserService.UserId == null) 
        alert("Please log on to add item to your shopping cart");
    else 
        return $http.post(baseUrl+'/Orders/AddToBasket',ans).then(function(response) {
            if(toAlert==true)
                return Promise.resolve(alert("dinosaur seccesfuly added to shopping cart"));
            return Promise.resolve(response);
        })
    .catch(function(e){
        return Promise.reject(e);
    });
}
service.buyBasket = function(basketId,shippingDate){
    let userId = getUserId();
    let ans = {
        UserId : userId,
        BasketId : basketId,
        ShippingDate : shippingDate
    }
    if(UserService.UserId == null) 
        alert("Please log on to buy shopping cart");
    else 
        return $http.post(baseUrl+'/Orders/buyBasket',ans).then(function(response) {
            return Promise.resolve(alert("Your Order Number is: "+ response.data.resObject[0].Id));
        })
    .catch(function(e){
        return Promise.reject(e);
    });
}

service.deleteFromBasket = function(dinoId){
    let userId = getUserId();
    let ans = {
        UserId : userId,
        ProductId : dinoId
    }
    return $http.put(baseUrl+'/Orders/RemoveFromBasket',ans).then(function(response) {
        return Promise.resolve(response);
    })
    .catch(function(e){
        return Promise.reject(e);
    });
}

    let getUserId = function(){
        let userId = localStorageService.get("userservice");
        if (userId)
            userId = localStorageService.get("userservice").UserId;
        if (!userId)
            userId = localStorageService.cookie.get("userservice").UserId;
        return userId;
}
        let getUserName = function(){
            let userName = localStorageService.get("userservice");
            if (userName)
                userName = localStorageService.get("userservice").UserName;
            if (!userName)
                userName = localStorageService.cookie.get("userservice").UserName;
            return userName;
            }


return service;
}])
.factory('UserService', ['$http','localStorageService','$rootScope',function($http,localStorageService,$rootScope) {
    let service = {};
    let baseUrl="http://localhost:4000";
    service.logout= function(){
        console.log("logout");
        $rootScope.UserName = service.UserName = "";
        $rootScope.LastLogin = service.LastLogin = "";
        service.password = "";
        service.UserId = "";
        $rootScope.loged = service.isLoggedIn = false;
        $rootScope.isManeger = service.isManeger = false;
        service.UserId = "";
        localStorageService.cookie.remove("userservice");
        localStorageService.remove("userservice")
        console.log(localStorageService.cookie.get("userservice"));
    }

    service.login = function(user) {
        return $http.post(baseUrl+'/Users/Login', user)
        .then(function(response) {
            console.log(response);
            let token = response.data;
            $http.defaults.headers.common = {
                'my-Token': token,
                'user' : user.username
            };
            if (response.data.status == "OK"){
                if (response.data.resObject.IsActive){
                    $rootScope.UserName = service.UserName = user.UserName;
                    $rootScope.LastLogin = service.LastLogin = response.data.resObject.LastLogin;
                    service.Password = user.Password;
                    $rootScope.loged = service.isLoggedIn = true;
                    user.UserId = service.UserId = response.data.resObject.UserId;
                    $rootScope.isManeger = service.isManeger = response.data.resObject.IsAdmin;
                    localStorageService.cookie.set("userservice", user);
                    localStorageService.set("userservice", {"UserId": user.UserId,"UserName":user.UserName})
                    console.log(localStorageService.cookie.get("userservice"));
                }else{
                    return Promise.reject("You are suspended!!! please contact the admin!!!");
                }
            }else{
                $rootScope.UserName = service.UserName = "";
                $rootScope.LastLogin = service.LastLogin = "";
                service.Password = "";
                $rootScope.loged = service.isLoggedIn = false;
                $rootScope.isManeger = service.isManeger = false;
                user.UserId = service.UserId = "";
                localStorageService.cookie.remove("userservice");
                localStorageService.remove("userservice");
                return Promise.reject("wrong Username or Password");
            }

            return Promise.resolve(response);
        })
        .catch(function (e) {
            return Promise.reject(e);
        });
    };

    service.signup = function(user) {
        return $http.post(baseUrl+'/Users/Register', user)
        .then(function(response) {
            console.log(response);
            let token = response.data;
            $http.defaults.headers.common = {
                'my-Token': token,
                'user' : user.username
            };
            if (response.data.status == "OK"){
                return Promise.resolve(response.data.Message);
            }else{
                return Promise.reject(response.data.status+": "+ response.data.Message);
            }
        })
        .catch(function (e) {
            return Promise.reject(e);
        });
    };
    service.getUserQuastion = function(username){
        return $http.get(baseUrl+'/Users/ForgetPassword/'+username)
        .then(function(response) {
            if(response.data.status !="OK"){
                return Promise.reject(response.data.status+": "+ response.data.Message);
            }
            console.log(response.data.resObject.Products);
            return Promise.resolve(response.data.resObject);
        })
        .catch(function(e){
            return Promise.reject(e);
        });
    };

    service.forgetPass = function(user) {
        return $http.post(baseUrl+'/Users/ForgetPassAnswer', user)
        .then(function(response) {
            console.log(response);
            let token = response.data;
            $http.defaults.headers.common = {
                'my-Token': token,
                'user' : user.username
            };
            if (response.data.status == "OK"){
                return Promise.resolve(response.data.resObject.Password);
            }else{
                return Promise.reject(response.data.status+": "+ response.data.Message);
            }
        })
        .catch(function (e) {
            return Promise.reject(e);
        });
    };


//    let userservice = localStorageService.get("userservice");
//    console.log(userservice);
//    if (userservice){
//        service.username = userservice.username;
//        service.password = userservice.password;
//        // service.login(userservice).then(function(success){
//        //     console.log(userservice);
//        //     console.log("loged in successfully");
//        // }, function(error){
//        //     console.log(error);
//        //     console.log("loged in eroor");
//        // });
//    }else{
//    console.log(userservice);
//
//        service.isLoggedIn = false;
//        service.isManeger = false;
//    }
//
return service;
}]);