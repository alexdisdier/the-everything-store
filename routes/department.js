//////////////////////
// DEPARTMENT ROUTE //
//////////////////////

const express = require('express');
const router = express.Router();
const faker = require('faker');

const Product = require("../models/product");
const Department = require("../models/department");
const Category = require("../models/category");

const ROUTE = "department";

// CREATE
// params body: title
router.post(`/${ROUTE}/create`, async (req, res) => {

  try {
    console.log('in create');
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
router.get(`/${ROUTE}`, async (req, res) => {
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
router.post(`/${ROUTE}/update`, async (req, res) => {

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
router.post(`/${ROUTE}/delete`, async (req, res) => {
  try {
    const department = await Department.findById(req.query.id);
    const oldDepartment = department.title;
    if (department) {
      const categories = await Category.find({
        department: req.query.id
      })
      // await categories.remove();
      await department.remove();
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

// FAKER ROUTE TO GENERATE DEPARTMENTS
// router.post(`/${ROUTE}/create-faker`, async (req, res) => {
//   const departmentNum = 10;
//   try {
//     for (let i = 0; i < departmentNum; i++) {
//       const department = await Department.findOne({
//         title: faker.fake("{{commerce.department}}")
//       });
//       if (department) {
//         console.log("department already exist");
//       } else {
//         const newDepartment = new Department({
//           title: faker.fake("{{commerce.department}}")
//         });
//         await newDepartment.save();
//       }
//     }
//     res.json({
//       message: `${departmentNum} departments have been created`
//     })

//   } catch (error) {
//     res.status(400).json({
//       error: error.message
//     })
//   }
// });

module.exports = router;