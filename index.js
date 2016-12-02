var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var parser   = require("body-parser")
var hbs      = require("express-handlebars")
var mongoose = require("mongoose")
var app      = express()
var Schema   = require("./db/schema.js")
var User     = Schema.User
var seedData = require("./db/seeds")

var passport = require('passport')

require('./config/passport')

//replaces connection.js file
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/weightmate")

//Used for clearing database - only use on initial seeding
// User.remove({}).then(function(){
//   User.collection.insert(seedData).then(function(){
//     process.exit()
//   })
// })

//Express (index.js) handles routes and designates view engine (Handlebars)
app.set("port", process.env.PORT || 3001)
app.set("view engine", "hbs")
app.engine(".hbs", hbs({
  extname:        ".hbs",
  partialsDir:    "views/",
  layoutsDir:     "views/",
  defaultLayout:  "layout-main"
}))

//serves favicon from public/favicon.ico (uncomment when present)
//designates "public" directory as "assets"
//tells body parser to parse JSON
// app.use(favicon(__dirname + '/public/favicon.ico'))
app.use("/assets", express.static("public"))
app.use(parser.json({extended: true}))

app.use(passport.initialize())
app.use(passport.session())

//register api controller
var register = function(req, res) {
  var user = new User()

  user.email = req.body.email

  user.setPassword(req.body.password)

  user.save(function(err) {
    var token
    token = user.generateJwt()
    res.status(200)
    res.json({
      "token" : token
    })
  })
}

//update api controller
var update = function(req, res) {
  var user = User.find({email: req.body.email}, req.body, {new: true}).then(function(user){
    var token
    token = user.generateJwt()
    res.status(200)
    res.json({
      "token" : token
    })
  })
}

// //login api controller
var login = function(req, res) {
  passport.authenticate('local', function(err, user, info){
    var token

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err)
      return
    }

    // If a user is found
    if(user){
      token = user.generateJwt()
      res.status(200)
      res.json({
        "token" : token
      })
    } else {
      // If user is not found
      res.status(401).json(info)
    }
  })(req, res)

}

var profileUpdate = function(req, res) {
  User.findOneAndUpdate({email: req.params.email}, req.body, {new: true}).then(function(user) {
      res.json(user)
    })

}

//gives access to Express-JWT methods for authentication - used in routes to ensure verificaiton of JWT
var jwt = require('express-jwt')
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
})

//checks to see that user is logged in
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

//verify that the user is logged in and store user data in an object for manipulation
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



// authentication
app.post('/api/register', register)
app.post('/api/login', login)


// show route (READ)
app.get('/api/users/:email', auth, function(req, res) {
  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    })
  } else {
    // Otherwise continue
    User
      .findById(req.payload._id)
      .exec(function(err, user) {
        res.status(200).json(user)
      })

    }
})

app.put('/api/users/:email', profileUpdate)




//index route (READ)
// app.get("/api/users/", function(req, res){
//   User.find({}).then(function(users) {
//     console.log(users)
//     res.json(users)
//     })
//   })
//
// //show route (READ)
// app.get("/api/users/:email", function(req, res){
//   User.findOne({email: req.params.email}).then(function(user){
//     res.json(user)
//   })
// })
//
// //new route (CREATE)
// app.post("/api/users", function(req, res){
//   User.create(req.body).then(function(user){
//     res.json(user)
//   })
// })
//
// //delete route (DESTROY)
// app.delete("/api/users/:email", function(req, res){
//   User.findOneAndRemove({email: req.params.email}).then(function(){
//     res.json({success: true})
//   })
// })




//listener and HTML5 enabler
app.get("/*", function(req, res){
  res.render("primary")
})

app.listen(app.get("port"), function(){
  console.log("It's aliiive!")
})

//catch unauthorized errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401)
    res.json({"message" : err.name + ": " + err.message})
  }
})
