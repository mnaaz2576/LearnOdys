// SEARCH
function searchCourse(){
    const q=document.getElementById("searchInput").value;
    window.location.href="courses.html?search="+q;
}

function quickSearch(skill){
    window.location.href="courses.html?search="+skill;
}

// TRENDING COURSES (fake for now)
const trending=[
"Python for Beginners",
"React Complete Guide",
"Machine Learning Basics",
"Data Science Bootcamp"
];

const container=document.getElementById("trendingCourses");
trending.forEach(course=>{
    container.innerHTML+=`<div class="preview-card">${course}</div>`;
});

// AI mentor (temporary dummy)
function askAI(){
    const q=document.getElementById("aiQuestion").value;
    document.getElementById("aiAnswer").innerText=
    "Suggested path: HTML → CSS → JavaScript → React → Projects";
}