const express  = require('express');
const app      = express();
// const session  = require('express-session');
const morgan   = require('morgan');
const cors     = require('cors');
const mongoose = require('mongoose');
const jwt      = require('jsonwebtoken');

const mongoURI = process.env.MONGODB_URI ||"mongodb://localhost/cfac"
require('dotenv').config();
const PORT     = process.env.PORT||3010;

const db = mongoose.connection;
require('pretty-error').start();

// mongoose promise library
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI,{});

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', mongoURI));
db.on('disconnected', () => console.log('mongo disconnected'));

db.on('open',() => {

});

// middleware
app.use(cors());
app.use(express.urlencoded({
  extended:false
}));
app.use(express.json());
app.use(morgan('tiny'));
// end middleware

const authUser = async (req, res, next) => {
  console.log('Running auth middleware...');
  const token =  await req.headers['x-access-token']
  if (!token) {
    console.log('no auth token, no user set in req.user')
    next()
  }

  else {
    try {
      const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)
      console.log('decoded token: ', decodedToken);
      req.user = await decodedToken;
    } catch (e) {
      console.log(e);
      console.log('failed to authenticate, no user set in req.user')
    } finally {
      next()
    }


  }
}

//Routes
const submissionsController = require('./controllers/submissions.js');

const usersController = require('./controllers/users.js');
app.get('/', async (req,res) => {
  res.send({message:"Hello Welcome To Creatives For A Cause API!"})
});
app.use('/users', authUser, usersController);
// app.use('/sessions', sessionsController);

app.use('/submissions',authUser, submissionsController);

app.listen(PORT, () => {
  console.log("CFAC Listening on PORT: ", PORT);
});












//
