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
        if (!res.ok) throw new Error("Network response was not ok");
        
        const courses = await res.json();
        displayCourses(courses);
    } catch(err) {
        console.log("Error fetching courses, using sample data:", err);
        const sampleData = getCoursesFromSample(search) || [];
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
    renderAdvisorState(); // Don't force reset, allow history restoration
    
    // Restore widget open state
    const wasOpen = localStorage.getItem("advisorWidgetOpen") === "true";
    if (wasOpen) {
        toggleAdvisorWidget(true);
    } else {
        toggleAdvisorWidget(false);
    }
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
    widget.style.display = advisorWidgetOpen ? "flex" : "none";
    const label = fab.querySelector(".fab-label");
    if (label) label.textContent = advisorWidgetOpen ? "Close" : "AI Guide";
    fab.querySelector(".fab-icon").textContent = advisorWidgetOpen ? "✖" : "🤖";
    
    // Persist state
    localStorage.setItem("advisorWidgetOpen", advisorWidgetOpen);
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
        numericLevel = levelMap[String(course.level || "").toLowerCase()] ?? 0;
    }

    const targetDays = 14;
    const dueDate = new Date(Date.now() + targetDays * 24 * 60 * 60 * 1000).toISOString();

    // Preserve original difficulty string so dash.html can show Beginner/Intermediate/Advanced
    const rawLevelStr = String(course.level || "").trim();
    const difficultyLabel = isNaN(rawLevelStr) ? rawLevelStr : "";

    return {
        name: title,
        title,
        userEmail: localStorage.getItem("userEmail") || "guest",
        level: numericLevel,
        difficultyLabel,
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

    if (exists) {
        showToast(`"${normalizedCourse.title}" is already in your dashboard.`, "info");
        if (e?.target) {
            e.target.innerText = "Saved ✓";
            setTimeout(() => { e.target.innerText = "+ Add"; }, 1200);
        }
        showSavedListPanel();
        return;
    }

    // ── Overlap check before adding ──
    const overlapMsg = getRedundancyMessage(normalizedCourse, myList);
    if (overlapMsg) {
        showToast(`⚠️ Overlap detected: ${overlapMsg}`, "warn");
        // Still allow the add — just warn
    }

    myList.push(normalizedCourse);
    saveUserCourses();
    renderList();
    renderAdvisorState(true);

    try {
        const res = await fetch("http://localhost:5000/dash", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(normalizedCourse)
        });
        const data = await res.json().catch(() => null);
        if (data?.course) {
            myList = myList.map(item =>
                (item.title || item.name) === normalizedCourse.title ? { ...item, ...data.course } : item
            );
            saveUserCourses();
        }
        if (!overlapMsg) {
            showToast(`Saved "${normalizedCourse.title}" to your dashboard.`, "success");
        }
    } catch (err) {
        console.error("Error saving to backend:", err);
        showToast(`"${normalizedCourse.title}" was added locally. Backend sync will retry when available.`, "warn");
    }

    if (e?.target) {
        e.target.innerText = "Added ✓";
        setTimeout(() => { e.target.innerText = "+ Add"; }, 1200);
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
        selectedBox.innerHTML = `<span class="selected-course-chip empty">No courses pinned — click <b>Interested</b> on any card to compare</span>`;
    } else {
        selectedBox.innerHTML = advisorSelectedCourses.map(course => `
            <span class="selected-course-chip">
                ${escapeHtml(course.title || course.name)}
                <button onclick="removeSelectedCourse('${escapeHtml((course.title || course.name).replace(/'/g, "&#39;"))}')">✕</button>
            </span>
        `).join("");
    }

    if (output) {
        // Restore persisted chat history on load
        const savedChat = loadChatHistory();
        if (savedChat && !resetOutput && output.dataset.mode !== "fresh") {
            output.dataset.mode = "chat";
            output.innerHTML = savedChat;
            output.scrollTop = output.scrollHeight;
        } else if (savedChat && resetOutput) {
            // Even if resetOutput is true, if we have history and we're just initializing, keep it
            output.dataset.mode = "chat";
            output.innerHTML = savedChat;
            output.scrollTop = output.scrollHeight;
        } else if (resetOutput || !output.dataset.mode) {
            const savedChatOnReset = loadChatHistory();
            if (!savedChatOnReset) {
                output.dataset.mode = "";
                output.innerHTML = makeBotBubble(getPersonalizedAdvisorLines().join(" "));
            } else {
                output.dataset.mode = "chat";
                output.innerHTML = savedChatOnReset;
                output.scrollTop = output.scrollHeight;
            }
        }
    }
}

