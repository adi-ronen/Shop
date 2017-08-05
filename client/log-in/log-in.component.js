angular.
  module('logIn').
  component('logIn', {
    template: `
      <div id="Login" class="display-middle">
  	    <form id="Login_form">
  	        <div class="container">
  	            <label><b>Username:</b></label>
  	            <input ng-model="$ctrl.Username" autocomplete="off" type="text" placeholder="Enter Username" name="uname" required>
  	            <br><br>
                <label><b>Password:</b></label>
  	            <input type="password" ng-model="$ctrl.Password" placeholder="Enter Password" name="psw" required>
  	            <br><br>
                <div>
                <md-button class="md-raised" ng-click="$ctrl.login()" type="submit" ng-disabled="$ctrl.inloginprocess">Login</md-button>
                <md-button class="md-raised" href="#!/forget"> Forget Your Password?</md-button>
                <md-button class="md-raised" href="#!/register"> Not register? Sing up now!</md-button>
                </div>
  	        </div>
  	    </form>
  	  </div>
    `,
    controller: ['UserService','$location',function logInController(UserService,$location) {
      var self = this;
      self.wrongPass = false;
      self.hello="hello ";
      self.inloginprocess=false;
      // console.log($location);
    		this.login= function (){
          // $rootScope.loged = true;
          // $rootScope.isManeger = true;
    			// $cookies.put('loged', JSON.stringify("true"));
          self.inloginprocess=true;
          user = {"UserName": this.Username, "Password": this.Password};
          UserService.login(user).then(function (success){
            console.log(success);
            alert("loged in");
            self.inloginprocess=false;
             $location.path('/');
            // window.location.href= window.location.pathname;
          },function (error){
            console.log(error);
            alert(error);
            self.wrongPass = true;
            self.inloginprocess=false;
          });
            
    		};
        this.message = "hello kobadi";
     }]
  });