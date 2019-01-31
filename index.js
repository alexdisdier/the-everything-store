const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config({
  path: "variables.env"
});

const app = express();
const {
  DATABASE_NAME
} = process.env;

app.use(bodyParser.json());

////////////////////////
// ROUTES DECLARATION //
////////////////////////

const departmentRoutes = require("./routes/department");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");

app.use(departmentRoutes);
app.use(categoryRoutes);
app.use(productRoutes);


/////////////////////////
// DATABASE CONNECTION //
/////////////////////////

// BACKUP AND RESTORE SOURCE:
// https://www.digitalocean.com/community/tutorials/how-to-create-and-use-mongodb-backups-on-ubuntu-14-04
// the everything store
mongoose.connect(
  `mongodb://localhost/${DATABASE_NAME}`, {
    useNewUrlParser: true
  }
);

///////////////
// FUNCTIONS //
///////////////

// Checks if an object is empty
const isEmpty = obj => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

/////////////////////
// STARTING SERVER //
/////////////////////

// Manage pages not found
app.all("*", function (req, res) {
  res.status(400).send("Page not found");
});

// Choosing the port to listen
app.listen(3000, () => {
  console.log("Server started");
});