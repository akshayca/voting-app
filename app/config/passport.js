'use strict';

var GitHubStrategy = require('passport-github2').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/userSchema');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

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

  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "https://ubershibs-voting-app.herokuapp.com/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {
      process.nextTick(function() {
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
      });
    }
  ));

};