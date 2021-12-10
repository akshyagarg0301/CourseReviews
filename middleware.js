const Course=require('./models/course');
const Review=require('./models/review');
const {courseSchema} = require("./schema");
const { reviewSchema } = require("./schema");
const expressError = require("./utils/expressErrors");
const catchAsync= require('./utils/catchAsync');

const isLoggedIn=(req,res,next) => {
  if (!req.isAuthenticated())
  {
    req.session.returnTo=req.originalUrl;
    req.flash('error','You Must Login in!!');
    return res.redirect('/login');
  }
  next();
}

const isAuthor = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const currInfo = await Course.findById(id);
  if (!currInfo.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/courses/${id}`);
  }
  next();
});

const isReviewAuthor = catchAsync(async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/courses/${id}`);
  }
  next();
});

const validateCourse = (req, res, next) => {
  console.log(req.body);
  const {error} = courseSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new expressError(msg, 400);
  } else {
    return next();
  }
};


const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new expressError(msg, 400);
  } else {
    return next();
  }
};

module.exports={isLoggedIn,validateCourse,isAuthor,validateReview,isReviewAuthor};