const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");   // added bcrypt

const User = require("./models/user");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/learnodys")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));


// ✅ Signup route with email check
app.post("/signup", async (req, res) => {

    const { name, email, password } = req.body;

    try {

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({ message: "User already exists" });
        }

        // 🔐 HASH PASSWORD BEFORE SAVING
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

//login route
app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.json({ message: "User not found" });
    }

    // 🔐 COMPARE HASHED PASSWORD
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.json({ message: "Wrong password" });
    }

    res.json({ message: "Login successful" });

});

const Course = require("./models/Course");


app.get("/courses", async (req,res)=>{

try{

const search = req.query.search;

let query = {};

if(search){
query.title = { $regex: search , $options:"i" };
}

const courses = await Course.find(query);

res.json(courses);

}

catch(err){
res.status(500).json({error:"Server Error"});
}

});

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});
