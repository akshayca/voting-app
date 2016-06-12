var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var swig = require('swig');
var bodyParser = require('body-parser');
var routes = require('./app/routes/index.js');
var fs = require('fs');
var session = require('express-session');
var cookieParser = require('cookie-parser');
require('dotenv').load();

var app = express();

mongoose.connect(process.env.MONGO_URI);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

  fs.readdirSync(process.cwd() + '/app/models').forEach(function(filename) {
    require(process.cwd() + '/app/models/' + filename)
  });

  app.engine('html', swig.renderFile);
  app.set('view engine', 'html');
  app.set('views', process.cwd() + '/app/views');
  app.use('/public', express.static(process.cwd() + '/public'));
  app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
  app.use(cookieParser());
  var sess = {
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {}
  }

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
  }
  app.use(session(sess))

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  app.use('/', routes);

  app.listen(process.env.PORT, function () {
    console.log('Example app listening on port ' + process.env.PORT + '!');
  });
});