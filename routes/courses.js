const express = require("express");
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const multer = require('multer');
const {storage} = require('../config/cloudinary')
const upload = multer({storage});
const {isLoggedIn, validateCourse, isAuthor} = require('../middleware');
const {
  index,
  newCourse,
  newCourseForm,
  editCourseForm,
  showCourse,
  editCourse,
  deleteCourse
} = require('../controllers/courses');

router.route('/')
  .get(catchAsync(index))
  .post(
    isLoggedIn,
    upload.array('course[image]'),
    validateCourse,
    catchAsync(newCourse)
  );


router.get(
  "/new",
  isLoggedIn,
  newCourseForm
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(editCourseForm)
);

router.route('/:id')
  .get(catchAsync(showCourse))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array('course[image]'),
    validateCourse,
    catchAsync(editCourse)
  )
  .delete(
    isLoggedIn,
    isAuthor,
    catchAsync(deleteCourse)
  );


module.exports = router;
