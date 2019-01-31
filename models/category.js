////////////////////
// CATEGORY MODEL //
////////////////////

const mongoose = require("mongoose");

const Category = mongoose.model("Category", {
  title: {
    type: String,
    minLength: 5,
    maxLength: 15,
    required: true
  },
  description: {
    type: String
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  }
});

module.exports = Category;