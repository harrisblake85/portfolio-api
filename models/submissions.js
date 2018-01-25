const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema({
  title   : String,
  img     : String,
  desc    : String,
  likes   : {type:Number, default:0}

}, {timestamps:true});

//
// ,user    : {type: mongoose.Schema.Types.ObjectID, ref:'User'}
module.exports = mongoose.model('Submission', submissionSchema);
