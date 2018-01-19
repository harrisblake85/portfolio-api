const express = require('express');
const router = express.Router();

const Submission = require('../models/submissions.js');

router.get("/", async (req,res) => {
  const submissions = await Submission.find();
  res.status(200).json({submissions})
});














//
module.exports = router;
