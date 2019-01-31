const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config({
  path: 'variables.env'
})

const app = express();
app.use(bodyParser.json());

const {
  DATABASE_NAME
} = process.env;

// ------------------- //
// DATABASE CONNECTION //
// ------------------- //
// BACKUP AND RESTORE SOURCE: 
// https://www.digitalocean.com/community/tutorials/how-to-create-and-use-mongodb-backups-on-ubuntu-14-04
// the everything-store
mongoose.connect(
  `mongodb://localhost/${DATABASE_NAME}`, {
    useNewUrlParser: true
  }
);

// ------------------ //
// MODELS DECLARATION //
// -------------------//

// Department Model
const Department = mongoose.model("Department", {
  title: String
})

// Category Model
const Category = mongoose.model("Category", {
  title: String,
  description: String,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  }
})

// Product Model
const Product = mongoose.model("Product", {
  title: String,
  description: String,
  price: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
})

// ------------------- //
// ROUTES DECLARATION //
// ------------------ //

////////////////
// DEPARTMENT //
////////////////

// Create
// params body: title
app.post("/department/create", async (req, res) => {
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
      })
    } else {
      res.status(400).json({
        error: {
          message: "Department already exists"
        }
      })
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
app.get("/department", async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(400).json({
      error: {
        message: "An error occurred"
      }
    });
  }
});

// Update
// params query: id of the department to find
// parmas body: new title
app.post("/department/update", async (req, res) => {
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
      })
    } else {
      res.status(400).json({
        error: {
          message: "Bad request"
        }
      })
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
app.post('/department/delete', async (req, res) => {
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
      })
    }

  } catch (error) {
    res.status(400).json({
      error: {
        message: "An error occurred"
      }
    })
  }
})

//////////////
// CATEGORY //
//////////////

// Create
// params body: title, description, department (family id of the attributed category)
app.post("/category/create", async (req, res) => {
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
      })
    } else {
      res.status(400).json({
        message: "Category already exists"
      })
    }
  } catch (error) {
    res.json({
      error: {
        // message: "An error occurred"
        message: error.message
      }
    })
  }
});

// Read
app.get("/category", async (req, res) => {
  try {
    const categories = await Category.find().populate("department");
    res.json(categories);
  } catch (error) {
    res.status(400).json({
      message: "An error occurred"
    })
  }
});

// Update
// params query: id of the category to find
// params body: new title, new description, department (family id of the attributed category)
app.post('/category/update', async (req, res) => {
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
      })
    } else {
      res.status(400).json({
        error: {
          message: "Bad request"
        }
      })
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
});

// Delete
// params query: id of the category to delete
app.post('/category/delete', async (req, res) => {
  try {
    const category = await Category.findById(req.query.id);
    await Category.deleteOne({
      _id: req.query.id
    });
    await Product.deleteMany({
      category: req.query.id
    })
    res.json({
      message: `Deleted ${category.title} and all its products`
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: "An error occurred"
      }
    })
  }
})

//////////////
// PRODUCT //
/////////////

// Create
// params body: title, description, price, category (family id of the attributed category)
app.post('/product/create', async (req, res) => {
  try {
    const existingProduct = await Product.findOne({
      title: req.body.title
    });
    const catLink = await Category.findOne({
      title: req.body.category
    })
    if (existingProduct === null) {
      const newProduct = new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: catLink
      });
      await newProduct.save();
      res.json({
        message: `New Product created`,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price
      })
    } else {
      res.status(400).json({
        error: {
          message: "Product already exists"
        }
      })
    }

  } catch (error) {
    res.status(400).json({
      error: {
        message: "An error occurred"
      }
    })
  }
})

// Read
// List all products combined
// params query: category, title, priceMin, priceMax, sort
// http://localhost:3000/product?priceMin=100
// http://localhost:3000/product?priceMax=500&category=5c514a244d4cfe2431bb3e71
// http://localhost:3000/product?sort=price-asc&title=playstation
app.get("/product", async (req, res) => {
  try {
    const where = {};

    if (req.query.categoryId) {
      where.category = req.query.categoryId;
    }
    if (req.query.title) {
      where.title = new RegExp(req.query.title, "i"); // trouve une partie du titre sans tenir compte de la casse
    }
    if (req.query.priceMin) {
      where.price = {
        $gte: req.query.priceMin
      };
      //   where.price.$gte = req.query.priceMin; // Ne peut pas créer une propriété $gte si l'objet 'price' n'existe pas déjà
    }
    if (req.query.priceMax) {
      if (where.price) {
        where.price.$lte = req.query.priceMax;
      } else {
        where.price = {
          $lte: req.query.priceMax
        };
      }
    }
    const products = await Product.find(where).populate("category");
    res.json(products);
  } catch (error) {
    res.status(400).json({
      error: {
        message: "An error occurred"
      }
    })
  }
});

// Update
// params query: id of the product to update
// params body: new title, new description, new price, new category
app.post('/product/update', async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);
    const categoryLink = await Category.findOne({
      title: req.body.category
    });
    const oldProduct = product.title;
    if (product !== null) {
      product.title = req.body.title;
      product.description = req.body.description;
      product.price = req.body.price;
      product.category = categoryLink;
      await product.save();
      res.json({
        message: ` ${oldProduct} has been updated`,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category
      })
    } else {
      res.status(400).json({
        error: {
          message: "Bad request"
        }
      })
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
});

// Delete
// params query: id of the product to delete
app.post('/product/delete', async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);
    await Product.deleteOne({
      _id: req.query.id
    });
    res.json({
      message: `Deleted ${product.title}`
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: "An error occurred"
      }
    })
  }
})

// --------- //
// FUNCTIONS //
// --------- //

// Checks if an object is empty
const isEmpty = obj => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

// ----------------- //
// DEMARRAGE SERVEUR //
// ----------------- //

// Manage pages not found
app.all("*", function (req, res) {
  res.status(400).send("Page not found");
});

// Choosing the port to listen
app.listen(3000, () => {
  console.log("Server started");
});