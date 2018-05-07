var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;
var config = require('./config');
var cors = require('cors')
// var session = require('express-session');
// const MongoStore = require('connect-mongo')(session);

// var flash = require('connect-flash');
// var { check, validationResult } = require('express-validator/check');
// var { matchedData, sanitize } = require('express-validator/filter');


// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
var adminRouter = require('./routes/admin');
const authcheckController = require('./controllers/authcheckController');


var app = express(); //starting express

// Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = 'mongodb://localhost:27017/DietTrackApp'
// var jwtSecret = "secret"
var mongoDB = dev_db_url;
mongoose.connect(mongoDB
  // , {useMongoClient: true}
); //connecting mongoose to the local DB
mongoose.Promise = global.Promise; //setting mongoose promise to use the global promise constructor
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on("open", function(ref) {
  console.log("Mongoose connected to mongo server.");
});


// // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev')); //logging express activity
// app.use(express.json()); //parses into json
// app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public'))); //setting the directory (public)
//to serve static files from.

//TODO: figure out how to encrypt cookies for security
// app.use(session({
//   secret: 'secret',
//   saveUninitialized: false,
//   resave: true,
//   // cookie: {secure: false},
//   // store: new MongoStore({ mongooseConnection: db })
// }));

app.use(passport.initialize());
// app.use(passport.session());

// load passport strategies
// const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./passport/local-login');
// passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authenticaion checker middleware
app.use(function(req, res, next) {
  // console.log('req.session.user//app.js'. req.session.user);
  // console.log("req.session.passport.user//app.js", req.session.passport.user)
  // res.append('Access-Control-Allow-Origin', ['*']);
  // res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  // res.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.locals.user= req.user || null;
  next();
});

app.use(function(req, res, next) {
  console.log("req.user//app.js", req.user);
  // console.log("req.isAuthenticated//app.js", req.isAuthenticated());
  // console.log("req.cookies//app.js", req.cookies);
  // console.log("req.session//app.js", req.session);
  next();
});


// app.use('/users', function(req, res, next) {
//   console.log("first");
//   next()
// });
app.use('/users', authcheckController);

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
