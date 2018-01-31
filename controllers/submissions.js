const express    = require('express');
const router     = express.Router();
const pagination = require ('mongoose-pagination')
const Submission = require('../models/submission.js');
const User       = require('../models/user.js');
const jwt        = require('jsonwebtoken');

router.post("/", async (req,res) => {
  console.log(req.body);
  const submission = await Submission.create(req.body);
  res.status(201).json(submission)
});

router.get("/best", async (req,res) => {
  let submission
  try {
     submission = await Submission.findOne({},{},{sort:{likes:-1},limit:1});
     if (submission) {
       res.status(200).json(submission)
     }
     else {
       submission = {title:"Not Found"}
       res.status(400).json(submission)
     }

  } catch (e) {
    console.log(e);
  }

});

router.put("/:id", async (req,res) => {
  const submission = await Submission.findByIdAndUpdate(req.params.id,req.body,{new:true});
  res.status(200).json(submission)
});

router.get("/:id", async (req,res) => {
  console.log(req.params.id);
  const submission = await Submission.findOne({_id:req.params.id});
  res.status(200).json(submission)
});

router.delete("/:id", async (req,res) => {
  const submission = await Submission.findByIdAndRemove(req.params.id);
  res.status(202).json(submission)
});

router.get("/like/:id/", async (req,res) => {
  if (req.user) {
    try {
      const user       = await User.findById(req.user.id);
      const submission = await Submission.findById(req.params.id);
      submission.likes = submission.likes+1 || 0;
      await submission.likers.push(user.id);
      await user.liked.push(submission.id);

      try {

        await user.save();
        await submission.save();

        const token = jwt.sign({
          id: user.id,
          username: user.username,
          img: user.img,
          liked: user.liked
        },
        process.env.JWT_SECRET,
        { expiresIn: '14d' }
      );
        res.status(200).json({submission,user,token});
      } catch (e) {
        res.status(418).json({message:e.message});
      }
    } catch (e) {
      res.status(404).json({message:"Unable To Find User Or Submission"});
    }


  }
  else{
    res.status(401).json({message:"You have to login to like a submission!"})
  }

});
router.get("/cart/checkout", async (req,res) => {
  if (req.user) {
    try {
      const user       = await User.findById(req.user.id);
      // submission.likes = submission.likes+1 || 0;
      console.log(user.email);
      var send = require('gmail-send')({
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS,
        to:user.email,
        html:'<b>Thanks For Ordering!</b>'
      });


      send({
        subject: 'Thanks From Creatives For A Cause, Your Order',
      }, function (err, res) {
        console.log('err:', err, '; res:', res);
      });
      user.cart = [];
      try {

        await user.save();
        const token = jwt.sign({
          id: user.id,
          username: user.username,
          img: user.img,
          cart: user.cart
        },
        process.env.JWT_SECRET,
        { expiresIn: '14d' }
      );
        res.status(200).json({user,token});
      } catch (e) {
        res.status(418).json({message:e.message});
      }
    } catch (e) {
      res.status(404).json({message:"Unable To Add That Item To Your Cart"});
    }


  }
})
router.get("/cart/:id/", async (req,res) => {
  if (req.user) {
    try {
      const user       = await User.findById(req.user.id);
      const submission = await Submission.findById(req.params.id);
      // submission.likes = submission.likes+1 || 0;
      await user.cart.push(submission.id);

      try {

        await user.save();
        const token = jwt.sign({
          id: user.id,
          username: user.username,
          img: user.img,
          cart: user.cart
        },
        process.env.JWT_SECRET,
        { expiresIn: '14d' }
      );
        res.status(200).json({submission,user,token});
      } catch (e) {
        res.status(418).json({message:e.message});
      }
    } catch (e) {
      res.status(404).json({message:"Unable To Add That Item To Your Cart"});
    }


  }
  else{
    res.status(401).json({message:"You have to login to cart a submission!"})
  }

});

router.get("/", async (req,res) => {
  const submissions = await Submission.find()
    res.status(200).json(submissions);
});
// "http://localhost:3010/submissions/page/1/likes/-1"
router.get("/page/:num/:sort/:asc", async (req,res) => {
  // console.log(req);
  console.log(req.params);
  Submission.find({},{},{sort:{[req.params.sort]:parseInt(req.params.asc)}})
  .paginate(parseInt(req.params.num), 10)
  .exec(function(err, docs) {
    console.log('docs: ', docs)
    const submissions = docs;
    res.status(200).json(submissions);
  });

});




//
module.exports = router;
