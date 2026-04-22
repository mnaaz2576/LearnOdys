const cron = require("node-cron");
const User = require("../models/user");
const Groq = require("groq-sdk");
const { sendEmail } = require("./emailService");
require("dotenv").config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Generates a 3-question quiz for a specific course using AI
 */
async function generateQuiz(courseTitle) {
    try {
        const prompt = `Generate a short 3-question multiple choice quiz for the course: "${courseTitle}". 
        Return ONLY the quiz in clean HTML format (using <h3>, <ul>, and <li> tags). 
        Include the correct answers at the bottom in a <details> tag.`;

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
            messages: [{ role: "user", content: prompt }]
        });

        return completion.choices[0]?.message?.content || "<p>Unable to generate quiz today.</p>";
    } catch (error) {
        console.error("Error generating quiz:", error);
        return "<p>Unable to generate quiz today.</p>";
    }
}

/**
 * Main function to run daily tasks
 */
async function runDailyTasks() {
    console.log("🌞 Running daily email tasks...");
    
    try {
        const users = await User.find({});
        console.log(`Found ${users.length} users in database.`);
        
        for (const user of users) {
            if (!user.email || user.email === "guest") continue;
            console.log(`Processing user: ${user.email}`);

            const courses = user.selectedCourses || [];
            
            let emailHtml = "";
            let subject = "";

            if (courses.length > 0) {
                // Generate AI Quiz for users WITH courses
                const targetCourse = courses[0].title || courses[0].name;
                console.log(`Generating quiz for: ${targetCourse}`);
                const quizHtml = await generateQuiz(targetCourse);
                subject = `Daily Quiz: ${targetCourse}`;
                
                emailHtml = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #2563eb;">📚 Daily Knowledge Check</h2>
                        <p>Hello <strong>${user.name || "Learner"}</strong>,</p>
                        <p>It's time for your daily quiz on <strong>${targetCourse}</strong>. Keep your skills sharp!</p>
                        
                        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 20px;">
                            ${quizHtml}
                        </div>

                        <h3 style="margin-top: 30px; color: #475569;">🚀 Reminder to Finish</h3>
                        <p>You have <strong>${courses.length}</strong> active courses. Don't forget to complete them to earn your mastery!</p>
                        <ul>
                            ${courses.map(c => `<li>${c.title || c.name}</li>`).join('')}
                        </ul>

                        <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;">
                        <p style="font-size: 12px; color: #94a3b8; text-align: center;">You received this because you are a registered user of LearnOdys.</p>
                    </div>
                `;
            } else {
                // Fallback for users WITHOUT courses
                console.log(`User ${user.email} has no courses. Sending discovery email.`);
                subject = "Ready to start your learning journey?";
                emailHtml = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #2563eb;">🚀 Start Your Learning Journey!</h2>
                        <p>Hello <strong>${user.name || "Learner"}</strong>,</p>
                        <p>We noticed you haven't selected any courses yet. Our AI Mentor is ready to help you learn, but it needs a topic to quiz you on!</p>
                        
                        <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center;">
                            <p><strong>Pick a course today and get your first AI Quiz tomorrow!</strong></p>
                            <a href="http://localhost:5000/home.html" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Browse Courses</a>
                        </div>

                        <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;">
                        <p style="font-size: 12px; color: #94a3b8; text-align: center;">You received this because you are a registered user of LearnOdys.</p>
                    </div>
                `;
            }

            // Send the email
            await sendEmail(user.email, subject, emailHtml);
        }
        console.log("✅ All daily tasks completed.");
    } catch (error) {
        console.error("Error in daily tasks:", error);
    }
}

/**
 * Schedules the cron job
 */
function startCronJobs() {
    // Schedule to run every morning at 09:00 AM
    // Pattern: minute hour dayOfMonth month dayOfWeek
    cron.schedule("0 9 * * *", () => {
        runDailyTasks();
    });

    console.log("⏰ Cron job scheduled: Daily at 09:00 AM");
    
    // Optional: Run once on startup for debugging (disable in production)
    // runDailyTasks(); 
}

module.exports = { startCronJobs, runDailyTasks };
