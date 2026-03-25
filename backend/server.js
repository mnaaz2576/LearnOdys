const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const User = require("./models/user");
const Course = require("./models/Course");
const getCourses = require("./utils/scraper");

const app = express();

app.use(cors());
app.use(express.json());


// ✅ MongoDB connection (UPDATED CLEAN)
mongoose.connect("mongodb://127.0.0.1:27017/learnodys")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));


// ======================
// ✅ SIGNUP
// ======================
app.post("/signup", async (req, res) => {

    const { name, email, password } = req.body;

    try {

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.json({ message: "Signup successful" });

    } catch (error) {

        console.log(error);
        res.json({ message: "Server error" });

    }

});


// ======================
// ✅ LOGIN
// ======================
app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ message: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.json({ message: "Wrong password" });
        }

        res.json({ message: "Login successful" });

    } catch (error) {
        res.json({ message: "Server error" });
    }

});


// ======================
// ✅ COURSES API (SEARCH + FILTERS)
// ======================
app.get("/courses", async (req, res) => {

    try {

        const { search, level, duration, platform } = req.query;

        let query = {};

        // 🔍 Search
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        // 🎯 Filters
        if (level) {
            query.level = level;
        }

        if (duration) {
    query.duration = { $regex: duration, $options: "i" };
}

        if (platform) {
            query.platform = platform;
        }

        const courses = await Course.find(query);

        res.json(courses);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server Error" });
    }

});


// ======================
// 🔥 SCRAPER API
// ======================
app.get("/api/courses", async (req, res) => {

    const skill = req.query.skill || "programming";

    console.log("Fetching:", skill);

    const data = await getCourses(skill);

    res.json(data);

});



app.listen(5000, () => {
    console.log("Server running on port 5000 🚀");
});