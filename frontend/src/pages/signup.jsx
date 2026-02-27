import { useState } from "react";
import API from "../api/api.js";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState("register"); // "register" or "verify-otp"
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post("/auth/signup", form);
      alert("OTP sent to your email. Check your console if email service is not configured.");
      setStep("verify-otp");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Signup failed";
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post("/auth/verify-otp", {
        email: form.email,
        otp: otp,
      });
      alert("Account created successfully! Please login.");
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "OTP verification failed";
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  if (step === "verify-otp") {
    return (
      <div className="page">
        <div className="auth-card">
          <div className="auth-header">
            <div className="brand">CourseSphere</div>
            <p className="muted">Verify your email with OTP</p>
          </div>
          <form className="form" onSubmit={handleVerifyOtp}>
            <label className="field">
              <span>Email</span>
              <input
                className="input"
                type="email"
                value={form.email}
                disabled
              />
            </label>
            <label className="field">
              <span>OTP Code</span>
              <input
                className="input"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                required
              />
            </label>
            {error && <div style={{ color: "#ff6b6b", fontSize: "0.9rem" }}>{error}</div>}
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
          <div className="auth-footer">
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => {
                setStep("register");
                setError("");
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand">CourseSphere</div>
          <p className="muted">Create your account in a few steps.</p>
        </div>
        <form className="form" onSubmit={handleSignup}>
          <label className="field">
            <span>Full name</span>
            <input
              className="input"
              placeholder="Jane Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              className="input"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>
          <label className="field">
            <span>Role</span>
            <select
              className="input"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </label>
          {error && <div style={{ color: "#ff6b6b", fontSize: "0.9rem" }}>{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <div className="auth-footer">
          <span className="muted">Already have an account?</span>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => navigate("/")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;