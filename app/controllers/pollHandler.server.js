'use strict';
var mongoose = require('mongoose');
var Poll = require('../models/pollSchema.js');

function pollHandler(db) {
  
  this.showPoll = function(req, res) {
    Poll
      .findOne({_id: req.params.id})
      .exec(function(err, result){
        if (err) { throw err; }
        res.json(result);
      });
    
  };
  
  this.getList = function(req, res) {
    Poll.find({}).select('question')
    .exec(function(err, result){
      if (err) {throw err};
      res.json(result);
    })
  }
  
  this.addPoll = function(req, res) {
    console.log("Routed to the addPoll function");

    Poll.count({}, function(err, count) {
      if (err) {throw err;}
      console.log("Number of records: " + count);
      preparePoll(count);
    });
    
    var preparePoll = function(c) {
      console.log("hit the preparePoll callback a-ok");
      var id = parseInt(c);
      console.log('id is ' + id);
      var doc = {_id: id, creator: "ubershibs", question: "What day is the best?", responses: [{ response: "Tuesday", votes: 8}, {response: "Monday", votes: 6}]};
      var poll = new Poll(doc);
      poll.save(function(err, result) {
        if (err) { throw err; }
        res.json(result);
      });
    };
  };
  
};

module.exports = pollHandler;