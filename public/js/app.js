angular
  .module("weightMateApp", [
    "ui.router",
    "ngResource"
  ])

  .config([
    "$stateProvider",
    "$locationProvider",
    "$urlRouterProvider",
    RouterFunction
  ])

  .service('authentication', [
    '$http',
    '$window',
    authentication
  ])

  .controller('loginCtrl', [
    '$state',
    authentication,
    loginControllerFunction
  ])

  // .factory("UserFactory", [
  //   "$resource",
  //   UserFactoryFunction
  // ])


  function RouterFunction ($stateProvider, $locationProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true)
    $stateProvider
      .state("welcome", {
        url: "/",
        templateUrl: "/assets/js/ng-views/welcome.html"
      })
      .state("login", {
        url: "/login",
        templateUrl: "/assets/js/ng-views/logreg/login.html",
        controller: "loginCtrl",
        controllerAs: "vm"
      })
      .state("register", {
        url: "/register",
        templateUrl: "/assets/js/ng-views/logreg/register.html",
        controller: "registerCtrl",
        controllerAs: "vm"
      })
      // .state("login", {
      //   url: "/login",
      //   templateUrl: "/assets/js/ng-views/logreg/login.html",
      //   controller: "loginCtrl",
      //   controllerAs: "vm"
      // })

    $urlRouterProvider.otherwise("/")
  }

//authentication service function
  function authentication ($http, $window) {

    var saveToken = function (token) {
      $window.localStorage['mean-token'] = token
    }

    var getToken = function () {
      return $window.localStorage['mean-token']
    }

    logout = function() {
      $window.localStorage.removeItem('mean-token')
    }

    register = function(user) {
    return $http.post('/api/register', user).success(function(data){
      saveToken(data.token)
      })
    }

    login = function(user) {
    return $http.post('/api/login', user).success(function(data) {
      saveToken(data.token)
      })
    }

    return {
      saveToken,
      getToken,
      logout
    }

  }


  function loginControllerFunction ($state, authentication) {
    var vm = this;

    vm.credentials = {
      email : "",
      password : ""
    };

    vm.onSubmit = function () {
      authentication
      .login(vm.credentials)
      .error(function(err){
        alert(err);
      })
      .then(function(){
        $state.go('profile');
      });
    };

  }

  function registerControllerFunction ($state, authentication) {
    var vm = this;

    vm.credentials = {
      email : "",
      password : ""
    };

    vm.onSubmit = function () {
      authentication
        .register(vm.credentials)
        .error(function(err){
          alert(err);
        })
        .then(function(){
          $state.go('profile');
        });
    };


  // function UserFactoryFunction ($resource) {
  //   return $resource("/api/users/:email", {}, {
  //     update: {method: "PUT"}
  //   })
  // }










  // function indexController ($state, User) {
  // User.query().$promise.then(response => this.users = response)
  //   this.newCandidate = new Candidate()
  //   this.create = function() {
  //     this.newCandidate.$save().then(function(candidate){
  //       $state.go("show", {name: candidate.name})
  //     })
  //   }
  // }

  // function showController ($state, $stateParams, Candidate) {
  //   this.candidate = Candidate.get({name: $stateParams.name})
  //   this.update = function() {
  //     this.candidate.$update({name: $stateParams.name})
  //   }
  //   this.destroy = function() {
  //     this.candidate.$delete({name: $stateParams.name}).then(function(){
  //       $state.go("index")
  //     })
  //   }
  // }



// app.controller("NewCtrl", [
//   '$scope',
//   'buddies',
//   function($scope, buddies) {
//     $scope.addBuddy = function() {
//       $scope.buddies.push(
//       { username: this.username,
//         first_name: this.first_name,
//         last_name: this.last_name,
//         img_url: this.img_url,
//         email: this.email,
//         city: this.city,
//         state: this.state,
//         zip: this.zip,
//         street_address: this.street_address,
//         bench: this.bench,
//         squat: this.squat,
//         deadlift: this.deadlift
//       })
//       $scope.username = ''
//       $scope.first_name = ''
//       $scope.last_name = ''
//       $scope.img_url = ''
//       $scope.email = ''
//       $scope.city = ''
//       $scope.state = ''
//       $scope.zip = ''
//       $scope.street_address = ''
//       $scope.bench = ''
//       $scope.squat = ''
//       $scope.deadlift = ''
//       }
//     }
//   ])
//
