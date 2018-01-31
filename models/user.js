const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const userSchema = new mongoose.Schema({

  username: {type:String, unique:true,lowercase: true, minlength:2, maxlength:16},

  password: {type:String, minlength:2},

  img     : {type:String, default:"https://www.w3schools.com/w3css/img_avatar3.png"},
  email   : {type:String, default:"noemail@nomail.com"},
  liked   : [{type: mongoose.Schema.Types.ObjectId, ref:'Submission'}],
  cart    : [{type: mongoose.Schema.Types.ObjectId, ref:'Submission'}]

}, {timestamps:true});

const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
}

userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    const hashedPassword = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    this.password = hashedPassword;
  }

  if (this.isModified('email')) {
    // make more emailish
  }

  if (this.isModified('liked')) {
    console.log("ayy");
    this.liked = this.liked.filter(onlyUnique)
  }

  if (this.isModified('cart')) {
    console.log("ayycart");
    this.cart = this.cart.filter(onlyUnique)
  }

  next();
});


userSchema.methods.authenticate = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema)
