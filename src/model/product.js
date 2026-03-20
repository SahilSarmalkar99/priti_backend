const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  stock: {
    type: Number,
    default: 0,
  },
  minStock: {
    type: Number,
    default: 5,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
  },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);