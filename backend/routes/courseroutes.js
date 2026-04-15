router.get("/courses", async (req, res) => {
  const courses = await getCourses();
  res.json(courses);
});