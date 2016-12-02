angular
  .module("weightMateApp", [
    "ui.router",
    "ngResource",
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

  .service('meanData', [
    '$http',
    'authentication',
    meanData
  ])

  .controller('loginCtrl', [
    '$state',
    'authentication',
    loginControllerFunction
  ])

  .controller('registerCtrl', [
    '$state',
    'authentication',
    registerControllerFunction
  ])

  .controller('profileCtrl', [
    'meanData',
    profileControllerFunction
  ])

  .controller("editCtrl", [
    '$state',
    'authentication',
    editControllerFunction
  ])


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
      .state("profile", {
        url: "/users/:email",
        templateUrl: "/assets/js/ng-views/users/profile.html",
        controller: "profileCtrl",
        controllerAs: "vm"
      })
      .state("edit", {
        url: "/users/:email/edit",
        templateUrl: "/assets/js/ng-views/users/edit.html",
        controller: "editCtrl",
        controllerAs: "vm"
      })

    $urlRouterProvider.otherwise("/")
  }

//START SERVICES FUNCS
function authentication ($http, $window) {

    var saveToken = function (token) {
      console.log(token)
      $window.localStorage['mean-token'] = token
    }

    var getToken = function () {
      return $window.localStorage['mean-token']
    }

    var isLoggedIn = function() {
      var token = getToken()
      var payload

      if(token){
        payload = token.split('.')[1]
        payload = $window.atob(payload)
        payload = JSON.parse(payload)

        return payload.exp > Date.now() / 1000
      } else {
        return false
      }
    }

    var currentUser = function() {
      if(isLoggedIn()){
        var token = getToken()
        var payload = token.split('.')[1]
        payload = $window.atob(payload)
        payload = JSON.parse(payload)
        return {
          email : payload.email,
          name : payload.name
        }
      }
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

    update = function (user) {
      console.log(user)
      return $http.put('/api/users/:email', user).success(function(data) {
        console.log(data)
        saveToken(data.token)
      })
    }

    logout = function() {
      $window.localStorage.removeItem('mean-token')
    }

    return {
      currentUser : currentUser,
      saveToken : saveToken,
      getToken : getToken,
      isLoggedIn : isLoggedIn,
      register : register,
      login : login,
      logout : logout,
      update: update
    }
  }

function meanData ($http, authentication) {

  var getProfile = function () {
    return $http.get('/api/users/:email', {
      headers: {
        Authorization: 'Bearer '+ authentication.getToken()
      }
    })
  }

  return {
    getProfile
  }
}
//END SERVICES FUNCS

//START CONTROLLER FUNCS
function loginControllerFunction ($state, authentication) {
    var vm = this

    vm.credentials = {
      email : "",
      password : ""
    }

    vm.onSubmit = function () {
      authentication
      .login(vm.credentials)
      .error(function(err){
        alert("Incorrect login credentials. Please enter the correct credentials to continue to your profile.")
      })
      .then(function(){
        $state.go('profile', {email: vm.credentials.email})
      })
    }

  }

function registerControllerFunction ($state, authentication) {
    var vm = this

    vm.credentials = {
      email : "",
      password : ""
    }

    vm.onSubmit = function () {
      authentication
        .register(vm.credentials)
        .error(function(err){
          alert("At a minimum, /'Email/' and /'password/' fields are required in order to register.")
        })
        .then(function(){
          $state.go('profile')
        })
    }
  }

function profileControllerFunction (meanData) {
  console.log("Harambe")

  var vm = this

  vm.user = {}

  meanData.getProfile()
    .success(function(data) {
      vm.user = data
    })
    .error(function (e) {
      console.log(e)
    })
}

function editControllerFunction ($state, authentication) {
  var vm = this

  vm.newValues = {
    email: "",
    username: "",
    age: "",
    weight: "",
    workout_freq: "",
    workout_time: "",
    first_name: "",
    last_name: "",
    img_url: "",
    city: "",
    state: "",
    zip: "",
    street_address1: "",
    street_address2: "",
    bench: "",
    squat: "",
    deadlift: "",
    gym: ""
  }

  vm.onSubmit = function () {
    authentication
      .update(vm.newValues)
      .error(function(err){
        alert("Please review and verify submission values.")
      })
      .then(function(){
        $state.go('profile', {email: vm.newValues.email})
      })
  }
}

// function editControllerFunction ($state, $stateParams, User) {
//   this.candidate = Candidate.get({name: $stateParams.name})
//   this.update = function() {
//     this.candidate.$update({name: $stateParams.name})


//END CONTROLLER FUNCS

  // function indexController ($state, User) {
  // User.query().$promise.then(response => this.users = response)
  //   this.newCandidate = new Candidate()
  //   this.create = function() {
  //     this.newCandidate.$save().then(function(candidate){
  //       $state.go("show", {name: candidate.name})
  //     })
  //   }
  // }


  //   }
  //   this.destroy = function() {
  //     this.candidate.$delete({name: $stateParams.name}).then(function(){
  //       $state.go("index")
  //     })
  //   }
  // }