function clearAdvisorChat() {
    clearChatHistory();
    const output = document.getElementById("advisorOutput");
    if (output) {
        output.dataset.mode = "";
        output.innerHTML = makeBotBubble(getPersonalizedAdvisorLines().join(" "));
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
        const redundancyMessage = getRedundancyMessage(normalizedCourse, advisorSelectedCourses);
        advisorSelectedCourses.push(normalizedCourse);

        if (redundancyMessage) {
            const alertBox = document.getElementById("advisorAlert");
            if (alertBox) {
                alertBox.style.display = "block";
                alertBox.textContent = redundancyMessage;
            }
            if (typeof showToast === "function") {
                showToast("Overlapping Warning: " + redundancyMessage, "warn");
            }
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

// ---- Bubble builders ----
function makeUserBubble(text) {
    const userLabel = (localStorage.getItem("userEmail") || "U")[0].toUpperCase();
    return `<div class="ai-bubble user">
        <div class="ai-bubble-avatar user-av">${escapeHtml(userLabel)}</div>
        <div class="ai-bubble-body">${escapeHtml(text)}</div>
    </div>`;
}

function makeBotBubble(html) {
    return `<div class="ai-bubble bot">
        <div class="ai-bubble-avatar">🤖</div>
        <div class="ai-bubble-body">${html}</div>
    </div>`;
}

function makeTypingBubble(id) {
    return `<div class="ai-bubble bot" id="${id}">
        <div class="ai-bubble-avatar">🤖</div>
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    </div>`;
}

function setSendLoading(loading) {
    const btn = document.getElementById("advisorSendBtn");
    if (!btn) return;
    btn.disabled = loading;
    btn.innerHTML = loading
        ? `<div class="send-spinner"></div>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
}

function sendQuickChip(text) {
    const input = document.getElementById("advisorInput");
    if (input) input.value = text;
    askCourseAdvisor();
}

// ---- Chat History (localStorage — persists across navigation) ----
function getChatStorageKey() {
    const email = localStorage.getItem("userEmail") || "guest";
    return `advisorChat_${email.toLowerCase()}`;
}

function saveChatHistory(html) {
    try { localStorage.setItem(getChatStorageKey(), html); } catch(e) {}
}

function loadChatHistory() {
    try { return localStorage.getItem(getChatStorageKey()) || ""; } catch(e) { return ""; }
}

function clearChatHistory() {
    try { localStorage.removeItem(getChatStorageKey()); } catch(e) {}
}

// ---- Rich AI Response Formatter ----
function linkifyCourseNames(text) {
    // Collect all known course titles from the current page cards
    const courseCards = [];
    document.querySelectorAll(".course-card h3").forEach(h => {
        const t = h.textContent.trim();
        if (t) courseCards.push(t);
    });
    // Also include sample courses
    const allSampleTitles = [];
    if (typeof sampleCourses !== "undefined") {
        Object.values(sampleCourses).forEach(arr => arr.forEach(c => allSampleTitles.push(c.title)));
    }
    const allTitles = [...new Set([...courseCards, ...allSampleTitles])];
    let result = text;
    allTitles.forEach(title => {
        const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(?<![\\w>])(${escaped})(?![\\w<])`, 'gi');
        result = result.replace(regex, (match) => {
            const safeMatch = match.replace(/'/g, "\\'");
            return `<a href="javascript:void(0)" class="ai-course-link" onclick="handleCourseLinkClick(event, '${escapeHtml(safeMatch)}')" title="Search for ${escapeHtml(match)}">${escapeHtml(match)} ↗</a>`;
        });
    });
    return result;
}

function handleCourseLinkClick(event, courseName) {
    if (event) event.preventDefault();
    
    // Update the visual search input (optional but good for feedback)
    const searchFormInput = document.querySelector('input[name="search"]') || document.querySelector('.search-bar input');
    if (searchFormInput) searchFormInput.value = courseName;

    // Trigger search
    fetchCourses(courseName);

    // Update URL without reload for bookmarking/back button consistency
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('search', courseName);
    window.history.pushState({ search: courseName }, '', newUrl);
    
    showToast(`Searching for "${courseName}"...`, "info");
}

function formatAdvisorResponse(text) {
    if (!text) return "";
    let html = String(text)
        // Bold: **text** or __text__
        .replace(/\*\*(.+?)\*\*/g, (_, m) => `<strong>${escapeHtml(m)}</strong>`)
        .replace(/__(.+?)__/g, (_, m) => `<strong>${escapeHtml(m)}</strong>`)
        // Italic: *text*
        .replace(/\*([^*]+)\*/g, (_, m) => `<em>${escapeHtml(m)}</em>`);

    const lines = html.split("\n");
    const parts = [];
    let inList = false;

    lines.forEach(raw => {
        const line = raw.trim();
        if (!line) {
            if (inList) { parts.push("</ul>"); inList = false; }
            return;
        }
        // Numbered list: 1. or 1)
        if (/^\d+[.)\s]/.test(line)) {
            if (inList) { parts.push("</ul>"); inList = false; }
            const content = line.replace(/^\d+[.)\s]+/, "");
            parts.push(`<div class="advisor-line" style="margin:5px 0;"><strong style="color:#3b82f6;">${line.match(/^(\d+)/)[1]}.</strong> ${linkifyCourseNames(content)}</div>`);
        }
        // Bullet list: • - *
        else if (/^[•\-\*]\s/.test(line)) {
            if (!inList) { parts.push("<ul style='margin:6px 0 6px 16px; padding:0;'>"); inList = true; }
            const content = line.replace(/^[•\-\*]\s+/, "");
            parts.push(`<li style="margin:3px 0; color:#334155;">${linkifyCourseNames(content)}</li>`);
        }
        // Heading detected (line ends with : and is short)
        else if (line.endsWith(":") && line.length < 60) {
            if (inList) { parts.push("</ul>"); inList = false; }
            parts.push(`<div class="advisor-line" style="font-weight:700; color:#1e3a8a; margin-top:8px;">${linkifyCourseNames(line)}</div>`);
        }
        // Normal line
        else {
            if (inList) { parts.push("</ul>"); inList = false; }
            parts.push(`<div class="advisor-line" style="margin:4px 0; line-height:1.6;">${linkifyCourseNames(line)}</div>`);
        }
    });
    if (inList) parts.push("</ul>");
    return parts.join("");
}

