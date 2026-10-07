import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    setLoading(true);
    api.get("/admin/users")
      .then((res) => {
        // Filter to display only customers, or keep all depending on your database design
        setUsers(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setUsers([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const admin = localStorage.getItem("gearisAdmin");
    if (!admin) {
      navigate("/login");
      return;
    }
    loadUsers();
  }, [navigate]);

  const handleToggleBlock = async (userId, currentBlockStatus) => {
    const action = currentBlockStatus ? "unblock" : "block";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      await api.put(`/admin/users/${userId}/toggle-block`);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || `Could not ${action} user.`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("gearisAdmin");
    navigate("/login");
  };

  if (loading) return <p style={{ padding: 48 }}>Loading Users...</p>;

  return (
    <div className="admin-shell">
      {/* Sidebar Navigation - Mirrored Casing and Rules exactly from ManageWatches */}
      <div className="admin-side">
        <div className="admin-brand">
          Gearis <span style={{ fontSize: 11, color: "#8a877c" }}>Admin</span>
        </div>
        <div className="admin-link" onClick={() => navigate("/dashboard")}>Dashboard</div>
        <div className="admin-link" onClick={() => navigate("/watches")}>Manage Watches</div>
        <div className="admin-link" onClick={() => navigate("/orders")}>Manage Orders</div>
        <div className="admin-link active">Manage Users</div>
        <div className="admin-link" onClick={handleLogout} style={{ marginTop: 30, borderTop: "1px solid #33343a", paddingTop: 18 }}>
          Log Out
        </div>
      </div>

      {/* Main Content Area */}
      <div className="admin-main">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 26 }}>
          <h1 style={{ fontSize: 28, margin: 0 }}>Manage Users</h1>
        </div>

        {users.length === 0 ? (
          <p style={{ color: "#8a877c" }}>No registered customers found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Verification</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={{ fontWeight: 500 }}>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || "—"}</td>
                  <td>
                    <span style={{
                      padding: "4px 8px",
                      fontSize: 11,
                      borderRadius: 4,
                      background: user.isVerified ? "rgba(40, 167, 69, 0.15)" : "rgba(220, 53, 69, 0.15)",
                      color: user.isVerified ? "#28a745" : "#dc3545"
                    }}>
                      {user.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      padding: "4px 8px",
                      fontSize: 11,
                      borderRadius: 4,
                      background: user.isBlocked ? "rgba(220, 53, 69, 0.15)" : "rgba(40, 167, 69, 0.15)",
                      color: user.isBlocked ? "#dc3545" : "#28a745"
                    }}>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td>
                    <span 
                      onClick={() => handleToggleBlock(user._id, user.isBlocked)} 
                      style={{ 
                        fontSize: 12, 
                        color: user.isBlocked ? "#28a745" : "#72243E", 
                        cursor: "pointer",
                        textDecoration: "underline"
                      }}
                    >
                      {user.isBlocked ? "Unblock User" : "Block User"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
