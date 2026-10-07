import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [watches, setWatches] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  useEffect(() => {
    api.get("/brands").then((res) => setBrands(res.data)).catch(() => setBrands([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    const search = searchParams.get("search");
    if (search) params.search = search;
    if (selectedBrand) params.brand = selectedBrand;
    if (selectedGender) params.gender = selectedGender;

    api.get("/watches", { params })
      .then((res) => setWatches(res.data))
      .catch(() => setWatches([]))
      .finally(() => setLoading(false));
  }, [searchParams, selectedBrand, selectedGender]);

  const handleAddToCart = async (e, watchId) => {
    e.stopPropagation();
    await api.post("/cart", { watchId, quantity: 1 });
    setAddedId(watchId);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F6F3EC" }}>
      <Navbar />

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 40, padding: 40 }}>
        {/* Filters */}
        <div>
          <h3 style={{ fontSize: 14, marginBottom: 16 }}>Filters</h3>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.1em", color: "#3A3B40", textTransform: "uppercase", marginBottom: 10 }}>
              Brand
            </div>
            {brands.map((b) => (
              <label key={b._id} style={{ display: "block", fontSize: 14, padding: "4px 0", cursor: "pointer" }}>
                <input
                  type="radio" name="brand" checked={selectedBrand === b._id}
                  onChange={() => setSelectedBrand(b._id)}
                  style={{ marginRight: 8 }}
                />
                {b.name}
              </label>
            ))}
            {selectedBrand && (
              <span onClick={() => setSelectedBrand("")} style={{ fontSize: 12, color: "#A9812E", cursor: "pointer" }}>
                Clear
              </span>
            )}
          </div>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.1em", color: "#3A3B40", textTransform: "uppercase", marginBottom: 10 }}>
              Gender
            </div>
            {["men", "women", "unisex"].map((g) => (
              <label key={g} style={{ display: "block", fontSize: 14, padding: "4px 0", cursor: "pointer", textTransform: "capitalize" }}>
                <input
                  type="radio" name="gender" checked={selectedGender === g}
                  onChange={() => setSelectedGender(g)}
                  style={{ marginRight: 8 }}
                />
                {g}
              </label>
            ))}
            {selectedGender && (
              <span onClick={() => setSelectedGender("")} style={{ fontSize: 12, color: "#A9812E", cursor: "pointer" }}>
                Clear
              </span>
            )}
          </div>
        </div>

        {/* Results */}
        <div>
          <div style={{ fontSize: 13, color: "#3A3B40", marginBottom: 20 }}>
            {loading ? "Loading..." : `${watches.length} timepiece${watches.length !== 1 ? "s" : ""}`}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26 }}>
            {watches.map((watch) => (
              <div key={watch._id} style={{ cursor: "pointer" }}>
                <div onClick={() => navigate(`/watch/${watch._id}`)} style={{
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
                <div onClick={() => navigate(`/watch/${watch._id}`)} style={{ fontSize: 11, color: "#3A3B40", textTransform: "uppercase", marginBottom: 4 }}>
                  {watch.brand?.name}
                </div>
                <div onClick={() => navigate(`/watch/${watch._id}`)} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, marginBottom: 4 }}>
                  {watch.name}
                </div>
                <div style={{ fontSize: 14, color: "#3A3B40", marginBottom: 10 }}>
                  ₹{watch.price.toLocaleString("en-IN")}
                </div>
                <button
                  className="btn"
                  style={{ padding: "8px 0", fontSize: 12 }}
                  onClick={(e) => handleAddToCart(e, watch._id)}
                >
                  {addedId === watch._id ? "Added ✓" : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}