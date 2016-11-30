var mongoose = require("mongoose")
var crypto = require('crypto')
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId


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
});

var User = mongoose.model("User", userSchema)

module.exports = {User}
