// var express = require('express')
// var path = require('path')
// var favicon = require('serve-favicon')
// var logger = require('morgan')
// var cookieParser = require('cookie-parser')
// var bodyParser = require('body-parser')
// var passport = require('passport')
//
// require('./app_api/models/users')
// require('./app_api/config/passport')
//
// mongoose.connect("mongodb://localhost/weightmate")

var app = angular.module('weightMateApp', ['ui.router'])

app.factory('users', [function() {
  var o = {
    users: []
  }
  return o
}])

app.controller('MainCtrl', [
'$scope',
'users',
function($scope, users){
  $scope.users = users.users
}])

app.controller('UsersCtrl', [
'$scope',
'$stateParams',
'users',
function($scope, $stateParams, users){
  $scope.user = users.users[$stateParams.id]
}])

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
    })
    .state('users', {
      url: '/users/{id}',
      templateUrl: '/users.html',
      controller: 'UsersCtrl'
    })

  $urlRouterProvider.otherwise('home')
}])


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
