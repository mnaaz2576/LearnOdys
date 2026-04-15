// 📚 SAMPLE COURSES DATABASE (fallback)
const sampleCourses = {
    "python": [
        { title: "Python for Beginners", platform: "Udemy", level: "Beginner", duration: "4 hours", rating: 4.8, url: "https://www.udemy.com/courses/search/?q=python%20for%20beginners" },
        { title: "Advanced Python Programming", platform: "Coursera", level: "Advanced", duration: "8 weeks", rating: 4.9, url: "https://www.coursera.org/search?query=advanced%20python%20programming" },
        { title: "Python Data Science", platform: "Udemy", level: "Intermediate", duration: "12 hours", rating: 4.7, url: "https://www.udemy.com/courses/search/?q=python%20data%20science" }
    ],
    "java": [
        { title: "Java for Beginners", platform: "Udemy", level: "Beginner", duration: "5 hours", rating: 4.8, url: "https://www.udemy.com/courses/search/?q=java%20for%20beginners" },
        { title: "Core Java Programming", platform: "Coursera", level: "Intermediate", duration: "10 weeks", rating: 4.9, url: "https://www.coursera.org/search?query=core%20java%20programming" },
        { title: "Advanced Java Development", platform: "LinkedIn Learning", level: "Advanced", duration: "15 hours", rating: 4.7, url: "https://www.linkedin.com/learning/search?keywords=advanced%20java%20development" }
    ],
    "javascript": [
        { title: "JavaScript Fundamentals", platform: "Udemy", level: "Beginner", duration: "6 hours", rating: 4.8, url: "https://www.udemy.com/courses/search/?q=javascript%20fundamentals" },
        { title: "React Complete Guide", platform: "Udemy", level: "Intermediate", duration: "50 hours", rating: 4.9, url: "https://www.udemy.com/courses/search/?q=react%20complete%20guide" },
        { title: "Node.js Backend Development", platform: "Coursera", level: "Intermediate", duration: "8 weeks", rating: 4.7, url: "https://www.coursera.org/search?query=node.js%20backend%20development" }
    ],
    "react": [
        { title: "React Complete Guide", platform: "Udemy", level: "Intermediate", duration: "50 hours", rating: 4.9, url: "https://www.udemy.com/courses/search/?q=react%20complete%20guide" },
        { title: "Advanced React Patterns", platform: "Frontend Masters", level: "Advanced", duration: "6 hours", rating: 4.9, url: "https://frontendmasters.com/courses/?q=advanced%20react%20patterns" },
        { title: "React with TypeScript", platform: "Egghead", level: "Advanced", duration: "4 hours", rating: 4.8, url: "https://egghead.io/q/react%20typescript" }
    ],
    "data science": [
        { title: "Data Science Bootcamp", platform: "Udemy", level: "Intermediate", duration: "22 hours", rating: 4.8, url: "https://www.udemy.com/courses/search/?q=data%20science%20bootcamp" },
        { title: "Machine Learning Basics", platform: "Coursera", level: "Beginner", duration: "4 weeks", rating: 4.9, url: "https://www.coursera.org/search?query=machine%20learning%20basics" },
        { title: "Data Visualization Mastery", platform: "DataCamp", level: "Intermediate", duration: "10 hours", rating: 4.7, url: "https://www.datacamp.com/search?q=data%20visualization%20mastery" }
    ],
    "machine learning": [
        { title: "Machine Learning Basics", platform: "Coursera", level: "Beginner", duration: "4 weeks", rating: 4.9, url: "https://www.coursera.org/search?query=machine%20learning%20basics" },
        { title: "Deep Learning Advanced", platform: "Udemy", level: "Advanced", duration: "20 hours", rating: 4.8, url: "https://www.udemy.com/courses/search/?q=deep%20learning%20advanced" },
        { title: "AI for Everyone", platform: "Coursera", level: "Beginner", duration: "3 weeks", rating: 4.9, url: "https://www.coursera.org/learn/ai-for-everyone" }
    ],
    "web development": [
        { title: "Web Development Bootcamp", platform: "Udemy", level: "Beginner", duration: "60 hours", rating: 4.8, url: "https://www.udemy.com/courses/search/?q=web%20development%20bootcamp" },
        { title: "Full Stack Development", platform: "Coursera", level: "Intermediate", duration: "4 months", rating: 4.9, url: "https://www.coursera.org/search?query=full%20stack%20development" },
        { title: "Frontend Masterclass", platform: "Frontend Masters", level: "Advanced", duration: "15 hours", rating: 4.8, url: "https://frontendmasters.com/courses/?q=frontend%20masterclass" }
    ]
};

