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

  .factory("UserFactory", [
    "$resource",
    UserFactoryFunction
  ])
  //
  // .controller("UserShowCtrl", [
  //   "$state",
  //   "$stateParams",
  //   "User",
  //   UserShowControllerFunction
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
        templateUrl: "/assets/js/ng-views/logreg/login.html"
      })
      .state("register", {
        url: "/register",
        templateUrl: "/assets/js/ng-views/logreg/register.html"
      })
      // .state("show", {
      //   url: "/candidates/:name",
      //   templateUrl: "/assets/js/ng-views/show.html",
      //   controller: "showCtrl",
      //   controllerAs: "vm"
      // })
    $urlRouterProvider.otherwise("/")
  }

  function UserFactoryFunction ($resource) {
    return $resource("/api/users/:email", {}, {
      update: {method: "PUT"}
    })
  }

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

//ERROR CATCHING SECTION
// app.use(function (err, req, res, next) {
//   if (err.name === 'UnauthorizedError') {
//     res.status(401)
//     res.json({"message" : err.name + ": " + err.message})
//   }
// })
