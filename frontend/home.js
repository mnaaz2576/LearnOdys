// SEARCH
function searchCourse(){
    const q=document.getElementById("searchInput").value;
    window.location.href="courses.html?search="+q;
}

function quickSearch(skill){
    window.location.href="courses.html?search="+skill;
}

// DROPDOWN
function toggleMenu(){
    const menu = document.getElementById("menu");
    menu.style.display = (menu.style.display === "none") ? "block" : "none";
}

// LOGOUT
function logout(){
    localStorage.clear();
    window.location.href = "index.html";
}

// COURSE DATABASE
const courseDatabase = {
    "python": [
        { title: "Python for Beginners", level: "Beginner" },
        { title: "Advanced Python Programming", level: "Advanced" },
        { title: "Python Data Science", level: "Intermediate" },
        { title: "Web Development with Python", level: "Intermediate" }
    ],
    "java": [
        { title: "Java for Beginners", level: "Beginner" },
        { title: "Core Java Programming", level: "Intermediate" },
        { title: "Advanced Java Development", level: "Advanced" },
        { title: "Java Spring Boot Masterclass", level: "Advanced" }
    ],
    "javascript": [
        { title: "JavaScript Fundamentals", level: "Beginner" },
        { title: "React Complete Guide", level: "Intermediate" },
        { title: "Node.js Backend Development", level: "Intermediate" },
        { title: "Full Stack JavaScript", level: "Advanced" }
    ],
    "data science": [
        { title: "Data Science Bootcamp", level: "Intermediate" },
        { title: "Machine Learning Basics", level: "Intermediate" },
        { title: "Deep Learning Advanced", level: "Advanced" },
        { title: "Data Visualization Mastery", level: "Intermediate" }
    ],
    "react": [
        { title: "React Complete Guide", level: "Intermediate" },
        { title: "Advanced React Patterns", level: "Advanced" },
        { title: "React with TypeScript", level: "Advanced" },
        { title: "Full Stack React", level: "Advanced" }
    ],
    "machine learning": [
        { title: "Machine Learning Basics", level: "Intermediate" },
        { title: "Deep Learning Advanced", level: "Advanced" },
        { title: "AI for Everyone", level: "Beginner" },
        { title: "NLP Fundamentals", level: "Advanced" }
    ],
    "web development": [
        { title: "Web Development Bootcamp", level: "Beginner" },
        { title: "Full Stack Development", level: "Intermediate" },
        { title: "Frontend Masterclass", level: "Intermediate" },
        { title: "Backend with Node.js", level: "Intermediate" }
    ]
};

// LOGIN CHECK
window.onload = function(){
    const user = localStorage.getItem("userEmail");
    if(user){
        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("signupBtn").style.display = "none";
        document.getElementById("profileSection").style.display = "block";
        document.getElementById("profileName").innerText = user;
    }

    // Initialize conversation state - NO automated messages
    conversationState = {
        stage: "waiting", // waiting -> greeting -> roadmap -> experience -> goals -> courses -> finalizing
        userInterest: null,
        userExperience: null,
        userGoal: null,
        roadmapSteps: [],
        currentRoadmapStep: 0,
        recommendedCourses: [],
        selectedCourse: null
    };
}

