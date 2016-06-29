'use strict';
var chai = require('chai');
var should = chai.should();

// import the mongoose helper utilities
var utils = require('./dbutils');

// import the User model
var User = require('../app/models/userSchema');

describe('Users: models', function() {

  describe('#create()', function() {
    it('should create a new User', function(done) {
      var newUser = {
        avatar: 'http://test.com/test',
        username: 'Batman',
        name: 'Bat Man',
        someID: '123456789'
      };
      User.create(newUser, function(err, createdUser) {
        should.not.exist(err);
        createdUser.avatar.should.equal('http://test.com/test');
        createdUser.username.should.equal('Batman');
        createdUser.name.should.equal('Bat Man'),
        createdUser.someID.should.equal('123456789');
        done();
      });
    });
  });

  describe('#findOne()', function() {
    it('should find and return one user', function(done) {
      var newUser = {
        avatar: 'http://test.com/test',
        username: 'Batman',
        name: 'Bat Man',
        someID: '123456789'
      };
      User.create(newUser, function(err, createdUser) {
        should.not.exist(err);
        should.exist(createdUser);
        User.findOne({ someID: '123456789'}, function(err, result) {
          should.not.exist(err);
          result.username.should.equal('Batman');
          done();
        })
      });
    });
  });
});
