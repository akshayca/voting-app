'use strict';
var mongoose = require('mongoose');
var Poll = require('../models/pollSchema.js');
var Option = require('../models/optionSchema');
var Vote = require('../models/voteSchema');

function pollHandler(db) {

  // Returns all non-deleted polls
  this.getList = function(req, res) {
    var pollData = [];
    Poll.find({ deletedAt: { "$exists": false } }).select('_id question')
      .exec(function(err, result){
        if (err) {throw err; }
        if (req.user) {
          res.render('index', { username: req.user.username, userId: req.user._id, profile: '/users/' + req.user.someID, avatar: req.user.avatar, polls: result });
        } else {
          console.log(pollData);
          res.render('index', { polls: result });
        }
      });
  };

  // Returns a single poll, per the /polls/:id param
  this.showPoll = function(req, res) {
    Poll.findOne({_id: req.params.id, deletedAt: { "$exists": false } })
      .populate('creator')
      .exec(function(err, result){
        if (err) { throw err; }
        if (req.user) {
          res.render('poll', { username: req.user.username, userId: req.user._id, profile: '/users/' + req.user.someID, avatar: req.user.avatar, pollId: result._id, question: result.question, creator: result.creator });
        } else {
          res.render('poll', { pollId: result._id, question: result.question, creator: result.creator });
        }
      });
  };

  // Returns the options for the poll specified above
  this.showOptions = function(req, res) {
    var pollId = req.params.id;

    Option.find({ pollId: pollId, deletedAt: { "$exists": false } })
      .select('_id text')
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

  // Returns a filtered list of polls, based on the query string in the req
  this.getFilteredList = function(req, res) {
    var terms = req.query.q.split(' ');
    var regexString = "";
    for (var i = 0; i < terms.length; i++) {
      regexString += terms[i];
      if (i < terms.length - 1) regexString += '|';
    };
    var re = new RegExp(regexString, 'ig');
    Poll.find({ question: re, deletedAt: { "$exists": false } })
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
      var doc = { _id: id, question: userReq.question, creator: userReq.creator };
      var poll = new Poll(doc);
      poll.save(function(err, result) {
        if (err) { throw err; }
        res.json(result);
      });
    };
  };

  // Add options to a poll
  this.addOptions = function(req, res) {
    var pollId = req.params.id;

    Option.count({}, function(err, count) {
      if(err) { throw err; }
      var id = parseInt(count);
      var optionsToAdd = req.body.responses.length;
      var savedOptions = [];
      for (var i = 0; i < optionsToAdd; i++) {
        if (req.body.responses[i].length > 0) {
          var doc = {_id: id, text: req.body.responses[i], pollId: pollId };
          var option = new Option(doc);
          option.save(function(err, result) {
            if (err) { throw err; }
            savedOptions.push(doc)
          });
          id++;
        }
      };
      res.json(savedOptions);
    });
  };

  // Record a user's vote on a specific poll
  this.vote = function(req, res) {
    var pollId = req.params.pollId;
    var optionId = req.params.optionId;
    if (req.user) {
      var user = req.user._id;
    }
    var doc = { user: user, optionId: optionId, pollId: pollId };
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

  // Tally votes for all options on a poll
  this.totalPollVotes = function(req, res) {
    var id = req.params.id;
    Vote.count({ pollId: id }, function(err, count) {
      if (err) { throw err; }
      res.json({ count: count });
    });
  };

  // Return a list of polls created by a user
  this.getUserPolls = function(req, res) {
    var id = 'ObjectId("' + req.params.id + '")';
    Poll.find({creator: id, deletedAt: { "$exists": false } }).select('_id question')
      .exec(function(err, result){
        if (err) {throw err};
        res.json(result);
      });
  };

  // Deletes (archives) a poll
  this.deletePoll = function(req, res) {
    var id = req.params.id;
    Poll.findOne({ _id: id })
    .populate('creator')
    .exec(function(err, result) {
      if (err) { throw err; }
      if (result.creator.someID === req.user.someID) {
        Poll.findOneAndUpdate({ _id: id }, { deletedAt: Date.now() }, { new: true }, function(err, result) {
          if (err) { throw err };
          res.json(result);
        });
      } else {
        res.send("unauthorized");
      }
    });
  }

  // Returns the last-added option for a poll
  this.lastOption = function(req, res) {
    var id = req.params.pollId;
    Option.find({ pollId: id }).sort({ _id: -1 }).limit(1)
    .exec(function(err, result) {
      console.log(result);
      if (err) { throw err; }
      res.json(result);
    });
  }
}

module.exports = pollHandler;