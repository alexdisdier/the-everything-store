//////////////////
// REVIEW ROUTE //
//////////////////

const express = require('express');
const router = express.Router();

const Review = require('../models/review');
const Product = require('../models/product');
const ROUTE = "review";

// FUNCTION
const calculateRating = product => {
  // Si il n'y a pas d'avis, la note est égale à 0
  if (product.reviews.length === 0) {
    return 0;
  }

  let rating = 0;

  for (let i = 0; i < product.reviews.length; i++) {
    rating = rating + product.reviews[i].rating;
  }

  rating = rating / product.reviews.length;

  rating = Number(rating.toFixed(1)); // Attention : Retourne une variable de type String

  return rating;
};

// CREATE
// params body: id of product to review, rating, comment, username
router.post(`/${ROUTE}/create`, async (req, res) => {
  try {
    const product = await Product.findById(req.body.product).populate("reviews");

    if (product) {
      const review = new Review({
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

      const rating = calculateRating(product);
      product.averageRating = rating;
      await product.save();

      res.json({
        message: `New Review created`,
        review
      });
    } else {
      res.status(400).json({
        error: {
          message: "Review not found"
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

// UPDATE
// params query: id of the Review to update
// params body: rating, comment
router.post(`/${ROUTE}/update`, async (req, res) => {
  try {
    const review = await Review.findById(req.query.id);

    if (review) {
      review.rating = req.body.rating;
      review.comment = req.body.comment;
      await review.save();

      // Looking for the associated product
      const product = await Product.findOne({
        reviews: {
          $in: [req.query.id]
        }
      }).populate("reviews");

      // Update the average rating
      const rating = calculateRating(product);
      product.averageRating = rating;
      await product.save();

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
router.post(`/${ROUTE}/delete`, async (req, res) => {
  try {

    const review = await Review.findById(req.query.id);
    const product = await Product.findOne({
      reviews: {
        $in: [req.query.id]
      }
    }).populate("reviews");

    if (review && product) {

      for (let i = 0; i < product.reviews.length; i++) {
        if (String(product.reviews[i]._id) === req.query.id) {
          await product.reviews[i].remove();
        }
      }

      // Update the average rating
      const rating = calculateRating(product);
      product.averageRating = rating;
      await product.save();

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