async function loadCourses() {
    const params = new URLSearchParams(window.location.search);
    const search = params.get("search") || "";

    fetchCourses(search);
}

// 🔥 MAIN FUNCTION
async function fetchCourses(search = "") {
    const level = document.querySelector(".level-filter:checked")?.value || "";
    const duration = document.querySelector(".duration-filter:checked")?.value || "";
    const platform = document.querySelector(".platform-filter:checked")?.value || "";

    let url = `http://localhost:5000/courses?search=${search}`;
    if (level) url += `&level=${level}`;
    if (duration) url += `&duration=${duration}`;
    if (platform) url += `&platform=${platform}`;

    try {
        const res = await fetch(url);
        const courses = await res.json();

        // If no courses from API, use sample data
        if(!courses || courses.length === 0) {
            const sampleData = getCoursesFromSample(search);
            displayCourses(sampleData);
        } else {
            displayCourses(courses);
        }
    } catch(err) {
        console.log("Error fetching courses, using sample data:", err);
        const sampleData = getCoursesFromSample(search);
        displayCourses(sampleData);
    }
}

// Get sample courses based on search term
function getCoursesFromSample(search) {
    const searchLower = search.toLowerCase().trim();
    if (!searchLower) {
        return sampleCourses["python"];
    }

    // 1) Prefer exact course title match first
    for (const key in sampleCourses) {
        const exactCourse = sampleCourses[key].filter(course =>
            course.title.toLowerCase() === searchLower
        );
        if (exactCourse.length > 0) {
            return exactCourse;
        }
    }

    // 2) Then try strong partial title match
    for (const key in sampleCourses) {
        const matched = sampleCourses[key].filter(course => {
            const title = course.title.toLowerCase();
            return title.includes(searchLower) || searchLower.split(" ").every(word => title.includes(word));
        });
        if (matched.length > 0) {
            return matched;
        }
    }

    // 3) Finally fall back to category match
    for (const key in sampleCourses) {
        if (searchLower === key || key.includes(searchLower) || (searchLower.split(" ").length <= 2 && searchLower.includes(key))) {
            return sampleCourses[key];
        }
    }

    // Fuzzy match category and title using subsequence or tiny distance
    let bestCategory = null;
    let bestScore = Infinity;
    for (let key in sampleCourses) {
        const score = fuzzyDistance(searchLower, key);
        if (score < bestScore) {
            bestScore = score;
            bestCategory = key;
        }
    }
    if (bestCategory && bestScore <= 4) {
        return sampleCourses[bestCategory];
    }

    // Try fuzzy title match
    let bestCourses = [];
    for (let key in sampleCourses) {
        sampleCourses[key].forEach(course => {
            const score = fuzzyDistance(searchLower, course.title.toLowerCase());
            bestCourses.push({ score, course });
        });
    }
    bestCourses.sort((a, b) => a.score - b.score);
    if (bestCourses.length > 0 && bestCourses[0].score <= 5) {
        return bestCourses.slice(0, 3).map(item => item.course);
    }

    return sampleCourses["python"];
}

