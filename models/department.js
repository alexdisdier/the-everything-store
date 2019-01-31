//////////////////////
// DEPARTMENT MODEL //
//////////////////////

const mongoose = require("mongoose");

const Department = mongoose.model("Department", {
  title: {
    type: String,
    minLength: 3,
    maxLength: 20,
    required: true
  }
});

module.exports = Department;