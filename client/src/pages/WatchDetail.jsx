import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

export default function WatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [watch, setWatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setActiveImg(0);
    // Fetches cleanly from the singular route context
    api.get(`/watches/${id}`)
      .then((res) => {
        setWatch(res.data);
      })
      .catch((err) => {
        console.error("Error fetching watch details:", err);
        setWatch(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await api.post("/cart", { watchId: watch._id, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#F6F3EC" }}>
      <Navbar />
      <p style={{ padding: 48 }}>Loading...</p>
    </div>
  );

  if (!watch) return (
    <div style={{ minHeight: "100vh", background: "#F6F3EC" }}>
      <Navbar />
      <p style={{ padding: 48 }}>Watch not found.</p>
    </div>
  );

  // Safely extract images matching your Shop/Home arrays pattern
  const images = Array.isArray(watch.images) ? watch.images.filter(Boolean) : [];
  const mainImage = images[activeImg] || null;

  return (
    <div style={{ minHeight: "100vh", background: "#F6F3EC" }}>
      <Navbar />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, padding: "48px" }}>
        {/* Left Side: Images Section */}
        <div>
          {/* Main Display Container - Clean white background matching Shop card style */}
          <div style={{
            background: "#fff",
            border: "1px solid #E3DFD3",
            aspectRatio: "1/1", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            overflow: "hidden"
          }}>
            {mainImage ? (
              <img
                src={mainImage}
                alt={watch.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <svg width="140" height="140" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="74" stroke="#A9812E" strokeWidth="2"/>
                <circle cx="100" cy="100" r="62" stroke="#A9812E" strokeWidth="1" opacity=".5"/>
                <line x1="100" y1="100" x2="100" y2="55" stroke="#15161A" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="100" y1="100" x2="132" y2="110" stroke="#15161A" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="100" cy="100" r="3.5" fill="#A9812E"/>
              </svg>
            )}
          </div>

          {/* Thumbnail Gallery for Admin-Uploaded Multiple Images */}
          {images.length > 1 && (
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              {images.map((img, i) => (
                <div 
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{
                    width: 64, 
                    height: 64, 
                    background: "#fff",
                    border: i === activeImg ? "2px solid #A9812E" : "1px solid #E3DFD3",
                    cursor: "pointer",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <img
                    src={img}
                    alt={`${watch.name} view ${i + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Specs and Details */}
        <div>
          <div style={{ fontSize: 12, color: "#3A3B40", textTransform: "uppercase", marginBottom: 8 }}>
            {watch.brand?.name}
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, margin: "0 0 16px" }}>
            {watch.name}
          </h1>
          <div style={{ fontSize: 22, color: "#A9812E", marginBottom: 24 }}>
            ₹{watch.price ? watch.price.toLocaleString("en-IN") : "0"}
          </div>
          <p style={{ color: "#3A3B40", lineHeight: 1.7, marginBottom: 28, maxWidth: "44ch" }}>
            {watch.description}
          </p>

          {[
            ["Case Size", watch.caseSize ? `${watch.caseSize}mm` : "—"],
            ["Strap", watch.strapMaterial || "—"],
            ["Movement", watch.movementType || "—"],
            ["Gender", watch.gender || "—"],
            ["Availability", watch.stock > 0 ? `${watch.stock} in stock` : "Out of stock"],
          ].map(([label, value]) => (
            <div key={label} style={{
              display: "flex", justifyContent: "space-between", padding: "12px 0",
              borderTop: "1px solid #E3DFD3", fontSize: 13, textTransform: "capitalize"
            }}>
              <span style={{ color: "#3A3B40" }}>{label}</span>
              <span style={{ color: "#15161A", fontWeight: 500 }}>{value}</span>
            </div>
          ))}

          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            <button className="btn" onClick={handleAddToCart} disabled={!watch.stock || watch.stock === 0}>
              {added ? "Added ✓" : "Add to Cart"}
            </button>
            <a href="tel:+13105550182" className="btn" style={{
              background: "transparent", color: "#15161A", textAlign: "center", textDecoration: "none"
            }}>
              Enquire: +1 (310) 555-0182
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
