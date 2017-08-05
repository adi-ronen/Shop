angular.module('shopApp', [
	'ngRoute',
	'productsList',
	'productDetails',
	'logIn',
	'ngMaterial',
	'ngCookies',
	'LocalStorageModule',
	'hotProducts',
	'registration',	
	'newProduct',
  'shoppingCart',
	'productInList',
	'forgetPassword',
  'previousOrder',
  'recommendedProduct'])
.run(function(UserService,$rootScope, $mdDialog,localStorageService) {
    $rootScope.connecting = true;
    $rootScope.init= function (){
        let user= localStorageService.cookie.get("userservice");
        if (user != null){

            console.log("log in with cookie");
            UserService.login(user).then(function(){
                $rootScope.connecting = false;
            } );
        }else{
            $rootScope.connecting = false;
        }
    }

//    $scope.$on('$viewContentLoaded', function() {
//        //call it here
//    });

  $rootScope.$on('$routeChangeSuccess', function () {
$rootScope.init();
  });
   $rootScope.logout= function(){
   	console.log("logout");
   	UserService.logout();
   }
   	var alert;
	$rootScope.showAbout = function() {
	alert = $mdDialog.alert({
        title: 'About',
        textContent: 'This site was created by Adi Ronen and Kobi Sekli as part of an exercise in the course Web-based Programming Frameworks, Ben-Gurion University of the Negev 2017. The main difficulties we encountered in the exercise were to divide the tasks between us, to get along with each other, make it look like we want it to and to integrate everything so it would collaborate. our PAC-MAN game: kobadi.comuf.com',
        ok: 'Close'
      });
      $mdDialog
        .show( alert )
        .finally(function() {
          alert = undefined;
        });
    }
})
.controller('AppCtrl', ['UserService', '$location','localStorageService',function(UserService, $location,localStorageService,$scope, $mdDialog) {

}]);



