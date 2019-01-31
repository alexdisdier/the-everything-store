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
const reviewRoutes = require("./routes/review");

app.use(departmentRoutes);
app.use(categoryRoutes);
app.use(productRoutes);
app.use(reviewRoutes);


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