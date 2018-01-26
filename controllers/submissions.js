const express    = require('express');
const router     = express.Router();
const pagination = require ('mongoose-pagination')
const Submission = require('../models/submission.js');
const User       = require('../models/user.js');

router.post("/", async (req,res) => {
  const submission = await Submission.create(req.body);
  res.status(201).json(submission)
});

router.get("/best", async (req,res) => {
  const submission = await Submission.findOne({},{},{sort:{likes:-1},limit:1});
  res.status(200).json(submission)
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

router.get("/like/:id", async (req,res) => {
  console.log("Req.User: ",req.user);
  if (req.user) {
    try {
      const user       = await User.findById(req.user.id);
      const submission = await Submission.findById(req.params.id);

      submission.likes = submission.likes+1 || 0;
      submission.likers.push(user.id);
      await user.liked.push(submission);
      console.log(user);
      try {
        await user.save();
        await submission.save();
        res.status(200).json({submission,user});
      } catch (e) {
        res.status(418).json({message:"User Already Liked This Submission!"});
      }
    } catch (e) {
      res.status(404).json({message:"Unable To Find User Or Submission"});
    }


  }
  else{
    res.status(401).json({message:"You have to login to like a submission!"})
  }

});

router.get("/", async (req,res) => {
  Submission.find()
  .paginate(1, 1)
  .exec(function(err, docs) {
    console.log('docs: ', docs)
    res.status(200).json({submissions:docs})
  });

});
// "http://localhost:3010/submissions/page/1/likes/-1"
router.get("/page/:num/:sort/:asc", async (req,res) => {
  // console.log(req);
  console.log(req.params);
  Submission.find({},{},{sort:{[req.params.sort]:parseInt(req.params.asc)}})
  .paginate(parseInt(req.params.num), 10)
  .exec(function(err, docs) {
    console.log('docs: ', docs)
    res.status(200).json({submissions:docs})
  });

});




//
module.exports = router;
