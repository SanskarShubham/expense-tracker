const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },

  active: {
    type: Boolean,
    default: true
  },
  expiresby: {
    type: Date
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const ForgotPassword = mongoose.model('Forgotpassword', forgotPasswordSchema);

module.exports = ForgotPassword;

