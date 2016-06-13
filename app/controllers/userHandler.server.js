'use strict';
var mongoose = require('mongoose');
var Poll = require('../models/pollSchema.js');
var Option = require('../models/optionSchema');
var Vote = require('../models/voteSchema');
var User = require('../models/userSchema');

function userHandler(db) {

  this.isCurrentUser = function(req, res) {
    if (!req.user) {
      res.json({"isCurrentUser": "false"});
    } else {
      var checkUser = req.params.username;
      var currentUser = req.user.username;
      if (checkUser === currentUser) {
        res.json({"isCurrentUser": "true"});
      } else {
        res.json({"isCurrentUser": "false"});
      }
    }
  };

  this.getUserProfile = function(req, res) {
    var profileUser = req.params.username;

    User.findOne({ username: profileUser }).select('_id')
    .exec(function(err, result){
      if (err) {throw err};
      if (result) {
        Poll.find({ creator: result }).select('_id question')
        .exec(function(err, result){
          if (err) {throw err};
          var profileUserPolls = result;
          if (req.user) {
            res.render('user', { profileUser: profileUser, polls: profileUserPolls, username: req.user.username, userId: req.user._id });
          } else {
            res.render('user', { profileUser: profileUser, polls: profileUserPolls});
          }
        });
      }
    });
  };
};

module.exports = userHandler;