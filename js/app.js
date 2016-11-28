var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var passport = require('passport')

require('./app_api/models/db')
require('./app_api/config/passport')

angular
  .module("weightMateApp", [
    "ui.router",
    "ngResource"])
  .config(["$stateProvider",
    RouterFunction])

  .controller("BuddyIndexController", [
    "BuddyFactory",
    BuddyIndexControllerFunction])
  .controller("BuddyShowController", [
    "BuddyFactory",
    "$stateParams",
    BuddyShowControllerFunction])
  .controller("BuddyNewController", [
    "BuddyFactory",
    "$state",
    BuddyNewControllerFunction])
  .controller("BuddyEditController", [
    "BuddyFactory",
    "$state",
    "$stateParams",
    BuddyEditControllerFunction])
  .factory("BuddyFactory", [
    "$resource",
    BuddyFactoryFunction])



  // .controller("ApplicantIndexController", ["ApplicantFactory", ApplicantIndexControllerFunction])
  // .controller("ApplicantShowController", ["ApplicantFactory", "$stateParams", ApplicantShowControllerFunction])
  // .controller("ApplicantNewController", ["ApplicantFactory", "$state", ApplicantNewControllerFunction])
  // .controller("ApplicantEditController", ["ApplicantFactory", "$state", "$stateParams", ApplicantEditControllerFunction])
  // .factory( "ApplicantFactory", ["$resource", ApplicantFactoryFunction])

function RouterFunction($stateProvider){
  $stateProvider
  .state("Home", {
    url: "/home",
    templateUrl: "js/ng-views/home.html"
  })
  .state("buddiesIndex", {
    url: "/buddies",
    controller: "BuddiesIndexController",
    templateUrl: "js/ng-views/buddies/index.html",
    controllerAs: "vm"
  })
  .state("buddyNew", {
    url: "/buddies/new",
    templateUrl: "js/ng-views/buddies/new.html",
    controller: "BuddyNewController",
    controllerAs: "vm"
  })
  .state("buddyShow", {
    url: "/buddies/:id",
    controller: "BuddyShowController",
    controllerAs: "vm",
    templateUrl: "js/ng-views/buddies/show.html"
  })
  .state("buddyEdit", {
    url: "/buddies/:id/edit",
    controller: "BuddyEditController",
    controllerAs: "vm",
    templateUrl: "js/ng-views/buddies/edit.html"
  })
  // .state("applicantIndex", {
  //   url: "/applicants",
  //   controller: "ApplicantIndexController",
  //   controllerAs: "vm",
  //   templateUrl: "js/ng-views/applicants/index.html"
  // })
  // .state("applicantNew", {
  //   url: "/applicants/new",
  //   templateUrl: "js/ng-views/applicants/new.html",
  //   controller: "ApplicantNewController",
  //   controllerAs: "vm"
  // })
  // .state("applicantShow", {
  //   url: "/applicants/:id",
  //   controller: "ApplicantShowController",
  //   controllerAs: "vm",
  //   templateUrl: "js/ng-views/applicants/show.html"
  // })
  // .state("applicantEdit", {
  //   url: "/applicants/:id/edit",
  //   controller: "ApplicantEditController",
  //   controllerAs: "vm",
  //   templateUrl: "js/ng-views/applicants/edit.html"
  // })
}

function BuddyFactoryFunction($resource){
  return $resource( "https://quali-fi.herokuapp.com/buddies/:id", {}, {
    update: {method: "PUT"}
  })
}

function BuddyIndexControllerFunction(BuddyFactory) {
  this.buddies = BuddyFactory.query()
}

function BuddyNewControllerFunction(BuddyFactory, $state){
     this.buddy = new BuddyFactory()
     this.create = function(){
       this.buddy.$save().then(response => $state.go("buddyIndex"))
         // this is where the redirect should happen
       }
     }


function BuddyEditControllerFunction(BuddyFactory, $state, $stateParams){
  this.buddy = BuddyFactory.get({id: $stateParams.id})
  this.update = function(){
    this.buddy.$update({id: $stateParams.id}).then(response => $state.go('buddyIndex'))

  }
  this.destroy = function(){
      this.buddy.$delete({id: $stateParams.id}).then(response => $state.go('buddyIndex'))
    }
}

function BuddyShowControllerFunction(BuddyFactory, $stateParams){
  // To access the full buddy object
  // this.buddy = BuddyFactory.get({id: $stateParams.id})
  // console.log(this.buddy)

  BuddyFactory.get({id: $stateParams.id}).$promise.then(response => this.buddyName = this.buddy = response.buddy_name)



 }

 function ApplicantFactoryFunction($resource){
   return $resource( "https://quali-fi.herokuapp.com/applicants/:id", {}, {
     update: {method: "PUT"}
   })
 }

 function ApplicantIndexControllerFunction(ApplicantFactory) {
   this.applicants = ApplicantFactory.query()
 }

 function ApplicantNewControllerFunction(ApplicantFactory, $state){
      this.applicant = new ApplicantFactory()
      this.create = function(){
        this.applicant.$save().then(response => $state.go("applicantIndex"))
          // this is where the redirect should happen
        }
      }


 function ApplicantEditControllerFunction(ApplicantFactory, $state, $stateParams){
   this.applicant = ApplicantFactory.get({id: $stateParams.id})
   this.update = function(){
     this.applicant.$update({id: $stateParams.id}).then(response => $state.go('applicantIndex'))

   }
   this.destroy = function(){
       this.applicant.$delete({id: $stateParams.id}).then(response => $state.go('applicantIndex'))
     }
 }

 function ApplicantShowControllerFunction(ApplicantFactory, $stateParams){
   // To access the full applicant object
   // this.applicant = ApplicantFactory.get({id: $stateParams.id})
   // console.log(this.applicant)

   ApplicantFactory.get({id: $stateParams.id}).$promise.then(response => this.applicantName = this.applicant = response.name)



  }




app.factory('buddies', [function() {
  var o = {
    buddies: []
  }
  return o
}])

app.controller("MainCtrl", [
  '$scope',
  'buddies',
  function($scope, buddies){
    $scope.buddies = buddies.buddies
  }])

app.controller("NewCtrl", [
  '$scope',
  'buddies',
  function($scope, buddies) {
    $scope.addBuddy = function() {
      $scope.buddies.push(
      { username: this.username,
        first_name: this.first_name,
        last_name: this.last_name,
        img_url: this.img_url,
        email: this.email,
        city: this.city,
        state: this.state,
        zip: this.zip,
        street_address: this.street_address,
        bench: this.bench,
        squat: this.squat,
        deadlift: this.deadlift
      })
      $scope.username = ''
      $scope.first_name = ''
      $scope.last_name = ''
      $scope.img_url = ''
      $scope.email = ''
      $scope.city = ''
      $scope.state = ''
      $scope.zip = ''
      $scope.street_address = ''
      $scope.bench = ''
      $scope.squat = ''
      $scope.deadlift = ''
      }
    }
  ])

  app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: 'views/home.html',
          controller: 'MainCtrl'
        })
        .state('new', {
          url: '/new',
          templateUrl: 'views/new.html',
          controller: 'NewCtrl'
        })

      $urlRouterProvider.otherwise('home')
    }])




//ERROR CATCHING SECTION
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401)
    res.json({"message" : err.name + ": " + err.message})
  }
})
