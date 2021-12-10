const {func} = require("joi");
const mongoose = require("mongoose");
const {Schema} = mongoose;
const Review = require("./review");
const User = require('./user')

const imageSchema = new Schema({
  url: String,
  filename: String
});

imageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200')
});

const opts = {toJSON: {virtuals: true} };

const CourseSchema = new Schema({
  title: String,
  images: [imageSchema],
  price: Number,
  description: String,
  instructor: String,
  url:String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
},opts);

CourseSchema.virtual('properties.popupMarkup').get(function () {
  return `<strong><a href="/courses/${this._id}">${this.title}</a></strong>`
});

CourseSchema.post("findOneAndDelete", async function (course) {
  if (course) {
    await Review.remove({
      _id: {$in: course.reviews},
    });
  }
});

module.exports = mongoose.model("Course", CourseSchema);
