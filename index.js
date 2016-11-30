var express  = require("express");
var parser   = require("body-parser");
var hbs      = require("express-handlebars");
var mongoose = require("mongoose");
var app      = express();
var Schema   = require("./db/schema.js");
var User     = Schema.User
var seedData = require("./db/seeds");

//replaces connection.js file
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/weightmate");

//Used for clearing database - only use on initial seeding
// User.remove({}).then(function(){
//   User.collection.insert(seedData).then(function(){
//     process.exit();
//   });
// });

//Express (index.js) handles routes and designates view engine (Handlebars)
app.set("port", process.env.PORT || 3001);
app.set("view engine", "hbs");
app.engine(".hbs", hbs({
  extname:        ".hbs",
  partialsDir:    "views/",
  layoutsDir:     "views/",
  defaultLayout:  "layout-main"
}));

//designates "public" directory as "assets" and tells body parser to parse JSON
app.use("/assets", express.static("public"));
app.use(parser.json({extended: true}));

//**routing code**//
//index route (READ)
app.get("/api/users", function(req, res){
  User.find({}).then(function(users) {
    console.log(users)
    res.json(users)
    })
  });

//show route (READ)
app.get("/api/users/:email", function(req, res){
  User.findOne({email: req.params.email}).then(function(user){
    res.json(user)
  });
});

//new route (CREATE)
app.post("/api/users", function(req, res){
  User.create(req.body).then(function(user){
    res.json(user);
  });
});

//delete route (DESTROY)
app.delete("/api/users/:email", function(req, res){
  User.findOneAndRemove({email: req.params.email}).then(function(){
    res.json({success: true})
  });
});

//edit route (UPDATE)
app.put("/api/users/:email", function(req, res){
  User.findOneAndUpdate({email: req.params.email}, req.body, {new: true}).then(function(user){
    res.json(user);
  });
});

//listener and HTML5 enabler
app.get("/*", function(req, res){
  res.render("primary");
});

app.listen(app.get("port"), function(){
  console.log("It's aliiive!");
});