function fuzzyDistance(a, b) {
    if (a === b) return 0;
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
            );
        }
    }
    return dp[m][n];
}


// 🎯 DISPLAY
function displayCourses(courses) {
    const container = document.getElementById("courseContainer");
    container.innerHTML = "";

    if(!courses || courses.length === 0) {
        container.innerHTML = "<p style='text-align: center; color: #999; padding: 40px;'>No courses found. Try a different search.</p>";
        return;
    }

    courses.forEach((course, idx) => {
        const courseId = "course-" + idx;
        const resolvedUrl = (course.url || course.link || course.courseUrl || course.course_link || "").replace(/'/g, "\\'");
        const isSelectedForAdvisor = advisorSelectedCourses.some(item => (item.title || item.name).toLowerCase() === String(course.title || "").toLowerCase());
        window[courseId] = course;
        
        container.innerHTML += `
        <div class="course-card">
            <div class="course-header">
                <h3>${course.title || "Course"}</h3>
                <span class="platform-badge">${course.platform || "Online"}</span>
            </div>
            <div class="course-details">
                <span class="level-badge level-${(course.level || "").toLowerCase()}">${course.level || "N/A"}</span>
                <span class="duration">⏱️ ${course.duration || "Self-paced"}</span>
                <span class="rating">⭐ ${course.rating || "N/A"}</span>
            </div>
            <div class="course-actions">
                <button class="btn-go" onclick="openCourse('${resolvedUrl}', '${(course.title || 'Course').replace(/'/g, "\\'")}')">View Course</button>
                <button class="btn-add" onclick="addToListFromCard(event, '${courseId}')">+ Add</button>
                <button class="btn-add btn-select ${isSelectedForAdvisor ? "selected" : ""}" onclick="toggleCourseSelection('${courseId}')">${isSelectedForAdvisor ? "Interested ✓" : "Interested"}</button>
            </div>
        </div>
        `;
    });
}

function addToListFromCard(e, courseId) {
    const course = window[courseId];
    if(course) {
        addToList(e, course);
    }
}


function openCourse(url, title) {
    let cleanedUrl = (url || "").trim();

    if (!cleanedUrl || cleanedUrl === "#" || cleanedUrl === "undefined" || cleanedUrl === "null") {
        cleanedUrl = `https://www.google.com/search?q=${encodeURIComponent((title || "course") + " online course")}`;
    }

    if (!/^https?:\/\//i.test(cleanedUrl)) {
        cleanedUrl = `https://${cleanedUrl.replace(/^\/+/, "")}`;
    }

    const opened = window.open(cleanedUrl, "_blank", "noopener,noreferrer");
    if (!opened) {
        window.location.assign(cleanedUrl);
    }
}


// 🔥 FILTER CHANGE
document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", () => {

        const params = new URLSearchParams(window.location.search);
        const search = params.get("search") || "";

        fetchCourses(search);

    });
});


let myList = [];
let advisorSelectedCourses = [];
let advisorWidgetOpen = false;

async function initCoursesPage() {
    loadCourses();
    myList = loadUserCourses();

    const userEmail = localStorage.getItem("userEmail");
    if (userEmail && userEmail !== "guest") {
        try {
            const res = await fetch(`http://localhost:5000/interested?userEmail=${encodeURIComponent(userEmail)}`);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) advisorSelectedCourses = data;
            }
        } catch(e) { console.error("Error loading interested:", e); }
    }

    renderList();
    renderAdvisorState(true);
    toggleAdvisorWidget(false);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCoursesPage);
} else {
    initCoursesPage();
}

function getCourseStorageKey() {
    const userEmail = localStorage.getItem("userEmail");
    return `courses_${(userEmail || "guest").toLowerCase()}`;
}

