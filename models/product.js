///////////////////
// PRODUCT MODEL //
///////////////////

const mongoose = require("mongoose");

const Product = mongoose.model("Product", {
  title: String,
  description: String,
  price: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
});

module.exports = Product;