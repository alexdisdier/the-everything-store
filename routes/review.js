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
// params body: id of product to review, rating, comment, username
router.post("/review/create", async (req, res) => {
  try {
    const product = await Product.findById(req.body.product).populate("reviews");

    const review = new Review({
      product: req.body.product,
      rating: req.body.rating,
      comment: req.body.comment,
      username: req.body.username
    });
    await review.save();

    if (product.reviews === undefined) {
      product.reviews = [];
    } else {
      product.reviews.push(review);
    }
    await product.save();

    let totalRating = 0;

    for (let i = 0; i < product.reviews.length; i++) {
      totalRating += product.reviews[i].rating;
    }

    if (product.averageRating && product.averageRating > 0) {
      product.averageRating = (parseFloat(totalRating) / parseFloat(product.reviews.length)).toFixed(2);
    } else {
      product.averageRating = req.body.rating;
    }

    await product.save();
    res.json({
      message: `New Review created`,
      review
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message
      }
    });
  }
});

// UPDATE
// params query: id of the Review to update
// params body: rating, comment
router.post("/review/update", async (req, res) => {
  try {
    const review = await Review.findById(req.query.id);
    if (review) {
      review.rating = req.body.rating;
      review.comment = req.body.comment;

      await review.save();
      res.json({
        message: `The review with the ID:${req.query.id} has been updated`,
        review
      });
    } else {
      res.status(400).json({
        error: {
          message: "review not found"
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
// params query: id of the review to delete
router.post("/review/delete", async (req, res) => {
  try {
    const review = await Review.findById(req.query.id);
    if (review) {
      await review.remove();
      res.json({
        message: `Deleted review with the ID:${req.query.id}`
      });
    } else {
      res.status(400).json({
        message: "Review not found"
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