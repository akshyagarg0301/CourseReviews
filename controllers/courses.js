const Course = require("../models/course");
const {cloudinary} = require('../config/cloudinary')

const index = async (req, res, next) => {
  const allCourses = await Course.find({});
  res.render("./courses/index", {allCourses});
};

const newCourse = async (req, res, next) => {
  const newCourse1 = new Course(req.body.course);
  newCourse1.images = req.files.map(f => ({url: f.path, filename: f.filename}));
  newCourse1.author = req.user._id;
  await newCourse1.save();
  console.log(newCourse1);
  req.flash("success", "Successfully Created new Course!");
  res.redirect(`/courses/${newCourse1._id}`);
};

const newCourseForm = (req, res) => {
  res.render("courses/new");
};

const editCourseForm = async (req, res, next) => {
  const {id} = req.params;
  const currInfo = await Course.findById(id);
  if (!currInfo) {
    req.flash("error", "Cannot find that Course!");
    return res.redirect("/courses");
  }
  
  res.render("./courses/edit", {currInfo});
};

const showCourse = async (req, res, next) => {
  const {id} = req.params;
  const currCourse = await Course.findById(id).populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  }).populate("author");
  if (!currCourse) {
    req.flash("error", "Cannot find that Courses!");
    return res.redirect("/courses");
  }
  res.render("./courses/show", {currCourse});
};

const editCourse = async (req, res, next) => {
  const {id} = req.params;
  const cour = await Course.findByIdAndUpdate(id, {
    ...req.body.course,
  });
  if (req.body.deleteImages) {
    for (let pick of req.body.deleteImages) {
      await cloudinary.uploader.destroy(pick);
    }
    await cour.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
  }
  const pics = req.files.map(f => ({url: f.path, filename: f.filename}));
  cour.images.push(...pics);
  await cour.save();
  req.flash("success", "Successfully Updated Course!");
  res.redirect(`/courses/${cour._id}`);
};

const deleteCourse = async (req, res, next) => {
  const {id} = req.params;
  await Course.findByIdAndDelete(id);
  req.flash("success", "Successfully Deleted the Course!");
  res.redirect("/courses");
};

module.exports = {index, newCourse, newCourseForm, editCourseForm, showCourse, editCourse, deleteCourse};