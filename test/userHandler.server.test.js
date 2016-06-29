'use strict';

var chai = require('chai');
var should = chai.should();
var utils = require('./dbutils');

var userHandler = require('../app/controllers/userHandler.server.js');

describe('userHandler server', function() {
  describe('#isCurrentUser()', function() {
    it('should be true if req.user matches username passed in parameters');
    it('should be true if req.user does not match username passed in parameters')
  });

  describe('#getUserProfile()', function() {
    it('should render the user view with profile information')
  })

})