// ENHANCED AI MENTOR
async function askAI(){
    const q = document.getElementById("aiQuestion").value;

    if(q.trim() === ""){
        return;
    }

    // Add user message to chat
    addMessage("user", q);

    // Clear input
    document.getElementById("aiQuestion").value = "";

    const lowerQ = q.toLowerCase().trim();

    // STAGE 0: WAITING - Start conversation when user initiates
    if(conversationState.stage === "waiting") {
        if(["hi", "hello", "hey", "hii", "hello", "hlo", "start", "begin", "help", "mentor", "ai"].some(g => lowerQ.includes(g))) {
            addMessage("bot", "👋 Hello! I'm your AI learning mentor. What would you like to learn today? (e.g., Python, web development, data science, etc.)");
            conversationState.stage = "interest";
            return;
        } else {
            // If user types something else, assume they want to start learning conversation
            addMessage("bot", "👋 Hi there! I'm here to help you find the perfect learning path. What topic interests you? (e.g., Python, web development, data science, etc.)");
            conversationState.stage = "interest";
            return;
        }
    }

    // STAGE 1: COLLECT USER INTEREST
    if(conversationState.stage === "interest") {
        conversationState.userInterest = q;
        addMessage("bot", `Great choice! ${q} is an excellent topic to learn. Let me create a personalized learning roadmap for you.`);
        setTimeout(() => {
            provideTopicDetailsAndRoadmap(q);
        }, 800);
        return;
    }

    // STAGE 2: ROADMAP PROGRESSION
    if(conversationState.stage === "roadmap") {
        // Roadmap progression is handled by the step functions
        return;
    }

    // STAGE 3: ASSESS EXPERIENCE LEVEL
    if(conversationState.stage === "experience") {
        conversationState.userExperience = q;
        addMessage("bot", `Thanks for sharing! Now, what's your main goal with learning ${conversationState.userInterest}?`);

        setTimeout(() => {
            showGoalOptions();
        }, 600);
        return;
    }

    // STAGE 4: UNDERSTAND GOALS
    if(conversationState.stage === "goals") {
        conversationState.userGoal = q;
        addMessage("bot", "Perfect! Based on what you've told me, let me find the ideal courses for you.");

        setTimeout(() => {
            generatePersonalizedRecommendations();
        }, 1000);
        return;
    }

    // STAGE 5: COURSE SELECTION & ALTERNATIVES
    if(conversationState.stage === "courses") {
        // Handle course selection or alternative requests
        if(lowerQ.includes("alternative") || lowerQ.includes("different") || lowerQ.includes("other")) {
            addMessage("bot", "No problem! Let me suggest some alternatives that might better match your goals.");
            setTimeout(() => {
                showAlternativeCourses();
            }, 800);
            return;
        }

        // Check if user is selecting a course - improved matching logic
        let courseMatch = null;
        let bestMatchScore = 0;

        for (const course of conversationState.recommendedCourses) {
            const courseTitle = course.title.toLowerCase();
            const userInput = lowerQ;

            // Exact match gets highest score
            if (courseTitle === userInput) {
                courseMatch = course;
                bestMatchScore = 100;
                break;
            }

            // Check if user input contains the course title
            if (userInput.includes(courseTitle)) {
                const score = courseTitle.length / userInput.length * 80;
                if (score > bestMatchScore) {
                    courseMatch = course;
                    bestMatchScore = score;
                }
            }

            // Check if course title contains user input
            if (courseTitle.includes(userInput)) {
                const score = userInput.length / courseTitle.length * 60;
                if (score > bestMatchScore) {
                    courseMatch = course;
                    bestMatchScore = score;
                }
            }

            // Word-based matching for partial matches
            const userWords = userInput.split(' ');
            const courseWords = courseTitle.split(' ');
            const matchingWords = userWords.filter(word =>
                courseWords.some(courseWord => courseWord.includes(word) || word.includes(courseWord))
            );

            if (matchingWords.length > 0) {
                const score = (matchingWords.length / Math.max(userWords.length, courseWords.length)) * 40;
                if (score > bestMatchScore && score > 0.3) { // Require at least 30% word match
                    courseMatch = course;
                    bestMatchScore = score;
                }
            }
        }

        // Only proceed if we have a confident match (score > 20)
        if (courseMatch && bestMatchScore > 20) {
            selectCourseWithValidation(courseMatch);
            return;
        }

        // General conversation
        addMessage("bot", "I can help you choose the right course. Would you like me to show you alternatives or explain more about these options?");
        return;
    }

    // FALLBACK: Use AI for general questions
    addMessage("bot", "⏳");

    try{
        const res = await fetch("http://localhost:5000/api/ai/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: `You are an expert course advisor for LearnOdys. The user wants to learn: ${conversationState.userInterest || 'a new topic'}.\nExperience level: ${conversationState.userExperience || 'unknown'}.\nGoal: ${conversationState.userGoal || 'unknown'}.\nUser question: ${q}.\nRespond in a friendly, helpful way. If the user asks about a topic, include a short explanation, the main prerequisites, and 2-3 relevant course recommendations with why each one is a good fit. Keep the answer concise but useful.\nOnly recommend from the available course catalog if it matches.`,
                courseCatalog: buildCourseCatalogPrompt()
            })
        });

        const data = await res.json();
        removeLastMessage();

        if(data.answer) {
            addMessage("bot", data.answer);
        }

    }catch(err){
        removeLastMessage();
        addMessage("bot", "I'm here to help! What would you like to know about your learning journey?");
        console.log(err);
    }
}

