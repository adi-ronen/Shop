angular.
  module('registration',['ngMaterial']).component('registration', {
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
                    autocomplete="off" />
                  <span class="glyphicon glyphicon-ok form-control-icon success" ng-show="Register_form.username.$valid"></span>
                  <p class="help-block" ng-show="Register_form.username.$error.required">Username is required.</p>
                  <p class="help-block" ng-show="Register_form.username.$error.pattern">Username must be letters  only.</p>
                  <p class="help-block" ng-if="Register_form.username.$error.minlength">Must be 3-8 characters.</p>
                  <p class="help-block" ng-if="Register_form.username.$error.maxlength">Must be 3-8 characters.</p>
                </div>
<br>
      	        <div>
      	        <label><b>Password:</b></label>
                  <input type="password"
                    name="psw1"
                   placeholder="Enter Password"
                   ng-model="$ctrl.Password"
                    ng-minlength=5
                    ng-maxlength=10
                    required
                    ng-pattern="/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/"
                    autocomplete="off"
                    ng-change="$ctrl.passwordChange()"
                    />
                  <span class="glyphicon glyphicon-ok form-control-icon success" ng-show="Register_form.psw1.$valid"></span>
                  <p class="help-block" ng-show="Register_form.psw1.$error.required">Password is required.</p>
                  <p class="help-block" ng-show="Register_form.psw1.$error.pattern">Password must contain numbers and letters only.</p>
                  <p class="help-block" ng-if="Register_form.psw1.$error.minlength">Must be 5-10 characters.</p>
                  <p class="help-block" ng-if="Register_form.psw1.$error.maxlength">Must be 5-10 characters.</p>
                </div>




      	            <br>
      	            <label><b>Please Enter Password Again:</b></label>
                    <input type="password" ng-model="$ctrl.Password2" placeholder="Enter Password" name="psw2" required ng-change="$ctrl.passwordChange()" >
                    <span class="glyphicon glyphicon-ok form-control-icon success" ng-show="Register_form.psw1.$valid && $ctrl.Password2valid"></span>
                    <p class="help-block" ng-show="Register_form.psw1.$valid && !$ctrl.Password2valid">Must be the same like the Password above.</p>
                    <br>

                    <p>Country:
                    <select ng-options="country.Name for country in $ctrl.Countries track by country.ID" ng-model="$ctrl.Country">
                        <option value="">select country</option>
                    </select>
                      </p>
                      <p class="help-block" ng-show="!$ctrl.Country">Country is required.</p>

<br>

      	        <div>
      	        <label><b>Please Enter Forget Password Quastion:</b></label>
                  <input type="text"
                    name="quastion"
                    placeholder="Enter Quastion"
                    ng-model="$ctrl.ForgetPassQuastion"
                    ng-minlength=3
                    required
                    autocomplete="off" />
                  <span class="glyphicon glyphicon-ok form-control-icon success" ng-show="Register_form.quastion.$valid"></span>
                  <p class="help-block" ng-show="Register_form.quastion.$error.required">Forget Password Quastion is required.</p>
                  <p class="help-block" ng-if="Register_form.quastion.$error.minlength">Must be at least 3 characters.</p>
                </div>

                   <br>

      	        <div>
      	         <label><b>Please Enter Forget Password Answer:</b></label>
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
                    <label><b>Select Categories:</b></label>
                    <select ng-options="category.Name for category in $ctrl.Categories track by category.Id" ng-model="$ctrl.selectedCategory" ng-change= "$ctrl.update()">
                            <option value="">ALL</option>
                          </select>
                          <md-button class="md-raised" ng-click="$ctrl.AddToSelectedCategories()"  >Add</md-button>


                    <br>
                    <div ng-repeat="category in $ctrl.selectedCategories">
                        <label><b>{{category.Name}}</b></label>
                        <md-button class="md-raised" ng-click="$ctrl.DeleteFromSelectedCategories(category)"  >Delete</md-button>

                    </div>
                    <p class="help-block" ng-show="$ctrl.selectedCategories.length==0">Select At least 1 category</p>
                    <div>
                    <md-button class="md-raised" ng-click="$ctrl.Singup()" type="submit" ng-disabled="$ctrl.insignupprocess || !Register_form.$valid || $ctrl.selectedCategories.length==0 || !$ctrl.Password2valid || !$ctrl.Country">Sing up</md-button>
                    </div>
      	        </div>
      	    </form>
      	  </div>
      `,
      controller: ['httpService','UserService','$location',function registrationController(httpService,UserService,$location) {
        var self =this;
        self.Country = null ;
        self.selectedCategory="";
        self.selectedCategories = [];
        self.selectedCategoriesId = [];
        self.Categories = "";
        self.insignupprocess=false;
        self.Password2valid = true;
      httpService.getAllCategories().then(function(success){
        self.Categories = success.Categories;

      },function (error) {
          console.log(error);
         alert(error);
       });

        httpService.getAllCountries().then(function(success){
                self.Countries = success.Countries;
              },function (error) {
                  console.log(error);
                 alert(error);
               });

        self.AddToSelectedCategories = function (){
            if (!self.selectedCategories.includes(self.selectedCategory) && self.selectedCategory!= ""){
                self.selectedCategories.push(self.selectedCategory);
                self.selectedCategoriesId.push(self.selectedCategory.Id);
            }
        }

       self.DeleteFromSelectedCategories = function (category){
            if (self.selectedCategories.includes(category)){
                self.selectedCategories.pop(category);
                self.selectedCategoriesId.pop(category.Id);
            }
        }

        self.passwordChange= function (){
            self.Password2valid = (self.Password==self.Password2);
        }

        self.Singup= function (){
            self.insignupprocess=true;
            user = {
                     "UserName": self.Username,
                     "Password": self.Password,
                     "CountryId": self.Country.ID,
                     "ForgetPassQuastion": self.ForgetPassQuastion,
                     "ForgetPassAns": self.ForgetPassAns,
                     "CategoriesId": self.selectedCategoriesId
                };
            UserService.signup(user).then(function (success){
                console.log(success);
                alert(success);
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
