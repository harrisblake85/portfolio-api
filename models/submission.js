const mongoose = require('mongoose');
const submissionSchema = mongoose.Schema({
  title   : {type:String, unique:true, required:true},
  img     : {type:String, unique:true, required:true},
  desc    : {type:String, unique:true, required:true},
  likes   : {type:Number, default:0},
  creator : {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  likers  : [{type: mongoose.Schema.Types.ObjectId, ref:'User'}]

}, {timestamps:true});
const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
}

submissionSchema.pre('save', function(next) {

  if (this.isModified('likers')) {
    let temp   = this.likers;
    this.likers = this.likers.filter(onlyUnique);
    if (this.likers.length < temp.length) {
      this.likes --;
    }
    console.log(this.likers);
  }

  next();
});

module.exports = mongoose.model('Submission', submissionSchema);
