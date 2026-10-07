import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("gearisUser", JSON.stringify(data));
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong. Try again.";
      setError(message);

      if (message.toLowerCase().includes("verify")) {
        setTimeout(() => navigate("/verify-otp", { state: { email: form.email } }), 1200);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        <div className="sub">Welcome back to Gearis</div>

        {error && <div className="error-msg">{error}</div>}

        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} />
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

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </div>
      </form>
    </div>
  );
}