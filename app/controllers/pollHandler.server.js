'use strict';
var mongoose = require('mongoose');
var Poll = require('../models/pollSchema.js');
var Option = require('../models/optionSchema');
var Vote = require('../models/voteSchema');
function pollHandler(db) {

  this.showPoll = function(req, res) {
    Poll
      .findOne({_id: req.params.id})
      .exec(function(err, result){
        if (err) { throw err; }
        res.json(result);
      });

  };

  this.getVotes = function(req, res) {
    if (req.session.votes) {
      res.json(req.session.votes);
    } else {
      req.session.votes = [];
      res.json(req.session.votes);
    }
  }

  this.getList = function(req, res) {
    Poll.find({}).select('_id question')
    .exec(function(err, result){
      if (err) {throw err};
      res.json(result);
    })
  }

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

  this.addOptions = function(req, res) {
    var userReq = req.body;
    var pollId = req.params.id;

    Option.count({}, function(err, count) {
      if(err) { throw err; }
      prepareOptions(count, pollId, userReq);
    });

    var prepareOptions = function(c, pollId, userReq) {
      var id = parseInt(c);
      var optionsToAdd = userReq.responses.length;
      var response = []
      for (var i = 0; i < optionsToAdd; i++) {
        var doc = {_id: c, text: userReq.responses[i], pollId: pollId };
        var option = new Option(doc);
        option.save(function(err, result) {
          if (err) { throw err; }
          response.push(doc);
        });
        c++;
      };
      res.json(response);
    };
  };

  this.showOptions = function(req, res) {
    var pollId = req.params.id;

    Option.find({ pollId: pollId }).select('_id text')
    .exec(function(err, result){
      if (err) {throw err};
      res.json(result);
    });
  }

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
  }

  this.countVotes = function(req, res) {
    var id = req.params.id;
    Vote.count({ optionId: id }, function(err, count) {
      if (err) { throw err };
      res.json({ count: count });
    });
  }
};

module.exports = pollHandler;