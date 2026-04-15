const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    selectedCourses: { type: Array, default: [] },
    interestedCourses: { type: Array, default: [] }
});

const User = mongoose.model("User", userSchema);

module.exports = User;