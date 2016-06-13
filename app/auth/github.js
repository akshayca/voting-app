var passport = require('passport');
require('dotenv').config();
var GitHubStrategy = require('passport-github2').Strategy

var User = require('../models/userSchema');
var config = require('../_config');
var init = require('./init');

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "https://voting-app-4-ubershibs.c9users.io:8080/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {

    var searchQuery = {
      someID: profile.id,
    };

    var updates = {
      avatar: profile.avatar_url,
      username: profile.username,
      name: profile.displayName,
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
  }
));

// serialize user into the session
init();

module.exports = passport;