var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var User = require('../models/userSchema');
var config = require('../_config');
var init = require('./init');

passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: config.twitter.callbackURL
  },
  function(token, tokenSecret, profile, done) {
    var searchQuery = {
      someID: profile.id
    };

    var updates = {
      avatar: profile.photos[0].value,
      username: profile.username,
      name: profile.displayName,
      someID: profile.id
    };

    var options = {
      upsert: true
    };

    // Update the user if he/she exists, or add a new user
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