const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  totalExpense: {
    type: Number,
    default: 0,
  },
});

userSchema.methods.updateTotalExpense = function (amount) {
   this.totalExpense = this.totalExpense + amount;
   return this.save();
}

const User = mongoose.model('User', userSchema);

module.exports = User;
