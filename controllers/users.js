const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user.js');
const Submission = require('../models/submission.js');

// get user index
router.get('/', async (req, res,) => {
  try {
    const users = await User.find()
    res.status(200).json(users);
  }catch (e) {
    res.status(400).send({message: e.message });
  }
  // end get
});

router.get('/current', async (req, res,) => {
  console.log(req.user);
  try {
    const user = await User.findById(req.user.id)
    res.status(200).json(user);
  }catch (e) {
    res.status(400).send({message: e.message });
  }
  // end get
});

// login an authenticated user, create a token
router.post('/login', async (req, res) => {
  console.log('req.body: ', req.body)
    try {
      const user = await User.findOne({ username: req.body.username });
      if ( user.authenticate(req.body.password)) {
        const token = jwt.sign({
          id: user.id,
          username: user.username,
          img: user.img,
          liked: user.liked
        },
        process.env.JWT_SECRET,
        { expiresIn: '14d' }
      );

      console.log(user);
      res.status(200).json({user, token});
    }

  else {
    console.log('Didnt Enter Username / Password!');
    res.status(400).json({message: 'Didnt Enter Username / Password!' });
  }
    } catch (e) {
      res.status(418).json({message: 'That user doesnt exist'})
    }

// end login
});
const getToken = (user) => {

}
// create user and jwt token
router.post('/', async (req, res) => {
  console.log('request from client: ', req.body);
  try {
    const user = await User.create(req.body);
    console.log("User:"+user);
    const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      img: user.img,
      liked: []

    },
    process.env.JWT_SECRET,
    { expiresIn: '14d' }
  )
  res.status(201).json({user, token})

  } catch (e) {
    res.status(400).send({message: e.errmsg });
  }



  // end post
});

module.exports = router;