function loadUserCourses() {
    const scopedKey = getCourseStorageKey();
    const scopedCourses = JSON.parse(localStorage.getItem(scopedKey) || "null");

    if (Array.isArray(scopedCourses) && scopedCourses.length) {
        return scopedCourses;
    }

    const legacyCourses = JSON.parse(localStorage.getItem("courses") || "[]");
    if (Array.isArray(legacyCourses) && legacyCourses.length) {
        localStorage.setItem(scopedKey, JSON.stringify(legacyCourses));
        return legacyCourses;
    }

    return Array.isArray(scopedCourses) ? scopedCourses : [];
}

function saveUserCourses() {
    localStorage.setItem(getCourseStorageKey(), JSON.stringify(myList));
    localStorage.setItem("courses", JSON.stringify(myList));
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function showToast(message, type = "info") {
    const toast = document.getElementById("appToast");
    if (!toast) return;

    toast.className = `app-toast ${type} show`;
    toast.innerHTML = escapeHtml(message);

    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => {
        toast.className = "app-toast";
        toast.innerHTML = "";
    }, 2600);
}

function toggleAdvisorWidget(forceState) {
    const widget = document.getElementById("advisorWidget");
    const fab = document.getElementById("advisorFab");
    if (!widget || !fab) return;

    advisorWidgetOpen = typeof forceState === "boolean" ? forceState : !advisorWidgetOpen;
    widget.style.display = advisorWidgetOpen ? "block" : "none";
    fab.textContent = advisorWidgetOpen ? "✖ Close AI" : "🤖 AI Help";
}

function normalizeCourseForList(course) {
    const title = course.title || course.name || "Untitled Course";
    const levelMap = {
        beginner: 25,
        intermediate: 60,
        advanced: 85
    };

    let numericLevel = typeof course.level === "number" ? course.level : parseInt(course.level, 10);
    if (Number.isNaN(numericLevel)) {
        numericLevel = levelMap[String(course.level || "").toLowerCase()] ?? 50;
    }

    const targetDays = 14;
    const dueDate = new Date(Date.now() + targetDays * 24 * 60 * 60 * 1000).toISOString();

    return {
        name: title,
        title,
        userEmail: localStorage.getItem("userEmail") || "guest",
        level: numericLevel,
        platform: course.platform || "Online",
        duration: course.duration || "Self-paced",
        rating: course.rating || "N/A",
        url: course.url || course.link || course.courseUrl || course.course_link || "",
        targetDays,
        dueDate,
        reminderEnabled: true,
        reminderFrequency: "daily",
        reminderTime: "19:00",
        lastReminderDate: "",
        lastQuizDate: ""
    };
}

async function addToList(e, course) {
    const currentUser = localStorage.getItem("userEmail");
    if (!currentUser) {
        showToast("Please log in first so the course can sync to your dashboard.", "warn");
        return;
    }

    const normalizedCourse = normalizeCourseForList(course);
    const exists = myList.some(item => (item.title || item.name).toLowerCase() === normalizedCourse.title.toLowerCase());

    if (!exists) {
        myList.push(normalizedCourse);
        saveUserCourses();
        renderList();
        renderAdvisorState(true);

        try {
            const res = await fetch("http://localhost:5000/dash", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(normalizedCourse)
            });
            const data = await res.json().catch(() => null);
            if (data?.course) {
                myList = myList.map(item =>
                    (item.title || item.name) === normalizedCourse.title ? { ...item, ...data.course } : item
                );
                saveUserCourses();
            }

            showToast(`Saved "${normalizedCourse.title}" to your dashboard.`, "success");
        } catch (err) {
            console.error("Error saving to backend:", err);
            showToast(`"${normalizedCourse.title}" was added locally. Backend sync will retry when available.`, "warn");
        }
    } else {
        showToast(`"${normalizedCourse.title}" is already in your dashboard.`, "info");
    }

    if (e?.target) {
        const originalText = e.target.innerText;
        e.target.innerText = exists ? "Saved ✓" : "Added ✓";
        setTimeout(() => {
            e.target.innerText = originalText;
        }, 1200);
    }

    showSavedListPanel();
}

