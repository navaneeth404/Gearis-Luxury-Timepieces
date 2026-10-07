import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem("gearisAdmin");
    if (!admin) {
      navigate("/login");
      return;
    }
    api.get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("gearisAdmin");
    navigate("/login");
  };

  if (loading) return <p style={{ padding: 48 }}>Loading...</p>;

  return (
    <div className="admin-shell">
      <div className="admin-side">
        <div className="admin-brand">Gearis <span style={{ fontSize: 11, color: "#8a877c" }}>Admin</span></div>
        <div className="admin-link active">Dashboard</div>
        <div className="admin-link" onClick={() => navigate("/watches")}>Manage Watches</div>
        <div className="admin-link" onClick={() => navigate("/orders")}>Manage Orders</div>
        <div className="admin-link" onClick={() => navigate("/users")}>Manage Users</div>
        <div className="admin-link" onClick={handleLogout} style={{ marginTop: 30, borderTop: "1px solid #33343a", paddingTop: 18 }}>
          Log Out
        </div>
      </div>

      <div className="admin-main">
        <h1 style={{ fontSize: 28, marginBottom: 30 }}>Dashboard</h1>

        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-label">TOTAL REVENUE</div>
            <div className="stat-value">₹{stats.totalRevenue.toLocaleString("en-IN")}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">TOTAL ORDERS</div>
            <div className="stat-value">{stats.totalOrders}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">TOTAL CUSTOMERS</div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
        </div>

        <h3 style={{ fontSize: 16, marginBottom: 16 }}>Recent Orders</h3>
        <table>
          <thead>
            <tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            {stats.recentOrders.map((order) => (
              <tr key={order._id}>
                <td>#{order._id.slice(-8).toUpperCase()}</td>
                <td>{order.user?.name}</td>
                <td>₹{order.totalAmount.toLocaleString("en-IN")}</td>
                <td><span className={`status-pill status-${order.status}`}>{order.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}