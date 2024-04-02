const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {type: String },
  paymentId: {type: String },
  amount: {type: Number },
  currency: {type: String },
  status: {type: String },
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
