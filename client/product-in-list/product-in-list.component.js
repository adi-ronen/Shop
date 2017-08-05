  angular.
  module('productInList',['ngMaterial']).component('productInList', {
    template:  `
    <div>
    <md-card class="col-md-5">
    <md-card-title>
    <md-card-title-text>
    <span class="md-headline">{{$ctrl.dinosaur.Name}}</span>
    </md-card-title-text>
    </md-card-title>
    <md-card-content layout="row" layout-align="space-between">
    <div class="md-media-xl card-media">
    <img class="DinosaurImg" ng-src="styles/images/{{$ctrl.dinosaur.Name}}.jpg" style="height:75%; width:95%;">
    </div>
    <span class="md-subhead">Price: {{$ctrl.dinosaur.Price}} Million $
    <md-card-actions layout="column">
    <md-button class="md-icon-button" aria-label="AddToCart" ng-click="$ctrl.AddToCart($event,$ctrl.dinosaur.Id)">
    <i class="fa fa-cart-plus" aria-hidden="true" style="font-size:30px"></i>
    </md-button>
    <md-button class="md-icon-button" aria-label="Info" ng-click="$ctrl.showDescription($event,$ctrl.dinosaur)">
    <i class="fa fa-info-circle fa-2" aria-hidden="true" style="font-size:30px"></i>
    </md-button>
    </md-card-actions>
    </span>
    </md-card-content>
    </md-card>
    </div>
    `,bindings: {
      dinosaur: '='
    },
    controller: ['httpService','$mdDialog','$scope','$rootScope',function ProductsListController(httpService, $mdDialog, $scope,$rootScope) {
      let self = this;
      self.showDescription = function(ev,dino){
        $mdDialog.show({
          controller: function DialogCtrl(httpService,$scope, $mdDialog, dino) {
            $scope.dino = dino;
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

      self.AddToCart = function(ev,dinoId){
      if ($rootScope.loged){
            $mdDialog.show({
              controller: AddToCartController,
              clickOutsideToClose:true,
              template: '<div style="margin:10px;"><b>Quantity :<b><br>'+
              '<select ng-model="NumberOfDinos">'+
              '<option value="1" selected="selected">1</option>'+
              '<option value="2">2</option>'+
              '<option value="3">3</option>'+
              '<option value="4">4</option>'+
              '<option value="5">5</option>'+
              '</select><br>'+
              '<md-button ng-click="add()">Add</md-button></div>',
              targetEvent: ev,
            });
            function AddToCartController($scope, $mdDialog) {
              $scope.NumberOfDinos = "1";
              $scope.add = function() {
                httpService.addToBasket(dinoId, $scope.NumberOfDinos, true);
                $mdDialog.hide();
              }
            }
        }else{
            alert("you must log in!!");
        }
      };
    }]
  });

