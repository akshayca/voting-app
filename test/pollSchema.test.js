'use strict';

var chai = require('chai');
var should = chai.should();

// import the mongoose helper utilities
var utils = require('./dbutils');

// import the User model
var Poll = require('../app/models/pollSchema');

describe('Polls: model', function() {

  describe('#create()', function() {
    it('should create a new Poll', function(done) {
      var newPoll = {
        _id: 1,
        question: 'Test?'
      };
      Poll.create(newPoll, function(err, createdPoll) {
        should.not.exist(err);
        createdPoll._id.should.equal(1);
        createdPoll.question.should.equal('Test?');
        done();
      });
    });
  });

  describe('#findOne()', function() {
    it('should create a new Poll', function(done) {
      var newPoll = {
        _id: 1,
        question: 'Test?'
      };
      Poll.create(newPoll, function(err, createdPoll) {
        should.not.exist(err);
        createdPoll._id.should.equal(1);
        Poll.findOne({ _id: 1 }, function(err, result) {
          should.not.exist(err);
          result.question.should.equal('Test?');
          done();
        });
      });
    });
  });

  describe('delete (#findOneAndUpdate)', function() {
    it('should create a new Poll', function(done) {
      var date = new Date(1234567890);
      var newPoll = {
        _id: 1,
        question: 'Test?'
      };
      Poll.create(newPoll, function(err, createdPoll) {
        should.not.exist(err);
        createdPoll._id.should.equal(1);
        Poll.findOneAndUpdate({ _id: 1 },{ deletedAt: date }, { new: true }, function(err, result) {
          should.not.exist(err);
          result.deletedAt.should.deep.equal(date);
          done();
        });
      });
    });
  });
});
