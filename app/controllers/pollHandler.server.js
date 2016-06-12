'use strict';
var mongoose = require('mongoose');
var Poll = require('../models/pollSchema.js');
var Option = require('../models/optionSchema');
var Vote = require('../models/voteSchema');
var User = require('../models/userSchema');

function pollHandler(db) {

  // Returns a single poll, per the /polls/:id param
  this.showPoll = function(req, res) {
    Poll.findOne({_id: req.params.id})
      .exec(function(err, result){
        if (err) { throw err; }
        res.json(result);
      });
  };

  // Returns the options for the poll specified above
  this.showOptions = function(req, res) {
    var pollId = req.params.id;

    Option.find({ pollId: pollId }).select('_id text')
      .exec(function(err, result){
        if (err) {throw err};
        res.json(result);
      });
  };

  // Returns an array of polls voted on in the current session
  this.getVotes = function(req, res) {
    if (req.session.votes) {
      res.json(req.session.votes);
    } else {
      req.session.votes = [];
      res.json(req.session.votes);
    }
  };

  // Returns all polls
  this.getList = function(req, res) {
    Poll.find({}).select('_id question')
      .exec(function(err, result){
        if (err) {throw err};
        res.json(result);
      });
  };

  // Returns a filtered list of polls, based on the query string in the req
  this.getFilteredList = function(req, res) {
    var terms = req.query.q.split(' ');
    var regexString = "";
    for (var i = 0; i < terms.length; i++) {
      regexString += terms[i];
      if (i < terms.length - 1) regexString += '|';
    };
    var re = new RegExp(regexString, 'ig');
    Poll.find({ question: re })
      .exec(function(err, result) {
        if (err) {throw err};
        res.json(result);
      });
  };

  // Add a poll
  this.addPoll = function(req, res) {
    var userReq = req.body;

    Poll.count({}, function(err, count) {
      if (err) {throw err;}
      preparePoll(count, userReq);
    });

    var preparePoll = function(c, userReq) {
      var id = parseInt(c);
      var doc = { _id: id, question: userReq.question };
      var poll = new Poll(doc);
      poll.save(function(err, result) {
        if (err) { throw err; }
        res.json(result);
      });
    };
  };

  // Add options to a poll
  this.addOptions = function(req, res) {
    var userReq = req.body;
    var pollId = req.params.id;

    Option.count({}, function(err, count) {
      if(err) { throw err; }
      prepareOptions(count, pollId, userReq, res);
    });

    var prepareOptions = function(c, pollId, userReq, res) {
      var id = parseInt(c);
      var optionsToAdd = userReq.responses.length;
      var response = []
      for (var i = 0; i < optionsToAdd; i++) {
        if (userReq.responses[i].length > 0) {
          var doc = {_id: c, text: userReq.responses[i], pollId: pollId };
          var option = new Option(doc);
          option.save(function(err, result) {
            if (err) { throw err; }
            response.push(doc);
          });
          c++;
        }
      };
      res.json(response);
    };
  };

  // Record a user's vote on a specific poll
  this.vote = function(req, res) {
    var pollId = req.params.pollId;
    var optionId = req.params.optionId;

    var doc = { optionId: optionId, pollId: pollId };
    var vote = new Vote(doc);
    vote.save(function(err, result) {
      if (err) { throw err; }
      req.session.votes.push(pollId);
      res.redirect('/polls/' + pollId);
    });
  };

  // Tally the votes for an option on a poll
  this.countVotes = function(req, res) {
    var id = req.params.id;
    Vote.count({ optionId: id }, function(err, count) {
      if (err) { throw err; }
      res.json({ count: count });
    });
  };

  this.totalPollVotes = function(req, res) {
    var id = req.params.id;
    Vote.count({ pollId: id }, function(err, count) {
      if (err) { throw err; }
      res.json({ count: count });
    });
  };
};

module.exports = pollHandler;