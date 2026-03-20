const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
  },

  customerName: String,

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
      price: Number,
    },
  ],

  totalAmount: Number,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "auth",
  },
}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);