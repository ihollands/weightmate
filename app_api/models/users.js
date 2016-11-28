var mongoose = require('mongoose')
var crypto = require('crypto')
var jwt = require('jsonwebtoken')

var userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true
    },
    hash: String,
    salt: String,
    timestamps: true,
    profile: {
      username: String,
      first_name: String,
      last_name: String,
      img_url: String,
      email: String,
      city: String,
      state: String,
      zip: String,
      street_address: String,
      bench: Number,
      squat: Number,
      deadlift: Number
    }
  })


userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex')
}

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex')
  return this.hash === hash
}

userSchema.methods.generateJwt = function() {
  var expiry = new Date()
  expiry.setDate(expiry.getDate() + 7)

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET")
}

mongoose.model('User', userSchema)
