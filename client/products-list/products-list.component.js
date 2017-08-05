angular.
  module('productsList',['ngMaterial']).component('productsList', {
    template:  `
    <div>
      <label id="hotDinos">All Dinosaurs</label>
      <br>
      <div>
      <p>filter dinosaurs by category:
      <select ng-options="category.Name for category in $ctrl.Categories track by category.Id" ng-model="$ctrl.filterCategory" ng-change= "$ctrl.update()">
        <option value="">ALL</option>
      </select>
      </p>
      <p>search dinosaur by name:
      <input ng-model="$ctrl.searchDino.Name"></input>
      </p>
      <p>search dinosaur by color:
      <input ng-model="$ctrl.searchDino.Color"></input>
      </p>
      <p> Order by: <u ng-click="sortBy('Name')">Name</u>
                    <span class="sortorder" ng-show="propertyName === 'Name'" ng-class="{reverse: reverse}"></span>
                    <u ng-click="sortBy('Weight')">Weight</u> 
                    <span class="sortorder" ng-show="propertyName === 'Weight'" ng-class="{reverse: reverse}"></span>
                    <u ng-click="sortBy('Price')">Price</u>
                    <span class="sortorder" ng-show="propertyName === 'Price'" ng-class="{reverse: reverse}"></span></p>
                    <div class="row">
      <div ng-repeat="Dinosaur in $ctrl.Dinosaurs | filter:$ctrl.searchDino | orderBy:propertyName:reverse ">
           <product-in-list dinosaur="Dinosaur"></product-in-list>
           </div>
      </div>
      `,
    controller: ['httpService','$scope',function ProductsListController(httpService,$scope) {
      let self = this;
      self.filterCategory = "";
      $scope.propertyName = null;
      $scope.reverse = true;

      $scope.sortBy = function(propertyName) {
       $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
       $scope.propertyName = propertyName;
      };
      httpService.getAllCategories().then(function(success){
        self.Categories = success.Categories;
        self.update();

      },function (error) {
          console.log(error);
         alert(error);
       });

      self.update = function(){
      console.log("kobi1");
      var catId;
      if (self.filterCategory==""){
        catId="";
        }
        else{
        catId=self.filterCategory.Id;
        }
        httpService.getAllProductsByCategory(catId).then(function(success){
            self.Dinosaurs = success;
            console.log("kobi2");

          },function (error){
            console.log(error);
            alert(error);
          }
        );
      };
      }]
    });
      

