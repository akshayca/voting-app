'use strict';
var pollHandler = require('../controllers/pollHandler.server.js');
var userHandler = require('../controllers/userHandler.server.js');
var express = require('express');
var router = express.Router();

var PollHandler = new pollHandler();
var UserHandler = new userHandler();
var passportGithub = require('../auth/github');
var passportTwitter = require('../auth/twitter');

// Client routes
router.get('/', PollHandler.getList); // Converted to swig templating - PollHandler.getList renders 'index' with data///////

router.get('/about', function(req, res) {
  var locals = currentUserLocals(req);
  res.render('about', locals);
});

router.get('/polls', function (req, res) {
    var locals = currentUserLocals(req);
    res.render('search', locals);
});

router.route('/polls/new')
  .get(isLoggedIn, function(req, res) {
    var locals = currentUserLocals(req);
    res.render('poll_new', locals);
});

router.get('/polls/:id', PollHandler.showPoll); // Converted to swig templating - PollHandler renders 'poll' with data

router.route('/users/:socialId')
  .get(UserHandler.getUserProfile);

// API routes
router.route('/api/polls')
  .get(PollHandler.getList) // Duplicated / - deprecate when possible
  .post(PollHandler.addPoll);

router.route('/api/polls/:id')
  .get(PollHandler.showPoll) // Duplicates /polls/:id - deprecate when possible
  .post(PollHandler.addOptions);

router.route('/api/polls/:id/delete')
  .get(PollHandler.deletePoll);

router.route('/api/polls/user/:id')
  .get(PollHandler.getUserPolls);

router.route('/api/polls/:pollId/lastoption')
  .get(PollHandler.lastOption);

router.route('/api/polls/:id/options')
  .get(PollHandler.showOptions);

router.route('/api/polls/:pollId/options/:optionId')
  .get(PollHandler.vote);

router.route('/api/search')
  .get(PollHandler.getFilteredList);

router.route('/api/votes')
  .get(PollHandler.getVotes);

router.route('/api/votes/:id')
  .get(PollHandler.countVotes);

router.route('/api/allvotes/:id')
  .get(PollHandler.totalPollVotes);

router.route('/api/currentuser/:username')
  .get(UserHandler.isCurrentUser);

// Auth routes
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

router.get('/auth/github', passportGithub.authenticate('github', { scope: [ 'user' ] }));

router.get('/auth/github/callback',
  passportGithub.authenticate('github', { successRedirect: '/', failuerRedirect: '/login' }));

router.get('/auth/twitter', passportTwitter.authenticate('twitter'));

router.get('/auth/twitter/callback',
  passportTwitter.authenticate('twitter'), function(req, res) {
    if (req.session) {
      var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
      delete req.session.redirectTo;
      res.redirect(redirectTo);
    } else {
      res.redirect('/');
    }
  }
);

// Auth helpers
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.session.redirectTo = req.path;
    res.redirect('/login');
  }
}

function currentUserLocals(req) {
  var locals;

  if (req.user) {
    locals = { username: req.user.username, userId: req.user._id, profile: '/users/' + req.user.someID, avatar: req.user.avatar };
  } else {
    locals = {};
  }

  return locals;
}

module.exports = router;