import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function ManageWatches() {
  const navigate = useNavigate();
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWatches = () => {
    api.get("/watches")
      .then((res) => setWatches(res.data))
      .catch(() => setWatches([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const admin = localStorage.getItem("gearisAdmin");
    if (!admin) {
      navigate("/login");
      return;
    }
    loadWatches();
  }, [navigate]);

  const handleDelete = async (watchId) => {
    if (!window.confirm("Delete this watch? This cannot be undone.")) return;
    try {
      await api.delete(`/watches/${watchId}`);
      loadWatches();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete watch.");
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
        <div className="admin-link active">Manage Watches</div>
        <div className="admin-link" onClick={() => navigate("/orders")}>Manage Orders</div>
        <div className="admin-link" onClick={() => navigate("/users")}>Manage Users</div>
        <div className="admin-link" onClick={handleLogout} style={{ marginTop: 30, borderTop: "1px solid #33343a", paddingTop: 18 }}>
          Log Out
        </div>
      </div>

      <div className="admin-main">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 26 }}>
          <h1 style={{ fontSize: 28, margin: 0 }}>Manage Watches</h1>
          <button className="btn" style={{ width: "auto", padding: "10px 22px" }} onClick={() => navigate("/watches/new")}>
            + Add Watch
          </button>
        </div>

        <table>
          <thead>
            <tr><th>Watch</th><th>Brand</th><th>Price</th><th>Stock</th><th></th></tr>
          </thead>
          <tbody>
            {watches.map((watch) => (
              <tr key={watch._id}>
                <td>{watch.name}</td>
                <td>{watch.brand?.name}</td>
                <td>₹{watch.price.toLocaleString("en-IN")}</td>
                <td>{watch.stock}</td>
                <td>
                  <span onClick={() => navigate(`/watches/${watch._id}/edit`)} style={{ fontSize: 12, color: "#3A3B40", cursor: "pointer", marginRight: 14 }}>Edit</span>
                  <span onClick={() => handleDelete(watch._id)} style={{ fontSize: 12, color: "#72243E", cursor: "pointer" }}>Delete</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}