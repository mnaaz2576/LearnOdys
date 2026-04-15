import React, { useState } from 'react';
import axios from 'axios';

const roadmap = () => {
    const [prompt, setPrompt] = useState('');
    const [roadmap, setRoadmap] = useState('');

    const askGemini = async (promptText) => {
        try {
            const { data } = await axios.post('/api/ai/ask', { prompt: promptText });
            setRoadmap(data.answer);
        } catch (err) {
            console.error(err);
        }
    };

    const handleGenerate = () => {
        const userProfilePrompt = `Create a personalized learning roadmap for a user with these skills: HTML, CSS, JS`;
        askGemini(userProfilePrompt);
    };

    return (
        <div>
            <h2>Learning Roadmap</h2>
            <button onClick={handleGenerate}>Generate Roadmap</button>
            {roadmap && (
                <div style={{ marginTop: '20px', whiteSpace: 'pre-line' }}>
                    {roadmap}
                </div>
            )}
        </div>
    );
};

export default roadmap;