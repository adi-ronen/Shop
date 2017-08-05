angular.
  module('hotProducts',['ngMaterial']).component('hotProducts', {
    template:  `
        <div>
        <label id="hotDinos">Hot Dinosaurs of the week!</label>
        <div class="row">
      	<product-in-list ng-repeat="Dinosaur in $ctrl.Dinosaurs" dinosaur="Dinosaur"></product-in-list>
        </div>
      </div>
      `,bindings: {
        productsNum: '@?'
      },
    controller: ['httpService',function hotProductsController(httpService,$scope) {
      let self = this;
       httpService.getHotProductsOfTheWeek(5).then(function(success){//5=> products...
            self.Dinosaurs = success;
          },function (error){
            console.log(error);
            alert(error);
          }
        );
      }]
    });
      

