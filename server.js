var express = require('express');
var mongoose = require('mongoose');
var swig = require('swig');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./app/routes/index.js');
var fs = require('fs');
var session = require('express-session');
var morgan = require('morgan');

function pollUrl(input) { return '/polls/' + input; }
swig.setFilter('pollUrl', pollUrl);

function userUrl(input) { return '/users/' + input; }
swig.setFilter('userUrl', userUrl);

var app = express();

mongoose.connect(process.env.MONGODB_URI);

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
    app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(morgan('dev'));

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

  app.use('/', routes);

  app.listen(process.env.PORT, function () {
    console.log('VotingApp listening on port ' + process.env.PORT + '!');
  });
});