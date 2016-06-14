'use strict';
var mongoose = require('mongoose');
var Poll = require('../models/pollSchema.js');
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
    var profileId = req.params.socialId;
    User.findOne({ someID: profileId }).select('_id username avatar')
    .exec(function(err, profileUser) {
      if (profileUser) {
        Poll.find({ creator: profileUser._id, deletedAt: { "$exists": false } }).select('_id question')
        .exec(function(err, result){
          if (err) {throw err};
          var profileUserPolls = result;
          if (req.user) {
            res.render('user', { profileUser: profileUser.username, polls: profileUserPolls, profileAvatar: profileUser.avatar, username: req.user.username, userId: req.user._id });
          } else {
            res.render('user', { profileUser: profileUser.username, polls: profileUserPolls, profileAvatar: profileUser.avatar });
          }
        });
      }
    });
  };
};

module.exports = userHandler;