function renderList() {
    const container = document.getElementById("listItems");
    if (!container) return;
    container.innerHTML = "";

    if (!myList.length) {
        container.innerHTML = `
        <div class="list-item empty">
            <div class="list-main">
                <strong>No saved courses yet</strong>
                <small>Tap + Add on any course card to build your list.</small>
            </div>
        </div>`;
        return;
    }

    myList.forEach((c, i) => {
        container.innerHTML += `
        <div class="list-item">
            <div class="list-main">
                <strong>${c.title || c.name}</strong>
                <small>${c.platform || "Online"} • Saved to your dashboard</small>
            </div>
            <button class="remove-list-btn" onclick="removeFromList(${i})">✕</button>
        </div>
        `;
    });
}

function getCourseTopicCluster(title) {
    const normalized = String(title || "").toLowerCase();
    const topicMatchers = [
        ["machine learning", ["machine learning", "deep learning", "artificial intelligence", " ai"]],
        ["data science", ["data science", "data visualization", "analytics"]],
        ["javascript", ["javascript", "js", "node.js", "nodejs"]],
        ["react", ["react", "jsx"]],
        ["python", ["python", "django", "flask"]],
        ["java", ["java", "spring"]],
        ["web development", ["web development", "frontend", "backend", "full stack"]]
    ];

    for (const [label, matchers] of topicMatchers) {
        if (matchers.some(term => normalized.includes(term))) {
            return label;
        }
    }

    return "";
}

function isBroadCoverageCourse(title) {
    const normalized = String(title || "").toLowerCase();
    return ["beginner", "beginners", "fundamentals", "basics", "complete", "guide", "bootcamp", "masterclass", "core", "introduction"].some(term => normalized.includes(term));
}

function getSignificantTitleWords(title) {
    const skipWords = new Set(["for", "with", "the", "and", "course", "complete", "guide", "bootcamp", "masterclass", "advanced", "beginner", "beginners", "intermediate", "fundamentals", "basics"]);
    return String(title || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(word => word && word.length > 2 && !skipWords.has(word));
}

function getRedundancyMessage(candidate, selectedCourses) {
    for (const course of selectedCourses) {
        const sameCluster = getCourseTopicCluster(candidate.title) && getCourseTopicCluster(candidate.title) === getCourseTopicCluster(course.title);
        const sharedWords = getSignificantTitleWords(candidate.title).filter(word => getSignificantTitleWords(course.title).includes(word));
        const similarBand = Math.abs((Number(candidate.level) || 0) - (Number(course.level) || 0)) <= 20;
        const bothBroad = isBroadCoverageCourse(candidate.title) && isBroadCoverageCourse(course.title);

        if ((sameCluster && (similarBand || bothBroad)) || sharedWords.length >= 2) {
            const focus = getCourseTopicCluster(candidate.title) || sharedWords.join(", ") || "similar";
            return `Heads up: "${candidate.title}" and "${course.title}" look like they cover overlapping ${focus} content. You may want to keep one and choose a more different course.`;
        }
    }

    return "";
}

function getPersonalizedAdvisorLines() {
    const userLabel = localStorage.getItem("userName") || (localStorage.getItem("userEmail") || "learner").split("@")[0];
    const normalizedCourses = myList.map(normalizeCourseForList).sort((a, b) => (a.level ?? 0) - (b.level ?? 0));

    if (!normalizedCourses.length) {
        return [
            `Hi ${userLabel}, select up to 2 courses for quick comparison.`,
            `I can help with roadmap steps, course choice, and overlap warnings.`
        ];
    }

    const weakest = normalizedCourses[0];
    const strongest = normalizedCourses[normalizedCourses.length - 1];

    return [
        `Hi ${userLabel}, you currently have ${normalizedCourses.length} saved course${normalizedCourses.length > 1 ? "s" : ""}.`,
        `Best next focus: ${weakest.title} (${weakest.level}% completion).`,
        `Confidence builder after that: ${strongest.title}. Ask me for a short plan anytime.`
    ];
}

function renderAdvisorState(resetOutput = false) {
    const selectedBox = document.getElementById("advisorSelectedCourses");
    const output = document.getElementById("advisorOutput");
    if (!selectedBox) return;

    if (!advisorSelectedCourses.length) {
        selectedBox.innerHTML = `<span class="selected-course-chip empty">No courses selected for AI comparison yet.</span>`;
    } else {
        selectedBox.innerHTML = advisorSelectedCourses.map(course => `
            <span class="selected-course-chip">
                ${escapeHtml(course.title || course.name)}
                <button onclick="removeSelectedCourse('${escapeHtml((course.title || course.name).replace(/'/g, "&#39;"))}')">✕</button>
            </span>
        `).join("");
    }

    if (output && (resetOutput || !output.dataset.mode)) {
        output.dataset.mode = "";
        output.innerHTML = getPersonalizedAdvisorLines().map(line => `<div class="advisor-line">${escapeHtml(line)}</div>`).join("");
    }
}

function removeSelectedCourse(title) {
    const decodedTitle = String(title || "").replace(/&#39;/g, "'");
    advisorSelectedCourses = advisorSelectedCourses.filter(course => (course.title || course.name) !== decodedTitle);
    const alertBox = document.getElementById("advisorAlert");
    if (alertBox) {
        alertBox.style.display = "none";
        alertBox.textContent = "";
    }
    
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail && userEmail !== "guest") {
        fetch("http://localhost:5000/interested", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userEmail, courses: advisorSelectedCourses })
        }).catch(err => console.error(err));
    }

    renderAdvisorState(true);
    const params = new URLSearchParams(window.location.search);
    fetchCourses(params.get("search") || "");
}

