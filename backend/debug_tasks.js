const mongoose = require("mongoose");
const { runDailyTasks } = require("./services/cronService");
require("dotenv").config();

async function debug() {
    try {
        console.log("🛠️ Starting isolated debug of runDailyTasks...");
        await mongoose.connect("mongodb://127.0.0.1:27017/learnodys");
        console.log("✅ Connected to MongoDB");
        
        await runDailyTasks();
        
        console.log("✅ Debug execution finished without crash.");
        process.exit(0);
    } catch (err) {
        console.error("❌ CRASH DETECTED:");
        console.error(err);
        process.exit(1);
    }
}

debug();