function buildAdvisorContext() {
    const userLabel = localStorage.getItem("userName") || localStorage.getItem("userEmail") || "learner";
    
    // If user has manually selected courses for the AI to compare (interested list)
    if (advisorSelectedCourses.length) {
        return `Learner: ${userLabel}\nInterested courses (not yet started):\n` + 
            advisorSelectedCourses.map((c, i) => `${i + 1}. ${c.title} — ${c.platform || "Online"} (Looking for advice on this)`).join("\n");
    }

    // Fallback to active dashboard courses (myList)
    if (myList.length) {
        return `Learner: ${userLabel}\nActive Dashboard Courses:\n` + 
            myList.slice(0, 5).map((c, i) => `${i + 1}. ${c.title} — ${c.platform || "Online"}, progress: ${c.level}% complete`).join("\n");
    }

    const params = new URLSearchParams(window.location.search);
    return `Learner: ${userLabel}\nCurrent topic search: ${params.get("search") || "general programming"}`;
}

async function askCourseAdvisor() {
    const input = document.getElementById("advisorInput");
    const output = document.getElementById("advisorOutput");
    if (!output) return;

    const userIssue = (input?.value || "").trim();
    const effectiveIssue = userIssue || "Help me choose the best course and tell me what to do next.";

    if (output.dataset.mode !== "chat") {
        output.dataset.mode = "chat";
        output.innerHTML = "";
    }

    if (userIssue) {
        output.innerHTML += makeUserBubble(userIssue);
    }

    const loadingId = "typing-" + Date.now();
    output.innerHTML += makeTypingBubble(loadingId);
    output.scrollTop = output.scrollHeight;
    if (input) input.value = "";
    setSendLoading(true);

    try {
        const prompt = `You are a conversational AI Course Assistant for LearnOdys. 
Strictly follow these context rules:
1. Interested courses have 0% progress and are not started yet.
2. Active Dashboard courses have progress percentages.
Do NOT hallucinate progress for interested courses.

Current Context:
${buildAdvisorContext()}

User Message: "${effectiveIssue}"

Respond naturally and directly to the user. If they ask about interested courses, guide them on value and fit. If they ask about active courses, guide them on completion. Keep your response brief, friendly, and practical. When suggesting courses, use exact titles.`;
        const result = await askCourseAI(prompt);
        document.getElementById(loadingId)?.remove();
        output.innerHTML += makeBotBubble(formatAdvisorResponse(result));
        output.scrollTop = output.scrollHeight;
        saveChatHistory(output.innerHTML);
    } catch (err) {
        console.error("Error asking course advisor:", err);
        document.getElementById(loadingId)?.remove();
        output.innerHTML += makeBotBubble(`<span style="color:#b91c1c;">Couldn't reach the AI right now. Try starting with the course that best matches your current level.</span>`);
        output.scrollTop = output.scrollHeight;
        saveChatHistory(output.innerHTML);
    } finally {
        setSendLoading(false);
    }
}

