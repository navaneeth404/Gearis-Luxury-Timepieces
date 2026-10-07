import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

export default function WatchForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({
    name: "", brand: "", gender: "men", caseSize: 40,
    strapMaterial: "metal", movementType: "automatic",
    price: "", stock: "", description: "", isFeatured: false,
  });
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/brands").then((res) => setBrands(res.data)).catch(() => setBrands([]));

    if (isEdit) {
      api.get(`/watches/${id}`).then((res) => {
        const w = res.data;
        setForm({
          name: w.name, brand: w.brand?._id || "", gender: w.gender, caseSize: w.caseSize,
          strapMaterial: w.strapMaterial, movementType: w.movementType,
          price: w.price, stock: w.stock, description: w.description || "", isFeatured: w.isFeatured,
        });
        if (w.images?.[0]) setImageUrl(w.images[0]);
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const { data } = await api.post("/watches/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageUrl(data.imageUrl);
    } catch (err) {
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.brand || !form.price) {
      setError("Please fill in name, brand, and price.");
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      caseSize: Number(form.caseSize),
      images: imageUrl ? [imageUrl] : [],
    };

    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/watches/${id}`, payload);
      } else {
        await api.post("/watches", payload);
      }
      navigate("/watches");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save watch.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-side">
        <div className="admin-brand">Gearis <span style={{ fontSize: 11, color: "#8a877c" }}>Admin</span></div>
        <div className="admin-link" onClick={() => navigate("/dashboard")}>Dashboard</div>
        <div className="admin-link active" onClick={() => navigate("/watches")}>Manage Watches</div>
        <div className="admin-link" onClick={() => navigate("/orders")}>Manage Orders</div>
        <div className="admin-link" onClick={() => navigate("/users")}>Manage Users</div>
      </div>

      <div className="admin-main" style={{ maxWidth: 600 }}>
        <h1 style={{ fontSize: 28, marginBottom: 26 }}>{isEdit ? "Edit Watch" : "Add Watch"}</h1>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Image</label>
            {imageUrl && <img src={imageUrl} alt="Watch" style={{ width: 120, height: 120, objectFit: "cover", marginBottom: 10, display: "block" }} />}
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {uploading && <p style={{ fontSize: 12, color: "#A9812E" }}>Uploading...</p>}
          </div>

          <div className="form-group">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Brand</label>
            <select name="brand" value={form.brand} onChange={handleChange} style={{ width: "100%", padding: 13, border: "1px solid #c9c4b4" }}>
              <option value="">Select a brand</option>
              {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} style={{ width: "100%", padding: 13, border: "1px solid #c9c4b4" }}>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          <div className="form-group">
            <label>Case Size (mm)</label>
            <input name="caseSize" type="number" value={form.caseSize} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Strap Material</label>
            <select name="strapMaterial" value={form.strapMaterial} onChange={handleChange} style={{ width: "100%", padding: 13, border: "1px solid #c9c4b4" }}>
              <option value="leather">Leather</option>
              <option value="metal">Metal</option>
              <option value="rubber">Rubber</option>
            </select>
          </div>

          <div className="form-group">
            <label>Movement</label>
            <select name="movementType" value={form.movementType} onChange={handleChange} style={{ width: "100%", padding: 13, border: "1px solid #c9c4b4" }}>
              <option value="automatic">Automatic</option>
              <option value="quartz">Quartz</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price (₹)</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input name="description" value={form.description} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} style={{ marginRight: 8 }} />Featured</label>
          </div>

          <button className="btn" type="submit" disabled={saving || uploading}>
            {saving ? "Saving..." : isEdit ? "Update Watch" : "Create Watch"}
          </button>
        </form>
      </div>
    </div>
  );
}