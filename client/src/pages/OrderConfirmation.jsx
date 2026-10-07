import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/payment/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#F6F3EC" }}>
      <Navbar />
      <p style={{ padding: 48 }}>Loading...</p>
    </div>
  );

  if (!order) return (
    <div style={{ minHeight: "100vh", background: "#F6F3EC" }}>
      <Navbar />
      <p style={{ padding: 48 }}>Order not found.</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F6F3EC" }}>
      <Navbar />
      <div style={{ maxWidth: 500, margin: "80px auto", textAlign: "center", padding: "0 24px" }}>
        <div style={{
          width: 56, height: 56, border: "1px solid #27500A", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px",
          color: "#27500A", fontSize: 26
        }}>
          ✓
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, marginBottom: 10 }}>
          Order Confirmed
        </h1>
        <p style={{ color: "#3A3B40", fontSize: 14, marginBottom: 6 }}>
          Order #{order._id.slice(-8).toUpperCase()}
        </p>
        <p style={{ color: "#3A3B40", fontSize: 14, marginBottom: 30 }}>
          Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        <div style={{ background: "#fff", border: "1px solid #E3DFD3", padding: 24, textAlign: "left", marginBottom: 30 }}>
          {order.items.map((item) => (
            <div key={item._id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "8px 0", borderBottom: "1px solid #E3DFD3" }}>
              <span>{item.watch?.name} × {item.quantity}</span>
              <span>₹{(item.priceAtPurchase * item.quantity).toLocaleString("en-IN")}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, paddingTop: 12, fontWeight: 600 }}>
            <span>Total</span>
            <span>₹{order.totalAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn" onClick={() => navigate("/orders")}>View My Orders</button>
          <button className="btn" style={{ background: "transparent", color: "#15161A" }} onClick={() => navigate("/shop")}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}