const Review = require("../models/review");
const Course = require("../models/course");

const newReview = async (req, res, next) => {
  const {id} = req.params;
  const cg = await Course.findById(id);
  const rv = new Review(req.body.review);
  rv.author = req.user._id;
  cg.reviews.push(rv);
  await rv.save();
  await cg.save();
  req.flash("success", "Successfully Posted a new Review!");
  res.redirect(`/courses/${id}`);
};

const deleteReview = async (req, res, next) => {
  const {id, reviewId} = req.params;
  await Course.findByIdAndUpdate(id, {
    $pull: {reviews: reviewId},
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully Deleted Review!");
  res.redirect(`/courses/${id}`);
};

module.exports = {newReview, deleteReview};