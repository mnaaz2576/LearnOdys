const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({

title: String,
platform: String,
level: String,
duration: String,
rating: Number,
url: String,
image: String

});

module.exports = mongoose.model("Course", CourseSchema);