const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config({
  path: "variables.env"
});

const {
  DATABASE_NAME
} = process.env;

app.use(bodyParser.json());

/////////////////////////
// DATABASE CONNECTION //
/////////////////////////

// BACKUP AND RESTORE SOURCE:
// https://www.digitalocean.com/community/tutorials/how-to-create-and-use-mongodb-backups-on-ubuntu-14-04
// the everything store
// We either connect through Heroku or localhost
mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost/${DATABASE_NAME}`, {
  useNewUrlParser: true
});

////////////////////////
// MODEL DECLARATION //
////////////////////////
// Initialize the collections
// Mongoose will take into account these collections
require("./models/product");
require("./models/department");
require("./models/category");
require("./models/review");

////////////////////////
// ROUTES DECLARATION //
////////////////////////

// HOMEPAGE
app.get('/', (req, res) => {
  res.send(`
    LINKS to other routes:
    1. View Departments: /department
    2. View Category: /category
    3. View Product: /product
  `)
});

const departmentRoutes = require("./routes/department");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const reviewRoutes = require("./routes/review");

// Activate the routes
app.use(departmentRoutes);
app.use(categoryRoutes);
app.use(productRoutes);
app.use(reviewRoutes);


/////////////////////
// STARTING SERVER //
/////////////////////

// Manage pages not found
app.all("*", function (req, res) {
  res.status(400).send("Page not found");
});

// Choosing the ports to listen depending if we are in production using Heroku or in Development mode
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});