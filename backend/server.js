const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const axios = require("axios");
const Groq = require("groq-sdk"); // ✅ USING OFFICIAL SDK
require("dotenv").config();

const User = require("./models/user");
const Course = require("./models/Course");
const getCourses = require("./utils/scraper");
const { sendWelcomeEmail } = require("./services/emailService"); // ✅ ADD THIS


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

    // Send Welcome Email
    await sendWelcomeEmail(email, name || "Learner");

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
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
        user.selectedCourses.push({ ...courseData, savedAt: new Date() });
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
    
    const coursesWithTime = (courses || []).map(c => ({ ...c, savedAt: new Date() }));
    user.interestedCourses = coursesWithTime;
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
// Initialize Groq Client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function askGroq(prompt, dbCourses = []) {
  try {
    let systemMessage = "You are an expert AI Learning Mentor for LearnOdys. Respond naturally, helpfully, and accurately. \n\n" +
                        "GUIDELINES:\n" +
                        "- Always respond in the SAME language as the user's latest message.\n" +
                        "- Talk naturally first. Only provide a structured roadmap or suggest courses if the user explicitly asks for them.\n" +
                        "- If the user asks for a 'roadmap' or 'path', provide a structured step-by-step guide.\n" +
                        "- Use bold text for any course titles you mention.";
    
    // Extract the text to check for intent
    const textToCheck = Array.isArray(prompt) 
        ? prompt[prompt.length - 1].content 
        : prompt;

    const isRoadmapRequest = /roadmap|path|plan|guide/i.test(textToCheck);
    const isRecommendationRequest = /suggest|recommend|find courses|what courses|give me courses/i.test(textToCheck);

    if (dbCourses.length > 0 && (isRecommendationRequest || isRoadmapRequest)) {
      systemMessage += "\n\nAvailable Database Courses:\n" + dbCourses.map(c => `- ${c.title} (Platform: ${c.platform})`).join("\n");
    }

    const messages = [
      { role: "system", content: systemMessage },
      ...(Array.isArray(prompt) ? prompt : [{ role: "user", content: prompt }])
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.1,
      messages: messages
    });

    return completion.choices[0]?.message?.content || "No response generated";

  } catch (err) {
    console.error("Groq Error Details:", err);
    console.error("Groq Error:", err.message);
    if (err.message.includes("ENOTFOUND")) {
        return "System error: Unable to connect to the AI service (DNS Error). Please check your internet connection.";
    }
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

    // Extract the text to check for intent
    const textToCheck = prompt; // In the route, prompt is the raw user string from req.body.prompt

    const isRecommendationRequest = /suggest|recommend|find courses|what courses|give me courses|roadmap|path/i.test(textToCheck);

    let dbCourses = [];
    if (isRecommendationRequest) {
        // Only do keyword extraction and DB search if it's a recommendation request
        const words = textToCheck.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
        const stopWords = new Set(["suggest", "course", "courses", "best", "want", "learn", "how", "what", "give", "me", "some", "the", "for", "and", "help", "roadmap", "path"]);
        const keywords = words.filter(w => !stopWords.has(w));

        if (keywords.length > 0) {
            dbCourses = await Course.find({
                $or: keywords.map(kw => ({ title: { $regex: kw, $options: "i" } }))
            }).limit(30);
        }
        
        if (dbCourses.length === 0) {
            dbCourses = await Course.find().limit(10);
        }
    }

    // Build messages array with history
    const history = req.body.history || [];
    const messages = [...history, { role: "user", content: prompt }];

    const answer = await askGroq(messages, dbCourses);
    res.json({ answer });

  } catch {
    res.status(500).json({ answer: "Server error" });
  }
});

// ======================
// TEST EMAIL ROUTE
// ======================
app.get("/api/test-email", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    const { sendEmail } = require("./services/emailService");
    await sendEmail(email, "Test Email from LearnOdys", "<h1>It Works!</h1><p>Your email system is now set up correctly.</p>");
    res.json({ message: "Test email sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Trigger full daily process manually
app.get("/api/trigger-daily-tasks", async (req, res) => {
  try {
    const { runDailyTasks } = require("./services/cronService");
    await runDailyTasks();
    res.json({ message: "Daily process triggered and running in background" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================
// START SERVER
// ======================
// ======================
// CRON SERVICES (Email Reminders & Quizzes)
// ======================
const { startCronJobs } = require("./services/cronService");
startCronJobs();

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);