const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const userSchema = new mongoose.Schema({

  username: {type:String, unique:true,lowercase: true, minlength:2, maxlength:16},

  password: {type:String, minlength:2},

  img     : {type:String},
  liked   : [{type: mongoose.Schema.Types.ObjectId, ref:'Submission',unique:true,sparse:true}]

}, {timestamps:true});

userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    const hashedPassword = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    this.password = hashedPassword;
  }

  next();
});

userSchema.methods.authenticate = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema)
