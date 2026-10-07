import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/watches/featured")
      .then((res) => setFeatured(res.data))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F6F3EC" }}>
      <Navbar />

      {/* Hero */}
      <div style={{
        display: "grid", gridTemplateColumns: "1.1fr .9fr",
        borderBottom: "1px solid #E3DFD3"
      }}>
        <div style={{ padding: "90px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.16em", color: "#A9812E", marginBottom: 18 }}>
            SWISS-MADE · EST. HERITAGE
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, lineHeight: 1.1, maxWidth: "9ch", margin: "0 0 20px" }}>
            Time, engineered to last generations.
          </h1>
          <p style={{ color: "#3A3B40", maxWidth: "38ch", lineHeight: 1.6, marginBottom: 28 }}>
            A curated collection of Swiss-made luxury watches — from heritage dress pieces to modern automatics.
          </p>
          <button className="btn" style={{ width: 220 }} onClick={() => navigate("/shop")}>
            Explore the Collection
          </button>
        </div>
        <div style={{
          background: "linear-gradient(155deg,#1c1d22,#0e0e11)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <svg width="160" height="160" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="72" stroke="#C9A75C" strokeWidth="2"/>
            <circle cx="100" cy="100" r="60" stroke="#C9A75C" strokeWidth="1" opacity=".5"/>
            <line x1="100" y1="100" x2="100" y2="58" stroke="#F6F3EC" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="100" y1="100" x2="128" y2="112" stroke="#F6F3EC" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="100" cy="100" r="3" fill="#C9A75C"/>
          </svg>
        </div>
      </div>

      {/* Featured watches */}
      <div style={{ padding: "60px 48px" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, marginBottom: 30 }}>
          Featured Timepieces
        </h2>

        {loading && <p>Loading...</p>}
        {!loading && featured.length === 0 && <p>No featured watches yet.</p>}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {featured.map((watch) => (
            <div key={watch._id} style={{ cursor: "pointer" }} onClick={() => navigate(`/watch/${watch._id}`)}>
              <div style={{
                background: "#fff", border: "1px solid #E3DFD3", aspectRatio: "1/1.05",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, overflow: "hidden"
              }}>
                {watch.images?.[0] ? (
                  <img src={watch.images[0]} alt={watch.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="34" stroke="#A9812E" strokeWidth="2"/>
                    <line x1="50" y1="50" x2="50" y2="30" stroke="#15161A" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="50" y1="50" x2="63" y2="58" stroke="#15161A" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <div style={{ fontSize: 11, color: "#3A3B40", textTransform: "uppercase", marginBottom: 4 }}>
                {watch.brand?.name}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, marginBottom: 4 }}>
                {watch.name}
              </div>
              <div style={{ fontSize: 14, color: "#3A3B40" }}>
                 ₹{watch.price.toLocaleString("en-IN")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}