import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminLogin() {
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

      if (data.role !== "admin") {
        setError("This account does not have admin access.");
        setLoading(false);
        return;
      }

      localStorage.setItem("gearisAdmin", JSON.stringify(data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h1>Gearis Admin</h1>
        <div className="sub">Sign in to the admin console</div>

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
          <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
            position: "absolute", right: 12, top: 38, background: "none", border: "none",
            cursor: "pointer", fontSize: 12, color: "#9c9a92"
          }}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}