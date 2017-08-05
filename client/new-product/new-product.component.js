angular.
  module('newProduct',[]).component('newProduct', {
    template:  `
        <div>
        <label id="newDinos">New Dinosaurs of the month!</label>
        <div class="row">
        <product-in-list ng-repeat="Dinosaur in $ctrl.Dinosaurs" dinosaur="Dinosaur"></product-in-list>
        </div>
      </div>
      `,
      controller: ['httpService',function ProductsListController(httpService,$scope) {
      let self = this;
       httpService.getNewProductsOfTheMonth(6).then(function(success){
            self.Dinosaurs = success;
          },function (error){
            console.log(error);
            alert(error);
          }
        );
      }]
    });
      

