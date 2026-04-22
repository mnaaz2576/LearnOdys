const Groq = require("groq-sdk");
require("dotenv").config();

async function testGroq() {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    try {
        console.log("🔍 Testing Groq connection...");
        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: "Say hi" }]
        });
        console.log("✅ Groq Success:", completion.choices[0].message.content);
    } catch (err) {
        console.error("❌ Groq Connection Error Detail:");
        console.error(err);
    }
}

testGroq();
