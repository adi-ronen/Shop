angular.
  module('forgetPassword').component('forgetPassword', {
    template:  `
          <div id="Register" class="display-middle">
      	    <form name="Register_form" id="Register_form">
      	        <div class="container">

      	        <div>
      	        <label><b>Username:</b></label>
                  <input type="text"
                    name="username"
                    placeholder="Enter Username"
                    ng-model="$ctrl.Username"
                    ng-minlength=3
                    ng-maxlength=8
                    required
                    ng-pattern="/^[a-zA-Z]*$/"
                    autocomplete="off"
                    ng-change="$ctrl.change()"
                    />
                  <span class="glyphicon glyphicon-ok form-control-icon success" ng-show="Register_form.username.$valid"></span>
                  <p class="help-block" ng-show="Register_form.username.$error.required">Username is required.</p>
                  <p class="help-block" ng-show="Register_form.username.$error.pattern">Username must be letters  only.</p>
                  <p class="help-block" ng-if="Register_form.username.$error.minlength">Must be 3-8 characters.</p>
                  <p class="help-block" ng-if="Register_form.username.$error.maxlength">Must be 3-8 characters.</p>
                </div>
                <br><br>
                <md-button class="md-raised" ng-click="$ctrl.getQuas()" ng-show="$ctrl.step==0">Get your Quastion</md-button>

      	        <div ng-show="$ctrl.step==1">
      	        <div>
      	         <label><b>{{$ctrl.ForgetPassQuastion}}:</b></label>
                  <input type="text"
                    name="answer"
                    placeholder="Enter Answer"
                    ng-model="$ctrl.ForgetPassAns"
                    ng-minlength=3
                    required
                    autocomplete="off" />
                  <span class="glyphicon glyphicon-ok form-control-icon success" ng-show="Register_form.answer.$valid"></span>
                  <p class="help-block" ng-show="Register_form.answer.$error.required">Forget Password Quastion is required.</p>
                  <p class="help-block" ng-if="Register_form.answer.$error.minlength">Must be at least 3 characters.</p>
                </div>

                   <div>
                    <md-button class="md-raised" ng-click="$ctrl.getPass()" type="submit" ng-disabled="$ctrl.insignupprocess">get your password</md-button>
                    </div>
                    </div>
      	        </div>
      	    </form>
      	  </div>
      `,
      controller: ['UserService','$location','$mdDialog','$scope',function forgetPasswordController(UserService,$location, $mdDialog,$scope) {
        var self =this;
        self.step=0;
        self.getQuas= function (){
        UserService.getUserQuastion(self.Username).then(function(success){
                self.ForgetPassQuastion = success.PasswordQuastion;
                self.step =1;
              },function (error) {
                  console.log(error);
                 alert(error);
               });
        }
        self.change= function (){
                self.step=0;
        }

        self.getPass= function (){
            self.insignupprocess=true;
            user = {
                     "UserName": self.Username,
                     "ForgetPassAns": self.ForgetPassAns
                };
            UserService.forgetPass(user).then(function (success){
                console.log(success);
                alert("your password is : " + success);
                self.insignupprocess=false;
                $location.path('/login');
                // window.location.href= window.location.pathname;
                 },function (error){
                    console.log(error);
                     alert(error);
                     self.insignupprocess=false;
                   });

    		};
        }]
    });
