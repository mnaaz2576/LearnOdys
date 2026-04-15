
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export async function askGemini(prompt) {
    try {
        const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', { // replace with actual Gemini URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.AIzaSyDr-Fi958M5X8tuR8Xlmp8qTZYMk47QzE0}`
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