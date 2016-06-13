var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/userSchema');
var init = require('./init');

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "https://voting-app-4-ubershibs.c9users.io:8080/auth/twitter/callback"
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