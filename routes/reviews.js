const express = require("express");
const router = express.Router({mergeParams: true});

const expressError = require("../utils/expressErrors");
const catchAsync = require("../utils/catchAsync");
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const {newReview, deleteReview} = require('../controllers/reviews');

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(newReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(deleteReview)
);

module.exports = router;
