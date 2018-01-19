const express  = require('express');
const app      = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URI ||"mongodb://localhost/cfac"
const PORT     = process.env.PORT||3000;

const db = mongoose.connection;
require('pretty-error').start();

// mongoose promise library
mongoose.Promise = global.Promise;

mongoose.connect(mongoURI,{
  useMongoClient:true
});

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', mongoURI));
db.on('disconnected', () => console.log('mongo disconnected'));

db.on('open',() => {

});
// middleware
app.use(express.urlencoded({
  extended:false
}));
app.use(express.json());
app.use(morgan('tiny'));
// end middleware

//Routes
const submissionsController = require('./controllers/submissions.js');

// const usersController = require('./controllers/users.js');
// const sessionsController = require('./controllers/sessions.js');
// enable sessions

// app.use(session({
//   secret: "homestarrunner.net... it's dot com!",
//   resave: true,
//   saveUninitialized: false,
//   maxAge: 2592000000
// }));

// enable controllers

// app.use('/users', usersController);
// app.use('/sessions', sessionsController);

app.use('/submissions', submissionsController);

app.listen(PORT, () => {
  console.log("CFAC Listening on PORT: ", PORT);
});












//
app.listen(PORT,() => {
  console.log("CFAC_API Listening On PORT: "+PORT);
});
