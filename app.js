var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;
const localLoginStrategy = require('./passport/local-login');
var config = require('./config');
var cors = require('cors')

//import routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
const authcheckController = require('./controllers/authcheckController');

var app = express(); //starting express

// Set up mongoose connection
var mongoose = require('mongoose');
// var dev_db_url = 'mongodb://localhost:27017/DietTrackApp'
var dev_db_url = 'mongodb://heroku_03vrjltb:sn3ufasirlbdvt1knje9ik6o0e@ds135810.mlab.com:35810/heroku_03vrjltb';

var mongoDB = dev_db_url;
mongoose.connect(mongoDB); //connecting mongoose to the local DB
mongoose.Promise = global.Promise; //setting mongoose promise to use the global promise constructor
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on("open", function(ref) {
  console.log("Mongoose connected to mongo server.");
});

app.use(logger('dev')); //logging express activity

//Parse Requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//For development, use this path;
// app.use(express.static(path.join(__dirname, 'public')));

// For production. use this path. Serve static files from the React app
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
}

//handle authorization
app.use(passport.initialize());
passport.use('local-login', localLoginStrategy);

//route requests
app.use('/', indexRouter);
app.use('/users', authcheckController);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
