async function loadCourses() {

    const params = new URLSearchParams(window.location.search);
    const search = params.get("search") || "";

    fetchCourses(search);
}


// 🔥 MAIN FUNCTION
async function fetchCourses(search = "") {

    const level =
        document.querySelector(".level-filter:checked")?.value || "";

    const duration =
        document.querySelector(".duration-filter:checked")?.value || "";

    const platform =
        document.querySelector(".platform-filter:checked")?.value || "";

    let url = `http://localhost:5000/courses?search=${search}`;

    if (level) url += `&level=${level}`;
    if (duration) url += `&duration=${duration}`;
    if (platform) url += `&platform=${platform}`;

    const res = await fetch(url);
    const courses = await res.json();

    displayCourses(courses);
}


// 🎯 DISPLAY
function displayCourses(courses) {

    const container = document.getElementById("courseContainer");

    container.innerHTML = "";

    if (courses.length === 0) {
        container.innerHTML = "<h2>No courses found</h2>";
        return;
    }

    courses.forEach(course => {

        container.innerHTML += `
        <div class="course-card">
            <h3>${course.title}</h3>
            <p>${course.platform}</p>
            <p>${course.level}</p>
            <p>${course.duration}</p>
            <p>⭐ ${course.rating}</p>

            <button onclick="openCourse('${course.url}')">
                Go to Course
            </button>
        </div>
        `;

    });
}


function openCourse(url) {
    window.open(url, "_blank");
}


// 🔥 FILTER CHANGE
document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", () => {

        const params = new URLSearchParams(window.location.search);
        const search = params.get("search") || "";

        fetchCourses(search);

    });
});


loadCourses();