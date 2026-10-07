import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [newAddress, setNewAddress] = useState({ label: "Home", line1: "", city: "", state: "", pincode: "", phone: "" });

  const loadUser = () => {
    api.get("/auth/me")
      .then((res) => {
        setUser(res.data);
        setProfileForm({ name: res.data.name, email: res.data.email, phone: res.data.phone || "" });
      })
      .catch(() => navigate("/login"));
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileError("");
    try {
      await api.put("/users/me", profileForm);
      setProfileMsg("Profile updated successfully.");
      loadUser();
    } catch (err) {
      setProfileError(err.response?.data?.message || "Update failed.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordError("");

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      await api.put("/users/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMsg("Password changed successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Password change failed.");
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    await api.post("/users/addresses", newAddress);
    setNewAddress({ label: "Home", line1: "", city: "", state: "", pincode: "", phone: "" });
    loadUser();
  };

  const handleDeleteAddress = async (addressId) => {
    await api.delete(`/users/addresses/${addressId}`);
    loadUser();
  };

  if (!user) return (
    <div style={{ minHeight: "100vh", background: "#F6F3EC" }}>
      <Navbar />
      <p style={{ padding: 48 }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F6F3EC" }}>
      <Navbar />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, marginBottom: 32 }}>
          Your Profile
        </h1>

        {/* Profile info */}
        <form onSubmit={handleProfileUpdate} style={{ background: "#fff", border: "1px solid #E3DFD3", padding: 28, marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, marginBottom: 18 }}>Account Details</h3>
          {profileMsg && <div className="success-msg">{profileMsg}</div>}
          {profileError && <div className="error-msg">{profileError}</div>}

          <div className="form-group">
            <label>Full Name</label>
            <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
          </div>
          <button className="btn" type="submit">Save Changes</button>
        </form>

        {/* Password change */}
        <form onSubmit={handlePasswordChange} style={{ background: "#fff", border: "1px solid #E3DFD3", padding: 28, marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, marginBottom: 18 }}>Change Password</h3>
          {passwordMsg && <div className="success-msg">{passwordMsg}</div>}
          {passwordError && <div className="error-msg">{passwordError}</div>}

          <div className="form-group">
            <label>Current Password</label>
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />
            <button type="button" className="password-toggle" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
              {showCurrentPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type={showNewPassword ? "text" : "password"}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />
            <button type="button" className="password-toggle" onClick={() => setShowNewPassword(!showNewPassword)}>
              {showNewPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type={showNewPassword ? "text" : "password"}
              value={passwordForm.confirmNewPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
            />
          </div>
          <button className="btn" type="submit">Update Password</button>
        </form>

        {/* Addresses */}
        <div style={{ background: "#fff", border: "1px solid #E3DFD3", padding: 28 }}>
          <h3 style={{ fontSize: 16, marginBottom: 18 }}>Saved Addresses</h3>

          {user.addresses?.map((addr) => (
            <div key={addr._id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #E3DFD3", fontSize: 14 }}>
              <div>
                <strong>{addr.label}</strong> — {addr.line1}, {addr.city}, {addr.state} {addr.pincode} · {addr.phone}
              </div>
              <span onClick={() => handleDeleteAddress(addr._id)} style={{ color: "#72243E", cursor: "pointer", fontSize: 12 }}>Delete</span>
            </div>
          ))}

          <form onSubmit={handleAddAddress} style={{ marginTop: 20 }}>
            <div className="form-group">
              <label>Label</label>
              <input value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Address Line</label>
              <input value={newAddress.line1} onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })} />
            </div>
            <div className="form-group">
              <label>City</label>
              <input value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
            </div>
            <div className="form-group">
              <label>State</label>
              <input value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Pincode</label>
              <input value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
            </div>
            <button className="btn" type="submit">Add Address</button>
          </form>
        </div>
      </div>
    </div>
  );
}