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
router.route('/')
  .get(function (req, res) {
    var locals = currentUserLocals(req);
    res.render('index', locals);
});

router.get('/about', function(req, res) {
  var locals = currentUserLocals(req);
  res.render('about', locals);
});

router.route('/polls')
  .get(function (req, res) {
    var locals = currentUserLocals(req);
    res.render('search', locals);
});

router.route('/polls/new')
  .get(isLoggedIn, function(req, res) {
    var locals = currentUserLocals(req);
    res.render('poll_new', locals);
});

router.route('/polls/:id')
  .get(function(req, res) {
    var locals = currentUserLocals(req);
    res.render('poll', locals);
  });

router.route('/users/:username')
  .get(UserHandler.getUserProfile);

// API routes
router.route('/api/polls')
  .get(PollHandler.getList)
  .post(PollHandler.addPoll);

router.route('/api/polls/:id')
  .get(PollHandler.showPoll)
  .post(PollHandler.addOptions);

router.route('/api/polls/:id/delete')
  .get(PollHandler.deletePoll);

router.route('/api/polls/user/:id')
  .get(PollHandler.getUserPolls);

router.route('/api/polls/:id/options')
  .get(PollHandler.showOptions);

router.route('/api/polls/:pollId/options/:optionId')
  .get(PollHandler.vote);

router.route('/api/polls/:pollId/lastoption')
  .get(PollHandler.lastOption);

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

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

router.get('/auth/github', passportGithub.authenticate('github', { scope: [ 'user' ] }));

router.get('/auth/github/callback',
  passportGithub.authenticate('github'),
  function(req, res) {
    var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
    delete req.session.redirectTo;
    res.redirect(redirectTo)
  }
);

router.get('/auth/twitter', passportTwitter.authenticate('twitter'));

router.get('/auth/twitter/callback',
  passportTwitter.authenticate('twitter'),
  function(req, res) {
    var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
    delete req.session.redirectTo;
    res.redirect(redirectTo)
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
    locals = { username: req.user.username, userId: req.user._id, profile: '/users/' + req.user.username, avatar: req.user.avatar };
  } else {
    locals = {};
  }

  return locals;
}

module.exports = router;