'use strict';
var pollHandler = require('../controllers/pollHandler.server.js');
var express = require('express');
var router = express.Router();

var PollHandler = new pollHandler();
var passportGithub = require('../auth/github');
var passportTwitter = require('../auth/twitter');

// Client routes
router.route('/')
  .get(function (req, res) {
    res.render('index');
  });

router.route('/polls')
  .get(function (req, res) {
    res.render('search');
});

router.route('/polls/new')
  .get(function(req, res) {
    res.render('poll_new');
});

router.route('/polls/:id')
  .get(function(req, res) {
    res.render('poll');
  });

// API routes
router.route('/api/polls')
  .get(PollHandler.getList)
  .post(PollHandler.addPoll);

router.route('/api/polls/:id')
  .get(PollHandler.showPoll)
  .post(PollHandler.addOptions);

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

// Auth routes
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/auth/github', passportGithub.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/auth/github/callback',
  passportGithub.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication
    res.json(req.user);
  });

router.get('/auth/twitter', passportTwitter.authenticate('twitter'));

router.get('/auth/twitter/callback',
  passportTwitter.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication
    res.json(req.user);
  });

module.exports = router;