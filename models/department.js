//////////////////////
// DEPARTMENT MODEL //
//////////////////////

const mongoose = require("mongoose");

const Department = mongoose.model("Department", {
  title: String
});

module.exports = Department;