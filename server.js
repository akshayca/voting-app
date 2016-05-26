var express = require('express');
var mongoose = require('mongoose');
var routes = require('./app/routes/index.js');
var fs = require('fs');
require('dotenv').load();

var app = express();

mongoose.connect(process.env.MONGO_URI);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

  fs.readdirSync(process.cwd() + '/app/models').forEach(function(filename) {
    require(process.cwd() + '/app/models/' + filename)
  });
  
  app.use('/public', express.static(process.cwd() + '/public'));  
  app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

  routes(app, db);

  app.listen(process.env.PORT, function () {
    console.log('Example app listening on port ' + process.env.PORT + '!');
  });
});