import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

const statusColors = {
  pending: { bg: "#FBF1E0", color: "#8A6416" },
  paid: { bg: "#E8F0EA", color: "#27500A" },
  shipped: { bg: "#E9EEF5", color: "#3A5A8C" },
  delivered: { bg: "#E8F0EA", color: "#27500A" },
  cancelled: { bg: "#FBEAF0", color: "#72243E" },
};

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    api.get("/payment/orders")
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await api.put(`/payment/orders/${orderId}/cancel`);
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Could not cancel order.");
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#F6F3EC" }}>
      <Navbar />
      <p style={{ padding: 48 }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F6F3EC" }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, marginBottom: 28 }}>
          My Orders
        </h1>

        {orders.length === 0 && (
          <p style={{ color: "#3A3B40" }}>
            No orders yet. <span onClick={() => navigate("/shop")} style={{ color: "#A9812E", cursor: "pointer" }}>Browse the collection</span>
          </p>
        )}

        {orders.map((order) => {
          const canCancel = !["shipped", "delivered", "cancelled"].includes(order.status);
          const colors = statusColors[order.status] || statusColors.pending;

          return (
            <div key={order._id} style={{ background: "#fff", border: "1px solid #E3DFD3", padding: 24, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>Order #{order._id.slice(-8).toUpperCase()}</div>
                  <div style={{ fontSize: 12, color: "#3A3B40" }}>
                    Placed {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
                <span style={{
                  background: colors.bg, color: colors.color, fontSize: 11,
                  padding: "4px 10px", height: "fit-content", textTransform: "capitalize"
                }}>
                  {order.status}
                </span>
              </div>

              {order.items.map((item) => (
                <div key={item._id} style={{ fontSize: 13, color: "#3A3B40", padding: "4px 0" }}>
                  {item.watch?.name} × {item.quantity} — ₹{(item.priceAtPurchase * item.quantity).toLocaleString("en-IN")}
                </div>
              ))}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 14, borderTop: "1px solid #E3DFD3" }}>
                <div style={{ fontSize: 13, color: "#3A3B40" }}>
                  {order.status !== "cancelled" && order.estimatedDelivery && (
                    <>Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>₹{order.totalAmount.toLocaleString("en-IN")}</span>
                  {canCancel && (
                    <span onClick={() => handleCancel(order._id)} style={{ fontSize: 12, color: "#72243E", cursor: "pointer", borderBottom: "1px solid #c9a7b0" }}>
                      Cancel Order
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}