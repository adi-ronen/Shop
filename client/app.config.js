angular.
  module('shopApp')
  .config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');
      $routeProvider.
      when('/', {
          template: `
             <br>
            <log-in ng-if="!loged"></log-in>
            <br>
            <hot-products products_num="5"></hot-products>
            <br>
            <new-product ng-if="loged"></new-product>
            <br>
            <products-list></products-list>
            <br>
            <recommended-product products=6 ng-if="loged"><recommended-product>
          `
        }).
        when('/product/:productId', {
          template: '<product-details></product-details>'
        }).
         when('/shoppingCart', {
          template: '<shopping-cart></shopping-cart>'
        }).
        when('/products', {
          template: '<products-list></products-list>'
        }).
        when('/admin', {
          template: '<product-details></product-details>'
        }).
        when('/login', {
          template: '<log-in></log-in>'
        }).
        when('/register', {
          template: '<registration></registration>'
        }).
        when('/forget', {
                  template: '<forget-password></forget-password>'
        }).
        when('/shoppingCart/order/:orderId', {
                  template: '<previous-order></previous-order>'
        }).otherwise('/');
    },
  ]);