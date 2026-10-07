import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("gearisUser") || "null");

  useEffect(() => {
    if (!user) return;
    api.get("/cart")
      .then((res) => setCartCount(res.data.items.reduce((sum, i) => sum + i.quantity, 0)))
      .catch(() => {});
  }, []);

  // Close the dropdown if you click anywhere outside it
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("gearisUser");
    navigate("/login");
  };

  const initial = user?.name?.charAt(0).toUpperCase() || "?";

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px 48px", borderBottom: "1px solid #E3DFD3", background: "#F6F3EC"
    }}>
      <div onClick={() => navigate("/")} style={{ cursor: "pointer", lineHeight: 1 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24 }}>Gearis</div>
        <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "#3A3B40" }}>LUXURY TIMEKEEPERS</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 32, fontSize: 14, color: "#3A3B40" }}>
        <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Home</span>
        <span onClick={() => navigate("/shop")} style={{ cursor: "pointer" }}>Shop</span>
        <form onSubmit={handleSearch} style={{ display: "flex" }}>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search watches..."
            style={{
              padding: "8px 12px", border: "1px solid #c9c4b4", fontSize: 13,
              fontFamily: "inherit", width: 180
            }}
          />
        </form>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div onClick={() => navigate("/cart")} style={{ position: "relative", cursor: "pointer", fontSize: 20 }}>
          🛒
          {cartCount > 0 && (
            <span style={{
              position: "absolute", top: -8, right: -10, background: "#A9812E", color: "#fff",
              fontSize: 10, width: 16, height: 16, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              {cartCount}
            </span>
          )}
        </div>

        <div ref={menuRef} style={{ position: "relative" }}>
          <div
            onClick={() => setOpen(!open)}
            style={{
              width: 38, height: 38, borderRadius: "50%", background: "#15161A",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 14, fontFamily: "'Cormorant Garamond', serif"
            }}
          >
            {initial}
          </div>

          {open && (
            <div style={{
              position: "absolute", right: 0, top: 48, background: "#fff",
              border: "1px solid #E3DFD3", width: 180, boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
            }}>
              <div style={{ padding: "12px 16px", fontSize: 13, color: "#3A3B40", borderBottom: "1px solid #E3DFD3" }}>
                {user?.name}
              </div>
              <div
                onClick={() => { setOpen(false); navigate("/profile"); }}
                style={{ padding: "12px 16px", fontSize: 14, cursor: "pointer" }}
              >
                Profile
              </div>
              <div
                onClick={() => { setOpen(false); navigate("/orders"); }}
                style={{ padding: "12px 16px", fontSize: 14, cursor: "pointer" }}
              >
                My Orders
              </div>
              <div
                onClick={handleLogout}
                style={{ padding: "12px 16px", fontSize: 14, cursor: "pointer", color: "#72243E" }}
              >
                Log Out
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}