function toggleCourseSelection(courseId) {
    const course = window[courseId];
    if (!course) return;

    const normalizedCourse = normalizeCourseForList(course);
    const existingIndex = advisorSelectedCourses.findIndex(item => (item.title || item.name).toLowerCase() === normalizedCourse.title.toLowerCase());

    if (existingIndex >= 0) {
        advisorSelectedCourses.splice(existingIndex, 1);
        const alertBox = document.getElementById("advisorAlert");
        if (alertBox) {
            alertBox.style.display = "none";
            alertBox.textContent = "";
        }
    } else {
        if (advisorSelectedCourses.length >= 2) {
            advisorSelectedCourses.shift();
        }

        const redundancyMessage = getRedundancyMessage(normalizedCourse, advisorSelectedCourses);
        advisorSelectedCourses.push(normalizedCourse);

        if (redundancyMessage) {
            const alertBox = document.getElementById("advisorAlert");
            if (alertBox) {
                alertBox.style.display = "block";
                alertBox.textContent = redundancyMessage;
            }
            alert(redundancyMessage);
        }
    }

    const userEmail = localStorage.getItem("userEmail");
    if (userEmail && userEmail !== "guest") {
        fetch("http://localhost:5000/interested", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userEmail, courses: advisorSelectedCourses })
        }).catch(err => console.error(err));
    }

    renderAdvisorState(true);
    const params = new URLSearchParams(window.location.search);
    fetchCourses(params.get("search") || "");
}

async function askCourseAI(prompt) {
    const res = await fetch("http://localhost:5000/api/ai/ask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    return data.answer || "I couldn't generate a helpful answer right now.";
}

function handleAdvisorEnter(event) {
    if (event.key === "Enter") {
        askCourseAdvisor();
    }
}

function formatAdvisorResponse(text) {
    return String(text || "")
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => `<div class="advisor-line">${escapeHtml(line.replace(/^[•-]\s*/, ""))}</div>`)
        .join("");
}

