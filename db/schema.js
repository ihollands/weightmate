var mongoose = require("mongoose")
var crypto = require('crypto')
var jwt = require('jsonwebtoken');
var Schema = mongoose.Schema

var userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  hash: String,
  salt: String,
  username: String,
  age: Number,
  weight: Number,
  workout_freq: Number,
  workout_time: Number,
  first_name: String,
  last_name: String,
  img_url: String,
  city: String,
  state: String,
  zip: String,
  street_address1: String,
  street_address2: String,
  bench: Number,
  squat: Number,
  deadlift: Number,
  gym: String
})

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
}

userSchema.methods.validPassword = function(password) {
  var attemptHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === attemptHash;
}

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET") //LOCATION 1
}

var User = mongoose.model("User", userSchema)

module.exports = {User}
