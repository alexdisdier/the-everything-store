//////////////////////
// DEPARTMENT ROUTE //
//////////////////////

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Department = require('../models/department');

router.use(bodyParser.json());

// CREATE
// params body: title
router.post("/department/create", async (req, res) => {
  try {
    const existingDepartment = await Department.findOne({
      title: req.body.title
    });

    if (existingDepartment === null) {
      const newDepartment = new Department({
        title: req.body.title
      });
      await newDepartment.save();
      res.json({
        message: "Department created",
        newDepartment
      });
    } else {
      res.status(400).json({
        error: {
          message: "Department already exists or not respecting models fields"
        }
      });
    }
  } catch (error) {
    res.json({
      error: {
        message: error.message
      }
    });
  }
});

// READ
router.get("/department", async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message
      }
    });
  }
});

// UPDATE
// params query: id of the department to find
// parmas body: new title
router.post("/department/update", async (req, res) => {

  try {
    const department = await Department.findById(req.query.id);
    const oldTitle = department.title;

    if (department) {
      department.title = req.body.title;
      await department.save();
      res.json({
        message: `Department ${oldTitle}`,
        department
      });
    } else {
      res.status(400).json({
        error: {
          message: "Department not found"
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message
      }
    });
  }
});

// DELETE
// params query: id of the category to delete
router.post("/department/delete", async (req, res) => {
  try {
    const department = await Department.findById(req.query.id);
    const oldDepartment = department.title;
    if (department) {
      await department.remove();
      if (category) {
        const categories = await Category.find({
          department: req.query.id
        })
        await categories.remove();
      }
      res.json({
        message: `Deleted ${oldDepartment}, all its categories and products`
      });
    } else {
      res.status(400).json({
        message: "Department not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message
      }
    });
  }
});

module.exports = router;