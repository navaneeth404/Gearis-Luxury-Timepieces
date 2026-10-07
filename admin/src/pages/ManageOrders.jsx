import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const statusOptions = ["pending", "paid", "shipped", "delivered", "cancelled"];

export default function ManageOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    api.get("/admin/orders")
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const admin = localStorage.getItem("gearisAdmin");
    if (!admin) {
      navigate("/login");
      return;
    }
    loadOrders();
  }, [navigate]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}`, { status });
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Could not update order.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("gearisAdmin");
    navigate("/login");
  };

  if (loading) return <p style={{ padding: 48 }}>Loading...</p>;

  return (
    <div className="admin-shell">
      <div className="admin-side">
        <div className="admin-brand">Gearis <span style={{ fontSize: 11, color: "#8a877c" }}>Admin</span></div>
        <div className="admin-link" onClick={() => navigate("/dashboard")}>Dashboard</div>
        <div className="admin-link" onClick={() => navigate("/watches")}>Manage Watches</div>
        <div className="admin-link active">Manage Orders</div>
        <div className="admin-link" onClick={() => navigate("/users")}>Manage Users</div>
        <div className="admin-link" onClick={handleLogout} style={{ marginTop: 30, borderTop: "1px solid #33343a", paddingTop: 18 }}>
          Log Out
        </div>
      </div>

      <div className="admin-main">
        <h1 style={{ fontSize: 28, marginBottom: 26 }}>Manage Orders</h1>

        <table>
          <thead>
            <tr><th>Order</th><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th><th>Update Status</th></tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>#{order._id.slice(-8).toUpperCase()}</td>
                <td>{order.user?.name}<br /><span style={{ fontSize: 11, color: "#8a877c" }}>{order.user?.email}</span></td>
                <td>{order.items.length}</td>
                <td>₹{order.totalAmount.toLocaleString("en-IN")}</td>
                <td><span className={`status-pill status-${order.status}`}>{order.status}</span></td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    style={{ padding: 6, border: "1px solid #c9c4b4", fontSize: 12 }}
                  >
                    {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}