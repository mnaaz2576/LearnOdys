const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // logged-in user
    name: { type: String, required: true },   // topic name
    progress: { type: Number, default: 0 },   // 0-100
    status: {
        type: String,
        enum: ["learning", "strong", "weak"],
        default: "learning"
    }
});

module.exports = mongoose.model("UserProgress", CourseSchema);