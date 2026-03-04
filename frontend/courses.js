let allCourses = []
let searchedCourses = []

async function loadCourses(){

const params = new URLSearchParams(window.location.search)

const search = params.get("search")

try{

const response = await fetch(
`http://localhost:5000/courses?search=${search}`
)

const courses = await response.json()

allCourses = courses
searchedCourses = courses

displayCourses(searchedCourses)

}

catch(error){

console.log("Error loading courses")

}

}



function applyFilters(){

const levelFilters =
[...document.querySelectorAll(".level-filter:checked")]
.map(cb => cb.value)

const durationFilters =
[...document.querySelectorAll(".duration-filter:checked")]
.map(cb => cb.value)

const platformFilters =
[...document.querySelectorAll(".platform-filter:checked")]
.map(cb => cb.value)

let filteredCourses = searchedCourses.filter(course => {

let levelMatch =
levelFilters.length === 0 ||
levelFilters.includes(course.level)

let platformMatch =
platformFilters.length === 0 ||
platformFilters.includes(course.platform)

let durationMatch = true

if(durationFilters.length > 0){

const hours = parseInt(course.duration)

durationMatch = durationFilters.some(range => {

if(range === "short") return hours <= 5
if(range === "medium") return hours > 5 && hours <= 20
if(range === "long") return hours > 20

})

}

return levelMatch && durationMatch && platformMatch

})

displayCourses(filteredCourses)

}



function displayCourses(courses){

const container =
document.getElementById("courseContainer")

container.innerHTML = ""

if(courses.length === 0){

container.innerHTML = "<h2>No courses found</h2>"

return

}

courses.forEach(course => {

container.innerHTML += `

<div class="course-card">

<img src="${course.image}" width="250">

<h3>${course.title}</h3>

<p><b>Platform:</b> ${course.platform}</p>

<p><b>Level:</b> ${course.level}</p>

<p><b>Duration:</b> ${course.duration}</p>

<p>⭐ ${course.rating}</p>

<button onclick="openCourse('${course.url}')">
Go to Course
</button>

</div>

`

})

}



function openCourse(url){

window.open(url,"_blank")

}



loadCourses()

document
.querySelectorAll("input[type=checkbox]")
.forEach(cb => {

cb.addEventListener("change",applyFilters)

})