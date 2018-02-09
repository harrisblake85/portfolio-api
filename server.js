const express  = require('express');
const app      = express();
const morgan   = require('morgan');
const cors     = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();
const PORT     = process.env.PORT||3010;

const db = mongoose.connection;
require('pretty-error').start();

// middleware
app.use(cors());
app.use(express.urlencoded({
  extended:false
}));
app.use(express.json());
app.use(morgan('tiny'));
// end middleware



app.get('/', async (req,res) => {
  console.log(process.env.GMAIL_EMAIL);
  console.log(process.env.GMAIL_PASS);
  //
  res.send({message:"Hello Welcome To Creatives For A Cause API!"})
});

app.post("/email", async (req,res) => {
  const name = req.body.name;
  const email = req.body.email;
  const number = req.body.number;
  const message = req.body.message;
  const html = "<b>"+" name: "+name+" email: "+email+" number: "+number+" message:"+message+"</b>";
  var send = require('gmail-send')({
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS,
    to: 'harrisblake85@gmail.com',
    html:html
  });


  send({
    subject: 'Someone Messaged Me From My Site',
  }, function (err, res) {
    console.log('err:', err, '; res:', res);
  });

  res.send({message:"Ur Good",html})
});

app.listen(PORT, () => {
  console.log("Portfolio Listening on PORT: ", PORT);
});














//