// MESSAGE HANDLING FUNCTIONS
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatBotMessage(text) {
    const safeText = escapeHtml(text);
    const lines = safeText.split("\n");
    let html = "";
    let inList = false;

    lines.forEach(line => {
        const trimmed = line.trim();

        if (trimmed.startsWith("• ") || trimmed.startsWith("- ")) {
            if (!inList) {
                html += '<ul class="bot-list">';
                inList = true;
            }
            const item = trimmed.replace(/^[•-]\s*/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            html += `<li>${item}</li>`;
            return;
        }

        if (inList) {
            html += "</ul>";
            inList = false;
        }

        if (!trimmed) {
            html += '<div class="bot-spacer"></div>';
            return;
        }

        const formatted = trimmed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        html += `<div>${formatted}</div>`;
    });

    if (inList) {
        html += "</ul>";
    }

    return html;
}

function addMessage(sender, text) {
    const chatMessages = document.getElementById("chatMessages");
    const messageDiv = document.createElement("div");
    messageDiv.className = sender === "user" ? "user-message" : "bot-message";

    if (sender === "bot") {
        messageDiv.innerHTML = formatBotMessage(text);
    } else {
        messageDiv.innerText = text;
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeLastMessage() {
    const chatMessages = document.getElementById("chatMessages");
    if (chatMessages.lastChild) {
        chatMessages.removeChild(chatMessages.lastChild);
    }
}

// ROADMAP FUNCTIONS
function provideTopicDetailsAndRoadmap(topic) {
    const lowerTopic = topic.toLowerCase();
    const topicInfo = getTopicInformation(lowerTopic);

    addMessage("bot", `${topicInfo.description}\n\n${topicInfo.prerequisites}`);

    // Initialize roadmap steps
    conversationState.roadmapSteps = parseRoadmapSteps(topicInfo.roadmap);
    conversationState.currentRoadmapStep = 0;
    conversationState.stage = "roadmap";

    // Show first roadmap step
    setTimeout(() => {
        showRoadmapStep(0);
    }, 1000);
}

function parseRoadmapSteps(roadmapText) {
    const lines = roadmapText.split('\n');
    const steps = [];

    lines.forEach(line => {
        if (line.trim() && (line.includes('Month') || line.includes('•'))) {
            steps.push(line.replace('•', '').trim());
        }
    });

    return steps;
}

function showRoadmapStep(stepIndex) {
    const steps = conversationState.roadmapSteps;
    const chatMessages = document.getElementById("chatMessages");

    // Remove previous roadmap step if exists
    const existingRoadmap = document.querySelector(".roadmap-step-container");
    if (existingRoadmap) existingRoadmap.remove();

    const stepDiv = document.createElement("div");
    stepDiv.className = "roadmap-step-container";

    const progressPercent = ((stepIndex + 1) / steps.length) * 100;

    stepDiv.innerHTML = `
        <div class="roadmap-progress">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
            <div class="progress-text">Step ${stepIndex + 1} of ${steps.length}</div>
        </div>
        <div class="roadmap-header">
            <h3>🗺️ Your Learning Journey</h3>
            <p>Complete each step to build your skills progressively</p>
        </div>
        <div class="current-step">
            <div class="step-number active">${stepIndex + 1}</div>
            <div class="step-content active">${steps[stepIndex]}</div>
        </div>
        <div class="step-navigation">
            ${stepIndex < steps.length - 1
                ? `<button class="continue-step-btn" onclick="nextRoadmapStep()">Continue to Next Step</button>`
                : `<button class="continue-step-btn final" onclick="completeRoadmap()">Continue to Course Recommendations</button>`
            }
        </div>
    `;

    chatMessages.appendChild(stepDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function nextRoadmapStep() {
    conversationState.currentRoadmapStep++;
    showRoadmapStep(conversationState.currentRoadmapStep);
}

function completeRoadmap() {
    // Remove roadmap
    const roadmapContainer = document.querySelector(".roadmap-step-container");
    if (roadmapContainer) roadmapContainer.remove();

    addMessage("bot", "Excellent! You've completed the learning roadmap. Now, what's your current experience level with this topic?");
    showExperienceOptions();
    conversationState.stage = "experience";
}

// EXPERIENCE AND GOAL SELECTION
function showExperienceOptions() {
    const chatMessages = document.getElementById("chatMessages");
    const optionsDiv = document.createElement("div");
    optionsDiv.className = "experience-options-container";

    const options = [
        { text: "Complete Beginner - Never tried this before", value: "beginner" },
        { text: "Some Experience - Basic understanding", value: "intermediate" },
        { text: "Experienced - Have worked on projects", value: "advanced" }
    ];

    optionsDiv.innerHTML = '<div style="color: #2c3e50; font-weight: 600; margin-bottom: 10px;">Select your experience level:</div>';

    options.forEach(option => {
        const btn = document.createElement("button");
        btn.className = "experience-option-btn";
        btn.innerHTML = option.text;
        btn.onclick = function() {
            selectExperience(option.value, option.text);
        };
        optionsDiv.appendChild(btn);
    });

    chatMessages.appendChild(optionsDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function selectExperience(level, text) {
    // Remove options
    const optionsContainer = document.querySelector(".experience-options-container");
    if(optionsContainer) optionsContainer.remove();

    addMessage("user", text);
    conversationState.userExperience = level;
    conversationState.stage = "goals";

    addMessage("bot", "Got it! Now, what's your main goal with learning " + conversationState.userInterest + "?");
    setTimeout(() => {
        showGoalOptions();
    }, 600);
}

function showGoalOptions() {
    const chatMessages = document.getElementById("chatMessages");
    const optionsDiv = document.createElement("div");
    optionsDiv.className = "goal-options-container";

    const goals = [
        "Get a job in this field",
        "Build personal projects",
        "Understand the basics",
        "Advance my career",
        "Learn for fun/hobby"
    ];

    optionsDiv.innerHTML = '<div style="color: #2c3e50; font-weight: 600; margin-bottom: 10px;">What\'s your main goal?</div>';

    goals.forEach(goal => {
        const btn = document.createElement("button");
        btn.className = "goal-option-btn";
        btn.innerHTML = goal;
        btn.onclick = function() {
            selectGoal(goal);
        };
        optionsDiv.appendChild(btn);
    });

    chatMessages.appendChild(optionsDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function selectGoal(goal) {
    // Remove options
    const optionsContainer = document.querySelector(".goal-options-container");
    if(optionsContainer) optionsContainer.remove();

    addMessage("user", goal);
    conversationState.userGoal = goal;
    conversationState.stage = "courses";

    addMessage("bot", "Perfect! Based on what you've told me, let me find the ideal courses for you.");
    setTimeout(() => {
        generatePersonalizedRecommendations();
    }, 1000);
}

// COURSE RECOMMENDATIONS
function generatePersonalizedRecommendations() {
    const interest = conversationState.userInterest.toLowerCase();
    const experience = conversationState.userExperience;
    const goal = conversationState.userGoal.toLowerCase();

    let recommendedCourses = [];
    let levelMismatch = false;

    // Match courses based on the user's interest
    for (let key in courseDatabase) {
        if (interest.includes(key) || key.includes(interest) || interest.split(' ').some(word => key.includes(word))) {
            recommendedCourses = courseDatabase[key];
            break;
        }
    }

    // Broader fallback if no exact match
    if (recommendedCourses.length === 0) {
        if (interest.includes("programming") || interest.includes("coding") || interest.includes("software")) {
            recommendedCourses = courseDatabase["python"];
        } else if (interest.includes("web") || interest.includes("frontend") || interest.includes("backend")) {
            recommendedCourses = courseDatabase["web development"];
        } else if (interest.includes("data") || interest.includes("analytics") || interest.includes("analysis")) {
            recommendedCourses = courseDatabase["data science"];
        } else if (interest.includes("ai") || interest.includes("artificial") || interest.includes("intelligence")) {
            recommendedCourses = courseDatabase["machine learning"];
        } else if (interest.includes("mobile") || interest.includes("app") || interest.includes("android")) {
            recommendedCourses = courseDatabase["java"];
        } else {
            recommendedCourses = [
                ...courseDatabase["python"],
                ...courseDatabase["javascript"].slice(0, 1),
                ...courseDatabase["web development"].slice(0, 1)
            ];
        }
    }

    // Filter courses based on experience level and check for mismatches
    let filteredCourses = recommendedCourses;
    const userLevel = experience.toLowerCase();

    if (userLevel === "beginner") {
        filteredCourses = recommendedCourses.filter(course =>
            course.level.toLowerCase() === "beginner" || course.level.toLowerCase() === "intermediate"
        );
        if (filteredCourses.length === 0) {
            filteredCourses = recommendedCourses.slice(0, 2);
            levelMismatch = true;
        }
    } else if (userLevel === "intermediate") {
        filteredCourses = recommendedCourses.filter(course =>
            course.level.toLowerCase() === "intermediate" || course.level.toLowerCase() === "advanced"
        );
        if (filteredCourses.length === 0) {
            filteredCourses = recommendedCourses.slice(0, 2);
            levelMismatch = true;
        }
    } else if (userLevel === "advanced") {
        filteredCourses = recommendedCourses.filter(course =>
            course.level.toLowerCase() === "advanced"
        );
        if (filteredCourses.length === 0) {
            filteredCourses = recommendedCourses.slice(0, 2);
            levelMismatch = true;
        }
    }

    // Always show at least 2-3 courses
    if (filteredCourses.length === 0) {
        filteredCourses = recommendedCourses.slice(0, 3);
    }

    conversationState.recommendedCourses = filteredCourses;

    const personalizedPlan = buildPersonalizedPathNote(conversationState.userInterest, experience, goal, filteredCourses);
    addMessage("bot", personalizedPlan);

    // Show course recommendations with alternatives option
    addMessage("bot", "📚 **Recommended Courses for You:**");
    addCourseCardsWithAlternatives(conversationState.recommendedCourses, levelMismatch);
}

function buildPersonalizedPathNote(topic, experience, goal, courses) {
    const topCourse = courses[0]?.title || `a ${topic} course`;
    const stageMap = {
        beginner: `Start with fundamentals in ${topic}, build confidence with short exercises, and focus on consistency over speed.`,
        intermediate: `Strengthen core concepts in ${topic}, build practical projects, and start connecting concepts to real-world use cases.`,
        advanced: `Go deeper into production-level ${topic} skills, optimize your workflow, and build portfolio-quality work.`
    };

    let goalLine = `Choose one strong course and follow it step by step.`;
    if (goal.includes("job")) goalLine = `Prioritize portfolio work, interview-style practice, and one polished capstone project.`;
    else if (goal.includes("project")) goalLine = `Focus on shipping mini-projects quickly so your learning turns into visible outcomes.`;
    else if (goal.includes("career")) goalLine = `Aim for practical depth, industry tools, and measurable career-ready skills.`;
    else if (goal.includes("fun")) goalLine = `Keep the journey lightweight, enjoyable, and hands-on with small wins each week.`;

    return `✨ **Personalized roadmap for ${topic}**\n• **Current level:** ${experience.charAt(0).toUpperCase() + experience.slice(1)}\n• **Best focus now:** ${stageMap[experience] || stageMap.beginner}\n• **Recommended next move:** Start with **${topCourse}** and build momentum from there.\n• **Goal strategy:** ${goalLine}`;
}

function getCourseReason(course) {
    const experience = conversationState.userExperience || "beginner";
    const goal = (conversationState.userGoal || "grow your skills").toLowerCase();

    if (goal.includes("job")) {
        return `${course.title} helps build practical, job-relevant skills for a ${experience} learner.`;
    }
    if (goal.includes("project")) {
        return `${course.title} is a good fit if you want to apply concepts in real projects quickly.`;
    }
    if (course.level.toLowerCase() === "beginner") {
        return `A smooth entry point with beginner-friendly coverage and steady progress.`;
    }
    if (course.level.toLowerCase() === "advanced") {
        return `A stronger challenge designed to deepen your current skill level.`;
    }

    return `Balanced course content that matches your current stage and learning goal.`;
}

function addCourseCardsWithAlternatives(courses, levelMismatch) {
    const chatMessages = document.getElementById("chatMessages");
    const cardsDiv = document.createElement("div");
    cardsDiv.className = "course-cards-container";

    courses.forEach(course => {
        const card = document.createElement("div");
        card.className = "course-card";
        card.innerHTML = `
            <div class="course-header">
                <h4>${course.title}</h4>
                <span class="level-badge level-${course.level.toLowerCase()}">${course.level}</span>
            </div>
            <div class="course-details">
                <p>${getCourseReason(course)}</p>
            </div>
            <div class="course-actions">
                <button class="select-course-btn" onclick="selectCourseWithValidation(${JSON.stringify(course).replace(/"/g, '&quot;')})">
                    Select This Course
                </button>
            </div>
        `;
        cardsDiv.appendChild(card);
    });

    // Add alternatives section
    const alternativesDiv = document.createElement("div");
    alternativesDiv.className = "alternatives-section";
    alternativesDiv.innerHTML = `
        <div class="alternatives-header">
            <p>Not quite what you're looking for?</p>
            <button class="alternatives-btn" onclick="showAlternativeCourses()">
                View Alternative Courses
            </button>
        </div>
    `;
    cardsDiv.appendChild(alternativesDiv);

    chatMessages.appendChild(cardsDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (levelMismatch) {
        setTimeout(() => {
            addMessage("bot", "⚠️ Note: Some courses may be slightly outside your current level, but they're still suitable for your learning journey. You can also explore alternatives above.");
        }, 1000);
    }
}

function showAlternativeCourses() {
    const currentCourses = conversationState.recommendedCourses;
    const interest = conversationState.userInterest.toLowerCase();
    const userLevel = conversationState.userExperience;
    let alternatives = [];

    // Remove current course cards
    const cardsContainer = document.querySelector(".course-cards-container");
    if(cardsContainer) cardsContainer.remove();

    // Find better level-matched alternatives
    for (let category in courseDatabase) {
        if (interest.includes(category) || category.includes(interest)) {
            // Filter by appropriate level
            const levelFiltered = courseDatabase[category].filter(course => {
                const courseLvl = course.level.toLowerCase();
                if (userLevel === "beginner") {
                    return courseLvl === "beginner" || courseLvl === "intermediate";
                } else if (userLevel === "intermediate") {
                    return courseLvl === "intermediate" || courseLvl === "advanced";
                } else {
                    return courseLvl === "advanced";
                }
            });
            alternatives = levelFiltered.filter(alt =>
                !currentCourses.some(curr => curr.title === alt.title)
            );
            break;
        }
    }

    if (alternatives.length === 0) {
        // Fallback to general alternatives
        alternatives = courseDatabase["python"].filter(course => {
            const courseLvl = course.level.toLowerCase();
            if (userLevel === "beginner") {
                return courseLvl === "beginner" || courseLvl === "intermediate";
            } else if (userLevel === "intermediate") {
                return courseLvl === "intermediate" || courseLvl === "advanced";
            } else {
                return courseLvl === "advanced";
            }
        }).slice(0, 3);
    }

    const altCourses = alternatives.slice(0, 3);
    conversationState.recommendedCourses = altCourses;

    addMessage("bot", `Here are some alternative courses that might better suit your ${userLevel} level and ${conversationState.userGoal} goal. These options provide different approaches or specializations:`);
    addCourseCardsWithAlternatives(conversationState.recommendedCourses, false);
}

function selectCourseWithValidation(course) {
    addMessage("user", "I want: " + course.title);

    // Remove course cards
    const cardsContainer = document.querySelector(".course-cards-container");
    if(cardsContainer) cardsContainer.remove();

    const userLevel = conversationState.userExperience;
    const courseLevel = course.level.toLowerCase();
    let levelMatch = true;
    let message = `You selected "${course.title}". `;

    // Check level compatibility
    if (userLevel === "beginner" && courseLevel === "advanced") {
        levelMatch = false;
        message += "This course is quite advanced for beginners. I recommend starting with easier courses first.";
    } else if (userLevel === "advanced" && courseLevel === "beginner") {
        levelMatch = false;
        message += "This course might be too basic for your advanced level. Consider more challenging options.";
    } else if (userLevel === "intermediate" && courseLevel === "advanced") {
        message += "This is a challenging course that will push your intermediate skills forward.";
    } else {
        message += "This course matches well with your experience level.";
    }

    addMessage("bot", message);
    conversationState.selectedCourse = course;

    if (!levelMatch) {
        // Show alternatives immediately for level mismatches
        setTimeout(() => {
            showAlternativeCourses();
        }, 1000);
    } else {
        // For good matches, show a quick alternative option then proceed
        setTimeout(() => {
            showFinalConfirmation(course);
        }, 1000);
    }
}

function showFinalConfirmation(course) {
    addMessage("bot", `Perfect! "${course.title}" will help you achieve your goal of ${conversationState.userGoal}.`);

    setTimeout(() => {
        addMessage("bot", "Taking you to the course page now...");
        setTimeout(() => {
            redirectToCourse(course.title);
        }, 1500);
    }, 800);
}

function redirectToCourse(courseName) {
    const target = courseName || conversationState.selectedCourse?.title;
    if (!target) {
        addMessage("bot", "Sorry, I couldn't find the selected course. Please try again.");
        return;
    }
    window.location.href = "courses.html?search=" + encodeURIComponent(target);
}

// TOPIC INFORMATION
function getTopicInformation(topic) {
    const topicData = {
        "python": {
            description: "🐍 Python is a versatile, beginner-friendly programming language used for web development, data science, AI, automation, and more. It's known for its clean syntax and wide range of applications.",
            prerequisites: "📋 Prerequisites: None! Python is perfect for beginners. Basic computer skills and logical thinking are helpful but not required.",
            roadmap: "🗺️ Learning Roadmap:\n• Month 1-2: Basics (variables, loops, functions)\n• Month 3-4: Data structures and algorithms\n• Month 5-6: Web development with Flask/Django\n• Month 7+: Advanced topics (data science, AI, automation)"
        },
        "javascript": {
            description: "🌐 JavaScript is the language of the web! It's used to create interactive websites, build web applications, and even server-side development with Node.js.",
            prerequisites: "📋 Prerequisites: Basic HTML and CSS knowledge is helpful but not required. Understanding how websites work is beneficial.",
            roadmap: "🗺️ Learning Roadmap:\n• Month 1-2: Fundamentals (variables, functions, DOM)\n• Month 3-4: Modern JS (ES6+, async/await, modules)\n• Month 5-6: Frontend frameworks (React/Vue/Angular)\n• Month 7+: Full-stack development with Node.js"
        },
        "web development": {
            description: "💻 Web development involves creating websites and web applications. It includes frontend (user interface) and backend (server-side) development.",
            prerequisites: "📋 Prerequisites: None required! Start with HTML, CSS, and JavaScript. Basic computer skills are helpful.",
            roadmap: "🗺️ Learning Roadmap:\n• Month 1-2: HTML, CSS, and basic JavaScript\n• Month 3-4: Responsive design and CSS frameworks\n• Month 5-6: Frontend frameworks (React/Vue)\n• Month 7+: Backend development and databases"
        },
        "data science": {
            description: "📊 Data Science combines statistics, programming, and domain expertise to extract insights from data. It involves data analysis, visualization, and machine learning.",
            prerequisites: "📋 Prerequisites: Basic math (algebra, statistics) and programming knowledge. Python is commonly used, so some programming experience helps.",
            roadmap: "🗺️ Learning Roadmap:\n• Month 1-2: Python programming and statistics\n• Month 3-4: Data manipulation (Pandas, NumPy)\n• Month 5-6: Data visualization and analysis\n• Month 7+: Machine learning and advanced modeling"
        },
        "machine learning": {
            description: "🤖 Machine Learning is a subset of AI where computers learn from data to make predictions and decisions without being explicitly programmed.",
            prerequisites: "📋 Prerequisites: Strong programming skills (Python preferred), linear algebra, calculus, and statistics. Data science basics are very helpful.",
            roadmap: "🗺️ Learning Roadmap:\n• Month 1-2: Python, math foundations, data handling\n• Month 3-4: Supervised learning algorithms\n• Month 5-6: Unsupervised learning and deep learning\n• Month 7+: Advanced topics (NLP, computer vision, deployment)"
        },
        "react": {
            description: "⚛️ React is a popular JavaScript library for building user interfaces. It's used to create dynamic, interactive web applications.",
            prerequisites: "📋 Prerequisites: Solid JavaScript fundamentals, HTML, CSS, and basic programming concepts. Understanding of modern web development is helpful.",
            roadmap: "🗺️ Learning Roadmap:\n• Month 1: JavaScript fundamentals and basics\n• Month 2: React fundamentals (components, props, state)\n• Month 3: Advanced React (hooks, context, routing)\n• Month 4+: Real projects and advanced patterns"
        },
        "java": {
            description: "☕ Java is a powerful, object-oriented programming language used for enterprise applications, Android development, and large-scale systems.",
            prerequisites: "📋 Prerequisites: Basic programming concepts. Understanding of object-oriented programming is helpful but not required.",
            roadmap: "🗺️ Learning Roadmap:\n• Month 1-2: Java fundamentals and OOP concepts\n• Month 3-4: Advanced Java features and collections\n• Month 5-6: Frameworks (Spring, Hibernate)\n• Month 7+: Enterprise development and microservices"
        }
    };

    // Find matching topic or provide default
    for(let key in topicData) {
        if(topic.includes(key)) {
            return topicData[key];
        }
    }

    // Default response for unknown topics
    const topicLabel = topic.charAt(0).toUpperCase() + topic.slice(1);
    return {
        description: `📚 ${topicLabel} is a valuable area to explore and can open up strong learning and career opportunities.`,
        prerequisites: `📋 Prerequisites: Basic computer confidence, curiosity, and willingness to practice consistently in ${topicLabel}.`,
        roadmap: `🗺️ Learning Roadmap:\n• Weeks 1-2: Understand the fundamentals and tools used in ${topicLabel}\n• Weeks 3-4: Practice the core concepts with guided exercises in ${topicLabel}\n• Weeks 5-6: Build one small hands-on project focused on ${topicLabel}\n• Weeks 7+: Create a stronger real-world project and explore advanced ${topicLabel} topics`
    };
}

// UTILITY FUNCTIONS
function buildCourseCatalogPrompt() {
    const lines = [];
    for (const category in courseDatabase) {
        const titles = courseDatabase[category].map(course => course.title).join(', ');
        lines.push(`${category}: ${titles}`);
    }
    return lines.join('; ');
}

// Handle enter key for chat
function handleChatEnter(event){
    if(event.key === "Enter"){
        askAI();
    }
}