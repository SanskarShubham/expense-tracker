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
  }
});

const Forgotpassword = mongoose.model('Forgotpassword', forgotPasswordSchema);

