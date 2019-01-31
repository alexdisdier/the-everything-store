////////////////////
// CATEGORY MODEL //
////////////////////

const mongoose = require("mongoose");

const Category = mongoose.model("Category", {
  title: String,
  description: String,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  }
});

module.exports = Category;