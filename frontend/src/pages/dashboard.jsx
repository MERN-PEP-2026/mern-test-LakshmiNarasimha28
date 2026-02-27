import { useEffect, useState } from "react";
import API from "../api/api.js";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [form, setForm] = useState({
    courseName: "",
    courseDescription: "",
    instructor: "",
    dateOfCourse: "",
  });

  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
      setCourses(res.data.courses);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      const enrolledIds = res.data.user.enrolledCourses || [];
      setEnrolledCourses(enrolledIds.map(course => 
        typeof course === 'string' ? course : course._id
      ));
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchUserProfile();
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post("/courses", form);
      alert("Course created successfully");
      setForm({ courseName: "", courseDescription: "", instructor: "", dateOfCourse: "" });
      fetchCourses();
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to create course";
      alert(message);
    }
  };

  const handleEnroll = async (id) => {
    try {
      const res = await API.post(`/courses/${id}/enroll`);
      alert(res.data.message || "Enrolled successfully");
      setEnrolledCourses([...enrolledCourses, id]);
      fetchCourses();
      fetchUserProfile();
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to enroll";
      alert(message);
    }
  };

  const handleUnenroll = async (id) => {
    try {
      const res = await API.post(`/courses/${id}/unenroll`);
      alert(res.data.message || "Unenrolled successfully");
      setEnrolledCourses(enrolledCourses.filter(courseId => courseId !== id));
      fetchCourses();
      fetchUserProfile();
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to unenroll";
      alert(message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/courses/${id}`);
      alert("Course deleted successfully");
      fetchCourses();
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to delete course";
      alert(message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const role = user?.role || "student";
  const isInstructor = role === "instructor" || role === "admin";
  const isStudent = role === "student";

  return (
    <div className="page page-wide">
      <div className="app-shell">
        <div className="topbar">
          <div>
            <div className="page-title">Dashboard</div>
            <div className="muted">Browse courses or manage your catalog.</div>
          </div>
          <div className="topbar-actions">
            <span className="role-badge">{role}</span>
            <button className="btn btn-ghost" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        {isInstructor && (
          <div className="card">
            <div className="section-title">Create Course</div>
            <form className="form grid-form" onSubmit={handleCreate}>
              <input
                className="input"
                placeholder="Course Name"
                onChange={(e) => setForm({ ...form, courseName: e.target.value })}
                required
              />
              <input
                className="input"
                placeholder="Description"
                onChange={(e) =>
                  setForm({ ...form, courseDescription: e.target.value })
                }
                required
              />
              <input
                className="input"
                placeholder="Instructor"
                onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                required
              />
              <input
                className="input"
                type="date"
                placeholder="Date of Course"
                onChange={(e) => setForm({ ...form, dateOfCourse: e.target.value })}
                required
              />
              <button className="btn btn-primary" type="submit">
                Upload Course
              </button>
            </form>
          </div>
        )}

        <div className="section-header">
          <div className="section-title">All Courses</div>
          {isStudent && (
            <div className="muted">Select a course to enroll.</div>
          )}
        </div>

        <div className="course-grid">
          {courses.map((course, index) => (
            <div
              key={course._id}
              className="course-card"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div>
                <h4>{course.courseName}</h4>
                <p className="muted">{course.courseDescription}</p>
              </div>
              <div className="course-meta">
                <span>Instructor: {course.instructor}</span>
              </div>
              <div className="course-actions">
                {isStudent && (
                  <button
                    className={`btn ${enrolledCourses.includes(course._id) ? 'btn-danger' : 'btn-primary'}`}
                    onClick={() => 
                      enrolledCourses.includes(course._id)
                        ? handleUnenroll(course._id)
                        : handleEnroll(course._id)
                    }
                  >
                    {enrolledCourses.includes(course._id) ? 'Unenroll' : 'Enroll'}
                  </button>
                )}
                {isInstructor && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(course._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;