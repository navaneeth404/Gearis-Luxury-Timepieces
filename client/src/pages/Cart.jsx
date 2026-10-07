import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("gearisUser") || "null");

  const loadCart = () => {
    api.get("/cart")
      .then((res) => setCart(res.data))
      .catch(() => setCart(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    await api.put(`/cart/${itemId}`, { quantity });
    loadCart();
  };

  const removeItem = async (itemId) => {
    await api.delete(`/cart/${itemId}`);
    loadCart();
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const { data } = await api.post("/payment/create-order");

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Gearis",
        description: "Luxury Timepiece Purchase",
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const { data: verifyData } = await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingAddress: {},
            });
            navigate(`/order-confirmation/${verifyData.order._id}`);
          } catch (err) {
            alert("Payment verification failed: " + (err.response?.data?.message || err.message));
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: "#A9812E" },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      alert(err.response?.data?.message || "Could not start checkout.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#F6F3EC" }}>
      <Navbar />
      <p style={{ padding: 48 }}>Loading...</p>
    </div>
  );

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.watch?.price || 0) * item.quantity, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#F6F3EC" }}>
      <Navbar />
      <div style={{ padding: 48, display: "grid", gridTemplateColumns: "1fr 360px", gap: 48 }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, marginBottom: 24 }}>
            Your Cart
          </h1>

          {items.length === 0 && (
            <p style={{ color: "#3A3B40" }}>
              Your cart is empty. <span onClick={() => navigate("/shop")} style={{ color: "#A9812E", cursor: "pointer" }}>Browse the collection</span>
            </p>
          )}

          {items.map((item) => {
            // Safely fetch first Cloudinary thumbnail image path from the watch profile
            const cartItemImage = item.watch?.images?.[0] || null;

            return (
              <div key={item._id} style={{
                display: "grid", gridTemplateColumns: "80px 1fr auto", gap: 16,
                padding: "20px 0", borderBottom: "1px solid #E3DFD3", alignItems: "center"
              }}>
                {/* Watch Image Container */}
                <div style={{ 
                  background: "#fff", 
                  border: "1px solid #E3DFD3", 
                  aspectRatio: "1", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  overflow: "hidden"
                }}>
                  {cartItemImage ? (
                    <img 
                      src={cartItemImage} 
                      alt={item.watch?.name || "Timepiece"} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  ) : (
                    <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="50" r="34" stroke="#A9812E" strokeWidth="2"/>
                    </svg>
                  )}
                </div>

                {/* Watch Metadata */}
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17 }}>{item.watch?.name}</div>
                  <div style={{ fontSize: 12, color: "#3A3B40" }}>{item.watch?.brand?.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ border: "1px solid #15161A", background: "none", width: 26, height: 26, cursor: "pointer" }}>−</button>
                    <span style={{ fontSize: 13 }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ border: "1px solid #15161A", background: "none", width: 26, height: 26, cursor: "pointer" }}>+</button>
                    <span onClick={() => removeItem(item._id)} style={{ fontSize: 11, color: "#3A3B40", marginLeft: 12, cursor: "pointer", borderBottom: "1px solid #c9c4b4" }}>
                      Remove
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: 15 }}>₹{((item.watch?.price || 0) * item.quantity).toLocaleString("en-IN")}</div>
              </div>
            );
          })}
        </div>

        {items.length > 0 && (
          <div style={{ background: "#fff", border: "1px solid #E3DFD3", padding: 28, height: "fit-content" }}>
            <h3 style={{ fontSize: 17, marginBottom: 20 }}>Order Summary</h3>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 20 }}>
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <button className="btn" onClick={handleCheckout} disabled={checkingOut}>
              {checkingOut ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
