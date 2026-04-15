const express = require('express');
const router = express.Router();
const { callGemini } = require('/services/geminiService');

router.post('/ask', async (req, res) => {
    const { prompt } = req.body;
    try {
        const answer = await callGemini(prompt);
        res.json({ answer });
    } catch (err) {
        res.status(500).json({ error: "Gemini request failed" });
    }
});

module.exports = router;