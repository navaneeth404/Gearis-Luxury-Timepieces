import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", form);
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <div className="sub">Join Gearis to start your collection</div>

        {error && <div className="error-msg">{error}</div>}

        <div className="form-group">
          <label>Full Name</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Phone (optional)</label>
          <input name="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            name="password" type={showPassword ? "text" : "password"}
            value={form.password} onChange={handleChange}
          />
          <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            name="confirmPassword" type={showPassword ? "text" : "password"}
            value={form.confirmPassword} onChange={handleChange}
          />
        </div>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </div>
  );
}