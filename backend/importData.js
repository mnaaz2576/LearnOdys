const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");

// 🔹 Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/learnodys");

// 🔹 Create Schema
const courseSchema = new mongoose.Schema({
    title: String,
    platform: String,
    level: String,
    duration: String,
    rating: Number,
    url: String
});

const Course = mongoose.model("Course", courseSchema);

const results = [];

// 🔹 Read CSV file
fs.createReadStream("data/courses.csv")
    .pipe(csv())
    .on("data", (data) => {

        // 👇 VERY IMPORTANT (match your CSV columns)
   results.push({
    title: data.Title?.trim(),
    platform: data.Site?.trim(),
    level: data["Course Type"]?.trim(),
    duration: data.Duration?.trim(),
    rating: parseFloat(data.Rating) || 0,
    url: data.URL?.trim()
});

    })
    .on("end", async () => {

        try {
            await Course.insertMany(results);
            console.log("✅ Data Imported Successfully");
        } catch (err) {
            console.log("❌ Error:", err);
        }

        mongoose.connection.close();
    });