import { useEffect, useState } from "react";
import API from "../API/api.js";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    courseName: "",
    courseDescription: "",
    instructor: "",
  });

  const fetchCourses = async () => {
    const res = await API.get("/courses");
    setCourses(res.data.courses);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await API.post("/courses", form);
    fetchCourses();
  };

  const handleDelete = async (id) => {
    await API.delete(`/courses/${id}`);
    fetchCourses();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={logout}>Logout</button>

      <h3>Create Course</h3>
      <form onSubmit={handleCreate}>
        <input placeholder="Course Name"
          onChange={(e) => setForm({ ...form, courseName: e.target.value })} />
        <input placeholder="Description"
          onChange={(e) => setForm({ ...form, courseDescription: e.target.value })} />
        <input placeholder="Instructor"
          onChange={(e) => setForm({ ...form, instructor: e.target.value })} />
        <button type="submit">Create</button>
      </form>

      <h3>All Courses</h3>
      {courses.map((course) => (
        <div key={course._id}>
          <h4>{course.courseName}</h4>
          <p>{course.courseDescription}</p>
          <p>Instructor: {course.instructor}</p>
          <button onClick={() => handleDelete(course._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;