async function generateCourseRoadmap() {
    const output = document.getElementById("advisorOutput");
    if (!output) return;

    if (output.dataset.mode !== "chat") {
        output.dataset.mode = "chat";
        output.innerHTML = "";
    }

    output.innerHTML += makeUserBubble("Generate Roadmap");

    const loadingId = "typing-roadmap-" + Date.now();
    output.innerHTML += makeTypingBubble(loadingId);
    output.scrollTop = output.scrollHeight;
    setSendLoading(true);

    try {
        const prompt = `Create a short course roadmap for this learner. 
Notice: Interested courses are not started yet (0% progress). Active courses have progress.
Base your roadmap on the context below. Return 4 short steps maximum. Keep it actionable. Use exact titles.

Course context:
${buildAdvisorContext()}`;
        const result = await askCourseAI(prompt);
        document.getElementById(loadingId)?.remove();
        output.innerHTML += makeBotBubble(formatAdvisorResponse(result));
        output.scrollTop = output.scrollHeight;
        saveChatHistory(output.innerHTML);
    } catch (err) {
        console.error("Error generating course roadmap:", err);
        document.getElementById(loadingId)?.remove();
        const fallback = [
            "1. Start with the most beginner-friendly course first.",
            "2. Finish one core module and practice it immediately.",
            "3. Skip overlapping content and move to the more advanced course next.",
            "4. Build one mini project to lock in your understanding."
        ].map(line => `<div class="advisor-line" style="margin:5px 0;">${line}</div>`).join("");
        output.innerHTML += makeBotBubble(fallback);
        output.scrollTop = output.scrollHeight;
        saveChatHistory(output.innerHTML);
    } finally {
        setSendLoading(false);
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