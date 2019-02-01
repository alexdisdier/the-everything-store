///////////////////
// PRODUCT ROUTE //
///////////////////

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const faker = require('faker');

const Product = require('../models/product');
const Category = require('../models/category');

const ROUTE = 'product';

router.use(bodyParser.json());

// CREATE
// params body: title, description, price, category (family id of the attributed category)
router.post(`/${ROUTE}/create`, async (req, res) => {
  try {
    const existingProduct = await Product.findOne({
      title: req.body.title
    });

    if (existingProduct === null) {
      const newProduct = new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category
      });

      await newProduct.save();

      res.json({
        message: `New Product created`,
        newProduct
      });
    } else {
      res.status(400).json({
        error: {
          message: "Product already exists"
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

// READ
// List all products combined
// params query: category, title, priceMin, priceMax, sort, rating, comment, username, page
router.get(`/${ROUTE}`, async (req, res) => {
  try {
    const filters = {};

    if (req.query.categoryId) {
      filters.category = req.query.categoryId;
    }
    if (req.query.title) {
      filters.title = new RegExp(req.query.title, "i");
    }
    if (req.query.priceMin) {
      filters.price = {
        $gte: req.query.priceMin
      };
    }
    if (req.query.priceMax) {
      if (filters.price) {
        filters.price.$lte = req.query.priceMax;
      } else {
        filters.price = {
          $lte: req.query.priceMax
        };
      }
    }
    const perPage = 5;
    const page = Math.max(0, req.query.page);
    const search = Product.find(filters)
      .populate("category")
      .populate("reviews")
    if (page) {
      search.limit(perPage)
        .skip(perPage * page);
    }
    if (req.query.sort === "price-asc") {
      search.sort({
        price: 1
      });
    } else if (req.query.sort === "price-desc") {
      search.sort({
        price: -1
      });
    }

    if (req.query.sort === "rating-asc") {
      search.sort({
        averageRating: 1
      });
    } else if (req.query.sort === "rating-desc") {
      search.sort({
        averageRating: -1
      });
    }

    const products = await search;

    res.json(products);
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message
      }
    });
  }
});

// UPDATE
// params query: id of the product to update
// params body: new title, new description, new price, new category
router.post(`/${ROUTE}/update`, async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);
    const oldProduct = product.title;

    if (product) {
      product.title = req.body.title;
      product.description = req.body.description;
      product.price = req.body.price;
      product.category = req.body.category;

      await product.save();
      res.json({
        message: ` ${oldProduct} has been updated`,
        product
      });
    } else {
      res.status(400).json({
        error: {
          message: "Product not found"
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
// params query: id of the product to delete
router.post(`/${ROUTE}/delete`, async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);
    if (product) {
      await product.remove();
      res.json({
        message: `Deleted ${product.title}`
      });
    } else {
      res.status(400).json({
        message: "Product not found"
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

// Faker.js
// const productArr = [];
// for (let i = 0; i < 3; i++) {
//   productArr.push({
//     product: faker.fake("{{commerce.product}}"),
//     department: faker.fake("{{commerce.department}}"),
//     productName: faker.fake("{{commerce.productName}}"),
//     price: faker.fake("{{commerce.price}}"),
//     productAdjective: faker.fake("{{commerce.productAdjective}}"),
//     productMaterial: faker.fake("{{commerce.productMaterial}}")
//   });
// }
// console.log(productArr);