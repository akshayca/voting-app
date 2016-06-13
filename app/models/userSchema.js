'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create User Schema
var userSchema = new Schema({
  avatar: String,
  username: String,
  name: String,
  someID: String
});


module.exports = mongoose.model('User', userSchema);