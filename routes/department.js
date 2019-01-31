//////////////////////
// DEPARTMENT ROUTE //
//////////////////////

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Department = require('../models/department');

router.use(bodyParser.json());

// Create
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
        title: req.body.title
      });
    } else {
      res.status(400).json({
        error: {
          message: "Department already exists"
        }
      });
    }
  } catch (error) {
    res.json({
      error: {
        message: "An error occurred"
      }
    });
  }
});

// Read All atributs
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

// Update
// params query: id of the department to find
// parmas body: new title
router.post("/department/update", async (req, res) => {
  const id = req.query.id;
  const newTitle = req.body.title;
  try {
    const department = await Department.findById(id);
    const oldTitle = department.title;
    if (department) {
      department.title = newTitle;
      await department.save();
      res.json({
        message: `Department ${oldTitle}`,
        newTitle: newTitle
      });
    } else {
      res.status(400).json({
        error: {
          message: "Bad request"
        }
      });
    }
  } catch (error) {
    res.json({
      error: {
        message: "An error occurred"
      }
    });
  }
});

// Delete
// params query: id of the category to delete
router.post("/department/delete", async (req, res) => {
  try {
    const department = await Department.findById(req.query.id);
    if (department) {
      await department.remove();
      res.json({
        message: `Deleted ${department.title}, all its categories and products`
      });
    } else {
      res.status(400).json({
        message: "Department not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      error: {
        message: "An error occurred"
      }
    });
  }
});

module.exports = router;