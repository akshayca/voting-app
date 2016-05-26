'use strict';
var mongoose = require('mongoose');
var path = process.cwd();
var pollHandler = require('../controllers/pollHandler.server.js');

module.exports = function (app, db) {
  var PollHandler = new pollHandler();
  
  app.route('/')
    .get(function (req, res) {
      res.sendFile(process.cwd() + '/public/index.html');
    });
  
  app.route('/polls/:id')
    .get(function(req, res) {
      res.sendFile(process.cwd() + '/public/poll.html');
    });
      
  app.route('/api/polls')
    .get(PollHandler.getList)
    .post(PollHandler.addPoll);

  app.route('/api/polls/:id')  
    .get(PollHandler.showPoll);
  
};
