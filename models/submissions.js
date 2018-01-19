const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema({
  title   : String,
  img     : String,
  desc    : String,
  likes   : String


});

// user    : {type: mongoose.Schema.Types.ObjectID, ref:'User'},

module.exports = mongoose.model('Submission', submissionSchema);
