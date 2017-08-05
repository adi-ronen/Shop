angular.
  module('productDetails',['ngMaterial']).
  component('productDetails', {
    template: `<md-dialog style="display: list-item; max-width: 100%; max-height: 100%;">
             <md-content style="margin:50px;">
                    <span style="font-size:2em;">{{$ctrl.dinosaur.Name}}</span><br>
                    <span><b>Color:</b> {{$ctrl.dinosaur.Color}} </span> <br>
                    <span><b>Weight:</b> {{$ctrl.dinosaur.Weight}} tons </span> <br>
                    <span><b>Description:</b> {{$ctrl.dinosaur.Description}}</span><br>
                    <img class="DinosaurImg" ng-src="styles/images/{{$ctrl.dinosaur.Name}}.jpg" style="height:200px;"><br>
                    <span class="md-subhead"><b>Price:</b> {{$ctrl.dinosaur.Price}} Million $</span><br>
                 </div>
             </md-content>
             <md-dialog-actions>
               <md-button ng-show="!$ctrl.dinosaur.isCart" ng-click="$ctrl.AddToCart($event,$ctrl.dinosaur.Id)">
                Add to cart
               </md-button>
            </md-dialog-actions>
            </md-dialog>`,
      bindings: {
          dinosaur: '='
        },
  controller: ['httpService','$mdDialog','$rootScope',function ProductsDetailsController(httpService,$mdDialog,$rootScope) {
        let self = this;
       self.AddToCart = function(ev,dinoId){
       if ($rootScope.loged){
            $mdDialog.show({
              controller: AddToCartController,
              clickOutsideToClose:true,
              template: '<div style="margin:10px;"><b>Quantity :<b><br>'+
              '<select ng-model="NumberOfDinos">'+
              '<option value="1">1</option>'+
              '<option value="2">2</option>'+
              '<option value="3">3</option>'+
              '<option value="4">4</option>'+
              '<option value="5">5</option>'+
              '</select><br>'+
              '<md-button ng-click="add()">Add</md-button></div>',
              targetEvent: ev,
            });
        }else{
                              alert("you must log in!!");
                          }
        function AddToCartController($scope, $mdDialog) {


              $scope.NumberOfDinos = "1";
              $scope.add = function() {
                httpService.addToBasket(dinoId, $scope.NumberOfDinos, true);
                $mdDialog.hide();
              }


        }
      };
      }
    ]
  });