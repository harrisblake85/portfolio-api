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

// get user
router.get('/:id/like/:subid', async (req, res) => {
  try {
    const user = await User.findById(req.body.id)
    res.status(200).json(user);
  }catch (e) {
    res.status(400).send({message: e.message });
  }
  // end get
});

// login an authenticated user, create a token
router.post('/login', async (req, res) => {
  console.log('req.body: ', req.body)
  if (req.body.password && req.body.username) {
      const user = await User.findOne({ username: req.body.username });
    if (user.authenticate(req.body.password)) {
      const token = jwt.sign({
        id: user.id,
        username: user.username,
        img: user.img
      },
      process.env.JWT_SECRET,
      { expiresIn: '14d' }
    )
    res.json({ status: 200, user: user, token: token });
  }
}
else {
  console.log('Didnt Enter Username / Password!');
  res.status(400).send({message: 'Didnt Enter Username / Password!' });
}

// end login
});

// create user and jwt token
router.post('/', async (req, res) => {
  console.log('request from client: ', req.body);
  try {
    const user = await User.create(req.body);
    const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      img: user.img

    },
    process.env.JWT_SECRET,
    { expiresIn: '14d' }
  )
  res.json({ status: 201, user: user, token: token })

  } catch (e) {
    res.status(400).send({message: e.message });
  }



  // end post
});

module.exports = router;