function buildAdvisorContext() {
    const userLabel = localStorage.getItem("userName") || localStorage.getItem("userEmail") || "learner";
    const courses = advisorSelectedCourses.length ? advisorSelectedCourses : myList.slice(0, 5);
    if (courses.length) {
        return `Learner: ${userLabel}\nSaved/selected courses:\n${courses.map((course, index) => `${index + 1}. ${course.title} — ${course.platform || "Online"}, completion ${course.level}%`).join("\n")}`;
    }

    const params = new URLSearchParams(window.location.search);
    return `Learner: ${userLabel}\nCurrent topic search: ${params.get("search") || "general programming"}`;
}

async function askCourseAdvisor() {
    const input = document.getElementById("advisorInput");
    const output = document.getElementById("advisorOutput");
    if (!output) return;

    const userIssue = (input?.value || "").trim() || "Help me choose the best course and tell me what to do next.";
    output.dataset.mode = "custom";
    output.innerHTML = `<div class="advisor-line">Thinking through your course issue...</div>`;

    try {
        const prompt = `You are the LearnOdys course support agent. Help solve the learner's issue in a short and practical way. If selected courses overlap, say so clearly. If roadmap help is needed, give at most 4 short steps. Use plain language with short lines only.\n\nSelected course context:\n${buildAdvisorContext()}\n\nUser issue: ${userIssue}`;
        const result = await askCourseAI(prompt);
        output.innerHTML = formatAdvisorResponse(result);
    } catch (err) {
        console.error("Error asking course advisor:", err);
        output.innerHTML = `<div class="advisor-line">Try this next: start with the course that matches your current level best, finish one module, then compare again.</div>`;
    }
}

async function generateCourseRoadmap() {
    const output = document.getElementById("advisorOutput");
    if (!output) return;

    output.dataset.mode = "custom";
    output.innerHTML = `<div class="advisor-line">Creating a short roadmap from your selected courses...</div>`;

    try {
        const prompt = `Create a short course roadmap for this learner. Base it on the selected courses/context below. Return 4 short steps maximum. Keep it actionable, not overly informative.\n\nCourse context:\n${buildAdvisorContext()}`;
        const result = await askCourseAI(prompt);
        output.innerHTML = formatAdvisorResponse(result);
    } catch (err) {
        console.error("Error generating course roadmap:", err);
        output.innerHTML = `
            <div class="advisor-line"><strong>1.</strong> Start with the most beginner-friendly course first.</div>
            <div class="advisor-line"><strong>2.</strong> Finish one core module and practice it immediately.</div>
            <div class="advisor-line"><strong>3.</strong> Skip overlapping content and move to the more advanced course next.</div>
            <div class="advisor-line"><strong>4.</strong> Build one mini project to lock in your understanding.</div>
        `;
    }
}

async function removeFromList(i) {
    const removedCourse = myList[i];
    myList.splice(i, 1);
    saveUserCourses();
    renderList();
    renderAdvisorState(true);

    const userEmail = localStorage.getItem("userEmail");
    if (removedCourse?.title && userEmail) {
        try {
            await fetch(`http://localhost:5000/dash?userEmail=${encodeURIComponent(userEmail)}&title=${encodeURIComponent(removedCourse.title)}`, {
                method: "DELETE"
            });
            showToast(`Removed "${removedCourse.title}" from your dashboard list.`, "info");
        } catch (err) {
            console.error("Error removing course from backend:", err);
            showToast(`Removed locally, but backend cleanup is still pending for "${removedCourse.title}".`, "warn");
        }
    }
}

function showSavedListPanel() {
    const panel = document.getElementById("miniPanel");
    if (!panel) return;

    panel.style.display = "block";
    panel.classList.add("show");
}

function closePanel() {
    const panel = document.getElementById("miniPanel");
    if (!panel) return;
    panel.classList.remove("show");
    panel.style.display = "none";
}