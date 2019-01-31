////////////////////
// CATEGORY ROUTE //
////////////////////

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Category = require('../models/category');

router.use(bodyParser.json());

// CREATE
// params body: title, description, department (family id of the attributed category)
router.post("/category/create", async (req, res) => {
  try {
    const existingCat = await Category.findOne({
      title: req.body.title
    });
    if (existingCat === null) {
      const newCat = new Category({
        title: req.body.title,
        description: req.body.description,
        department: req.body.departmentId
      });
      await newCat.save();
      res.json({
        message: `Category added in ${req.body.departmentId}`,
        title: req.body.title,
        description: req.body.description
      });
    } else {
      res.status(400).json({
        message: "Category already exists"
      });
    }
  } catch (error) {
    res.json({
      error: {
        // message: "An error occurred"
        message: error.message
      }
    });
  }
});

// READ
router.get("/category", async (req, res) => {
  try {
    const categories = await Category.find().populate("department");
    res.json(categories);
  } catch (error) {
    res.status(400).json({
      message: "An error occurred"
    });
  }
});

// UPDATE
// params query: id of the category to find
// params body: new title, new description, department (family id of the attributed category)
router.post("/category/update", async (req, res) => {
  try {
    const category = await Category.findById(req.query.id);
    const departmentLink = await Department.findOne({
      title: req.body.department
    });
    const oldCat = category.title;
    if (category !== null) {
      category.title = req.body.title;
      category.description = req.body.description;
      category.department = departmentLink;
      await category.save();
      res.json({
        message: `Category ${oldCat} has been modified`,
        title: req.body.title,
        description: req.body.description,
        department: req.body.department
      });
    } else {
      res.status(400).json({
        error: {
          message: "Bad request"
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// DELETE
// params query: id of the category to delete
router.post("/category/delete", async (req, res) => {
  try {
    const category = await Category.findById(req.query.id);
    await Category.deleteOne({
      _id: req.query.id
    });
    await Product.deleteMany({
      category: req.query.id
    });
    res.json({
      message: `Deleted ${category.title} and all its products`
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: "An error occurred"
      }
    });
  }
});

module.exports = router;