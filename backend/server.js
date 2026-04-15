const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const axios = require("axios"); // ✅ ADD THIS
require("dotenv").config();

const User = require("./models/user");
const Course = require("./models/Course");
const getCourses = require("./utils/scraper");

const app = express();
const PORT = process.env.PORT || 5000;

const path = require("path");

// ======================
// Middleware
// ======================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// ======================
// MongoDB Connection
// ======================
mongoose.connect("mongodb://127.0.0.1:27017/learnodys")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// ======================
// AUTH ROUTES
// ======================

// Signup
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed });

    res.json({ message: "Signup successful" });
  } catch {
    res.json({ message: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ message: "Wrong password" });

    res.json({ message: "Login successful" });
  } catch {
    res.json({ message: "Server error" });
  }
});

// ======================
// COURSES API
// ======================
app.get("/courses", async (req, res) => {
  try {
    const { search, level, duration, platform } = req.query;
    let query = {};

    if (search) query.title = { $regex: search, $options: "i" };
    if (level) query.level = level;
    if (duration) query.duration = { $regex: duration, $options: "i" };
    if (platform) query.platform = platform;

    const courses = await Course.find(query).limit(40);
    res.json(courses);
  } catch {
    res.status(500).json({ error: "Server Error" });
  }
});

// ======================
// SCRAPER API
// ======================
app.get("/api/courses", async (req, res) => {
  const skill = req.query.skill || "programming";
  const data = await getCourses(skill);
  res.json(data);
});

// ======================
// DASHBOARD COURSES API
// ======================
app.post("/dash", async (req, res) => {
  try {
    const { userEmail, ...courseData } = req.body;
    if (!userEmail || userEmail === "guest") {
      return res.json({ message: "Guest saved locally" });
    }
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.selectedCourses) user.selectedCourses = [];
    
    const exists = user.selectedCourses.find(c => c.title === courseData.title || c.name === courseData.name);
    if (!exists) {
        user.selectedCourses.push({ ...courseData });
        user.markModified('selectedCourses');
        await user.save();
    }
    res.json({ message: "Saved", course: courseData });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/dash", async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail || userEmail === "guest") return res.json([]);
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.json([]);
    res.json(user.selectedCourses || []);
  } catch {
    res.status(500).json({ error: "Server Error" });
  }
});

app.put("/dash", async (req, res) => {
  try {
    const { userEmail, courseId, title, ...updateFields } = req.body;
    if (!userEmail || userEmail === "guest") return res.json({ message: "Guest updated locally" });
    
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    const courseIndex = user.selectedCourses.findIndex(c => c.title === title || c.name === title);
    if (courseIndex > -1) {
       user.selectedCourses[courseIndex] = { ...user.selectedCourses[courseIndex], ...updateFields };
       user.markModified('selectedCourses');
       await user.save();
    }
    res.json({ message: "Updated" });
  } catch (e) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.delete("/dash", async (req, res) => {
  try {
    const { userEmail, title, courseId } = req.query;
    if (!userEmail || userEmail === "guest") return res.json({ message: "Guest deleted locally" });
    
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    user.selectedCourses = user.selectedCourses.filter(c => c.title !== title && c.name !== title);
    user.markModified('selectedCourses');
    await user.save();
    res.json({ message: "Deleted" });
} catch {
    res.status(500).json({ error: "Server Error" });
  }
});

// ======================
// INTERESTED COURSES API
// ======================
app.get("/interested", async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail || userEmail === "guest") return res.json([]);
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.json([]);
    res.json(user.interestedCourses || []);
  } catch {
    res.status(500).json({ error: "Server Error" });
  }
});

app.post("/interested", async (req, res) => {
  try {
    const { userEmail, courses } = req.body;
    if (!userEmail || userEmail === "guest") return res.json({ message: "Guest updated locally" });
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    user.interestedCourses = courses;
    user.markModified('interestedCourses');
    await user.save();
    res.json({ message: "Updated interested courses" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// ======================
// 🔥 GROQ AI FUNCTION (FIXED)
// ======================
async function askGroq(prompt, dbCourses = []) {
  try {
    let systemMessage = "You are an AI course advisor. Suggest a structured learning path in bullet points. CRITICAL RULES: You MUST strictly only recommend courses from the provided 'Available Database Courses' list below. DO NOT make up, invent, or suggest any external courses outside this list. You MUST output the EXACT literal course titles exactly as they appear in the list, so the user can easily search for them. If the list is completely empty, reply that there are no such courses found in the database.";
    
    if (dbCourses.length > 0) {
      systemMessage += "\n\nAvailable Database Courses:\n" + dbCourses.map(c => `- ${c.title} (Platform: ${c.platform}, Level: ${c.level || "Any"})`).join("\n");
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, // ✅ FIXED
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (err) {
    console.error("Groq Error:", err.response?.data || err.message);
    return "Error generating response";
  }
}

// ======================
// 🤖 AI ROUTE
// ======================
app.post("/api/ai/ask", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ answer: "Prompt required" });
    }

    // Attempt to extract meaningful keywords to query the DB
    const words = prompt.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
    const stopWords = new Set(["suggest", "course", "courses", "best", "learner", "current", "topic", "search", "want", "learn", "how", "what", "can", "you", "give", "me", "some", "the", "for", "and", "help", "with", "this", "that", "from"]);
    const keywords = words.filter(w => !stopWords.has(w));

    let dbCourses = [];
    if (keywords.length > 0) {
        dbCourses = await Course.find({
            $or: keywords.map(kw => ({ title: { $regex: kw, $options: "i" } }))
        }).limit(20);
    } 
    
    // Fallback context: fetch popular/random if none matched keywords
    if (dbCourses.length === 0) {
        dbCourses = await Course.find().limit(15);
    }

    const answer = await askGroq(prompt, dbCourses);
    res.json({ answer });

  } catch {
    res.status(500).json({ answer: "Server error" });
  }
});

// ======================
// START SERVER
// ======================
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);