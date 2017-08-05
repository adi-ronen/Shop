angular.
  module('recommendedProduct',['ngMaterial']).component('recommendedProduct', {
    template:  `
        <div id="recDinos">
        <label>Recommended Dinosaurs For You! </label>
        <div class="row">
        <product-in-list ng-repeat="Dinosaur in $ctrl.Dinosaurs" dinosaur="Dinosaur"></product-in-list>
        </div>
      </div>
      `,bindings: {
        products: '<'
      },
    controller: ['httpService','UserService',function recommendedProductsController(httpService,UserService) {
      let self = this;
      if(UserService.isLoggedIn){
           httpService.getRecommendedProducts(5).then(function(success){ //5=> products...
                self.Dinosaurs = success;
              },function (error){
                console.log(error);
                alert("1"+error);
              }
            );
        }
      }]
    });