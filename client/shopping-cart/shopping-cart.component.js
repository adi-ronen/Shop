angular.
module('shoppingCart').component('shoppingCart', {
  template:  `
  <div>
  <label style="font-size:2em;">Shopping Cart</label>
  <br>
  <label style="font-size:1em;">corrency:</label>
  <select ng-model="$ctrl.currency">
     <option value="dollar">Dollrs - $</option>
     <option value="shekel">Shekels - \u20AA</option>
  </select>
  <br>
  <table st-table="rowCollection" class="table table-striped">
  <thead>
  <tr>
  <th>Name</th>
  <th>Color</th>
  <th>Weigth</th>
  <th>Price</th>
  <th>Quantity</th>
  <th>Info</th>
  <th>Delete</th>
  </tr>
  </thead>
  <tbody>
  <tr ng-repeat="Dinosaur in $ctrl.Dinosaurs">
  <td>{{Dinosaur.ProductName}}</td>
  <td>{{Dinosaur.ProductColor}}</td>
  <td ng-init="$ctrl.TotalWeight = $ctrl.TotalWeight + (Dinosaur.ProductWeight * Dinosaur.Quantity)">{{Dinosaur.ProductWeight * Dinosaur.Quantity}} tons</td>
  <td ng-init="$ctrl.TotalPrice = $ctrl.TotalPrice + (Dinosaur.ProductPrice * Dinosaur.Quantity)" >

        <div ng-show="$ctrl.currency == 'dollar'">{{Dinosaur.ProductPrice * Dinosaur.Quantity | currency:"M$"}}</div>
        <div ng-show="$ctrl.currency == 'shekel'">{{Dinosaur.ProductPrice * Dinosaur.Quantity*3.7 | currency:"M\u20AA"}}</div>

  </td>
  <td ng-init="$ctrl.TotalQuantity = $ctrl.TotalQuantity + Dinosaur.Quantity">
  <md-button ng-disabled="Dinosaur.Quantity==1" class="md-icon-button" ng-click="$ctrl.minus(Dinosaur.ProductId, Dinosaur.Quantity)" aria-label=" ">
  <i class="fa fa-minus fa-1" aria-hidden="true"></i>
  </md-button>
  {{Dinosaur.Quantity}}
  <md-button ng-disabled="Dinosaur.Quantity==5" class="md-icon-button" ng-click="$ctrl.plus(Dinosaur.ProductId, Dinosaur.Quantity)" aria-label=" ">
  <i class="fa fa-plus fa-1" aria-hidden="true"></i>
  </md-button>
  </td>
  <td>
  <md-button class="md-icon-button" aria-label="Info" ng-click="$ctrl.showDescription($event,Dinosaur)" aria-label=" ">
  <i class="fa fa-info-circle fa-1" aria-hidden="true"></i>
  </md-button>
  </td>
  <td>
  <md-button class="md-icon-button" ng-click="$ctrl.deleteDino(Dinosaur.ProductId, Dinosaur.Quantity)" aria-label=" ">
  <i class="fa fa-trash fa-1" aria-hidden="true"></i>
  </md-button>
  </td>
  </tr>
  <tr>
  <th>TOTAL</th>
  <th></th>
  <th>{{$ctrl.TotalWeight}} tons</th>
  <th ng-show="$ctrl.currency == 'dollar'">{{$ctrl.TotalPrice | currency:"M$"}}</th>
  <th ng-show="$ctrl.currency == 'shekel'">{{$ctrl.TotalPrice*3.7 | currency:"M\u20AA"}}</th>
  <th> <md-button class="md-icon-button" style="cursor:default" aria-label=" ">
  <i class="fa fa-plus fa-1" aria-hidden="true" ng-show="1==2"></i>
  </md-button>
  {{$ctrl.TotalQuantity}}</th> 
  <th></th>
  <th></th>
  </tr>
  </tbody>
  </table>
  <b>Select Delivery Date: </b>
  <md-datepicker ng-model="$ctrl.myDate" md-placeholder="Enter date"
  md-min-date="$ctrl.minDate">
  </md-datepicker>
  <md-button class="md-raised" ng-click="$ctrl.BuyCart($ctrl.Dinosaurs[0].Id)" ng-disabled="$ctrl.inprocess" aria-label=" ">
  Buy Cart
  </md-button>
  <br><br>
  <h2 ng-click="ViewPreviousOrders=!ViewPreviousOrders; reverse=!reverse">Previous Orders
  <span class="sortorder" ng-class="{reverse: reverse}"></span></h2>
  <div ng-show="ViewPreviousOrders">
  <span ng-show="NoPreviousOrders">No Previous Orders</span>
  <span ng-repeat="OrderNum in $ctrl.OrdersNumber" ng-click="$ctrl.viewOrder(OrderNum)"><b>Order Number <b>{{OrderNum}}<br></span>
  </div>
  </div>
  `,
  controller: ['httpService','$mdDialog','$scope','$location','$window',function shoppingCartController(httpService,$mdDialog,$scope,$location,$window) {
    let self = this;
    self.currency= "dollar";
    self.minDate= new Date();
    self.minDate.setDate(self.minDate.getDate() + 7);
    self.inprocess=false;
    self.prevOrders = function(){
      httpService.getPreviousOrders().then(function(success){
        if(success.length == 0)
          $scope.NoPreviousOrders = true;
        else{
          self.OrdersNumber =[];
          for(i=0; i< success.length;i++)
          {
            if (self.OrdersNumber.indexOf(success[i].Id) == -1) {
              self.OrdersNumber.push(success[i].Id);
            }
          }
        }
      },function (error){
        console.log(error);
      });
    }
    self.update = function(){
      self.TotalWeight = 0;
      self.TotalQuantity =0;
      self.TotalPrice = 0;
      httpService.getshoppingCart().then(function(success){
        self.Dinosaurs = success;
      },function (error){
        console.log(error);
      });
    };
    self.BuyCart = function(cartId){
      if(self.Dinosaurs.length ==0 )
        alert("No Dinosaurs in Cart");
      else if(self.myDate == null)
        alert("Please Select Delivery Date");
      else{
        self.inprocess=true;
        httpService.buyBasket(cartId,self.myDate).then(function(success){
          self.update();
          self.prevOrders();
          self.inprocess=false;
        },function (error){
          console.log(error);
        });
      }
    }
    self.update();
    self.prevOrders();
    self.showDescription = function(ev,dino){
      $mdDialog.show({
        controller: function DialogCtrler(httpService,$scope, $mdDialog, dino) {
          $scope.dino = {
            Name : dino.ProductName,
            Color: dino.ProductColor,
            Weight: dino.ProductWeight,
            Description: dino.Description,
            Price : dino.ProductPrice,
            isCart : true
          };
          $scope.isCart = true;
        },
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen,
        template: '<product-details dinosaur="dino"></product-details>',
        targetEvent: ev,
        locals : {
          dino : dino
        }
      });
    };
    self.deleteDino = function(dinoId){
      httpService.deleteFromBasket(dinoId).then(function(success){
        self.update();
      },function (error){
        console.log(error);
      });
    };

    self.minus = function(dinoId,Quantity){
      httpService.addToBasket(dinoId, Quantity-1, false).then(function(success){
        self.update();
      },function (error){
        console.log(error);
      });
    }

    self.plus = function(dinoId,Quantity){
      httpService.addToBasket(dinoId, Quantity+1, false).then(function(success){
        self.update();
      },function (error){
        console.log(error);
      });
    }
    self.viewOrder = function(OrderId) {
//      $location.path('/order/'+OrderId);
        $window.open($location.$$absUrl+'/order/'+OrderId, "_blank");
    }
  }]
});