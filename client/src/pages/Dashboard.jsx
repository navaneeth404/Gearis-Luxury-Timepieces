import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("gearisUser");
    if (!saved) {
      navigate("/login");
      return;
    }

    api.get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        setError("Session expired. Please sign in again.");
        localStorage.removeItem("gearisUser");
        setTimeout(() => navigate("/login"), 1500);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("gearisUser");
    navigate("/login");
  };

  if (error) return <div className="dashboard"><p className="error-msg">{error}</p></div>;
  if (!user) return <div className="dashboard"><p>Loading...</p></div>;

  return (
    <div className="dashboard">
      <h1>Welcome, {user.name}</h1>
      <p style={{ color: "var(--ink-soft)", fontSize: 14, marginBottom: 20 }}>
        Email: {user.email} · Role: {user.role}
      </p>
      <button className="btn" style={{ width: 200, margin: "0 auto" }} onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}  