//////////////////
// REVIEW ROUTE //
//////////////////

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Review = require('../models/review');
const Product = require('../models/product');

router.use(bodyParser.json());

// CREATE
// params body: title, description, price, category (family id of the attributed category)
router.post("/review/create", async (req, res) => {
  res.json({
    message: "review create route exists"
  });
  // try {
  //   const existingReview = await Review.findOne({
  //     title: req.body.title
  //   });

  //   if (existingReview === null) {
  //     const newReview = new Review({
  //       title: req.body.title,
  //       description: req.body.description,
  //       price: req.body.price,
  //       category: req.body.category
  //     });

  //     await newReview.save();

  //     res.json({
  //       message: `New Review created`,
  //       newReview
  //     });
  //   } else {
  //     res.status(400).json({
  //       error: {
  //         message: "Review already exists"
  //       }
  //     });
  //   }
  // } catch (error) {
  //   res.status(400).json({
  //     error: {
  //       message: error.message
  //     }
  //   });
  // }
});

// READ
// List all Reviews combined
// params query: category, title, priceMin, priceMax, sort
router.get("/review", async (req, res) => {
  res.json({
    message: "review route exists"
  });
  // try {
  //   const filters = {};

  //   if (req.query.categoryId) {
  //     filters.category = req.query.categoryId;
  //   }
  //   if (req.query.title) {
  //     filters.title = new RegExp(req.query.title, "i");
  //   }
  //   if (req.query.priceMin) {
  //     filters.price = {
  //       $gte: req.query.priceMin
  //     };
  //   }
  //   if (req.query.priceMax) {
  //     if (filters.price) {
  //       filters.price.$lte = req.query.priceMax;
  //     } else {
  //       filters.price = {
  //         $lte: req.query.priceMax
  //       };
  //     }
  //   }
  //   const search = Review.find(filters).populate("category");

  //   if (req.query.sort === "price-asc") {
  //     search.sort({
  //       price: 1
  //     });
  //   } else if (req.query.sort === "price-desc") {
  //     search.sort({
  //       price: -1
  //     });
  //   }

  //   const Reviews = await search;
  //   res.json(Reviews);
  // } catch (error) {
  //   res.status(400).json({
  //     error: {
  //       message: error.message
  //     }
  //   });
  // }
});

// UPDATE
// params query: id of the Review to update
// params body: new title, new description, new price, new category
router.post("/review/update", async (req, res) => {
  res.json({
    message: "review update route exists"
  });
  // try {
  //   const review = await Review.findById(req.query.id);
  //   // const categoryLink = await Category.findOne({
  //   //   title: req.body.category
  //   // });
  //   const oldReview = review.title;
  //   if (review) {
  //     review.title = req.body.title;
  //     review.description = req.body.description;
  //     review.price = req.body.price;
  //     review.category = req.body.category;

  //     await review.save();
  //     res.json({
  //       message: ` ${oldReview} has been updated`,
  //       review
  //     });
  //   } else {
  //     res.status(400).json({
  //       error: {
  //         message: "review not found"
  //       }
  //     });
  //   }
  // } catch (error) {
  //   res.status(400).json({
  //     message: error.message
  //   });
  // }
});

// DELETE
// params query: id of the review to delete
router.post("/review/delete", async (req, res) => {
  res.json({
    message: "review delete route exists"
  });
  // try {
  //   const review = await Review.findById(req.query.id);
  //   if (review) {
  //     await review.remove();
  //     res.json({
  //       message: `Deleted ${review.title}`
  //     });
  //   } else {
  //     res.status(400).json({
  //       message: "Review not found"
  //     });
  //   }
  // } catch (error) {
  //   res.status(400).json({
  //     error: {
  //       message: error.message
  //     }
  //   });
  // }
});

module.exports = router;