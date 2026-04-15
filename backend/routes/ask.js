// backend/index.js (or your existing backend file)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import fetch from 'node-fetch'; // or native fetch in Node 18+

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Example Gemini / AI call function
async function callGemini(prompt) {
    try {
        const res = await fetch('https://api.gemini.com/v1/llm', {  // replace with actual Gemini API URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.AIzaSyDr-Fi958M5X8tuR8Xlmp8qTZYMk47QzE0}`  // your Gemini API key
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: 500
            })
        });
        const data = await res.json();
        return data.text || data.answer || "No response from Gemini";
    } catch (err) {
        console.error("Gemini API error:", err);
        return "Error calling Gemini API";
    }
}

// API route
app.post('/api/ai/ask', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ answer: "No prompt provided" });

    const answer = await callGemini(prompt);
    res.json({ answer });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));