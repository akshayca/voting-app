'use strict';
var pollHandler = require('../controllers/pollHandler.server.js');

module.exports = function (app, db) {
  var PollHandler = new pollHandler();

  app.route('/')
    .get(function (req, res) {
      res.sendFile(process.cwd() + '/public/index.html');
    });

  app.route('/polls')
    .get(function (req, res) {
      res.sendFile(process.cwd() + '/public/search.html');
  });

  app.route('/polls/new')
    .get(function(req, res) {
      res.sendFile(process.cwd() + '/public/poll_new.html');
  });

  app.route('/polls/:id')
    .get(function(req, res) {
      res.sendFile(process.cwd() + '/public/poll.html');
    });

  app.route('/api/polls')
    .get(PollHandler.getList)
    .post(PollHandler.addPoll);

  app.route('/api/polls/:id')
    .get(PollHandler.showPoll)
    .post(PollHandler.addOptions);

  app.route('/api/polls/:id/options')
    .get(PollHandler.showOptions);

  app.route('/api/polls/:pollId/options/:optionId')
    .get(PollHandler.vote);

  app.route('/api/search')
    .get(PollHandler.getFilteredList);

  app.route('/api/votes')
    .get(PollHandler.getVotes);

  app.route('/api/votes/:id')
    .get(PollHandler.countVotes);

  app.route('/api/allvotes/:id')
    .get(PollHandler.totalPollVotes);
};
