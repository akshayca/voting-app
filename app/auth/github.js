'use strict';
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy
var User = require('../models/userSchema');
var init = require('./init');


passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      var searchQuery = {
        someID: profile.id,
      };

      var updates = {
        avatar: profile._json.avatar_url,
        username: profile.username,
        someID: profile.id
      };

      var options = {
        upsert: true
      };

      // Update if the user exists, or add new
      User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
        if(err) {
          return done(err);
        } else {
          return done(null, user);
        }
      });
    });
  }
));


// serialize user into the session
init();

module.exports = passport;