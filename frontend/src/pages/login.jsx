import { useState } from "react";
import API from "../api/api.js";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.message 
        || error.message 
        || "Login failed. Please check your connection.";
      alert(message);
    }
  };

  return (
    <div className="page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand">CourseSphere</div>
          <p className="muted">Sign in to manage and explore courses.</p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              className="input"
              type="password"
              placeholder="Your password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>
          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </form>
        <div className="auth-footer">
          <span className="muted">New here?</span>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => navigate("/register")}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;