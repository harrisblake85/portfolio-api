const express = require('express');
const router = express.Router();

const Submission = require('../models/submission.js');

router.post("/", async (req,res) => {
  const submission = await Submission.create(req.body);
  res.status(200).json(submission)
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
  const submission = await Submission.findById(req.params.id);
  res.status(200).json(submission)
});

router.delete("/:id", async (req,res) => {
  const submission = await Submission.findByIdAndRemove(req.params.id,req.body);
  res.status(200).json(submission)
});



router.get("/", async (req,res) => {
  const submissions = await Submission.find();
  res.status(200).json(submissions)
});











//
module.exports = router;
