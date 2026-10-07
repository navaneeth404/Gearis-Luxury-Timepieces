import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api";

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);

  // Countdown timer, matches the 1-minute OTP expiry on the backend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!email) {
    return (
      <div className="auth-wrap">
        <div className="auth-box">
          <p className="error-msg">No email found. Please register again.</p>
          <Link to="/register">Back to Register</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, otp });
      setSuccess("Email verified! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    try {
      await api.post("/auth/resend-otp", { email });
      setSuccess("A new OTP has been sent.");
      setResendCooldown(60);
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend OTP.");
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h1>Verify Your Email</h1>
        <div className="sub">Enter the 6-digit code sent to {email}</div>

        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <div className="form-group">
          <label>OTP Code</label>
          <input
            value={otp} onChange={(e) => setOtp(e.target.value)}
            placeholder="123456" maxLength={6}
          />
        </div>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <div className="auth-switch">
          {resendCooldown > 0 ? (
            <span>Resend available in {resendCooldown}s</span>
          ) : (
            <a onClick={handleResend} style={{ cursor: "pointer" }}>Resend OTP</a>
          )}
        </div>
      </form>
    </div>
  );
}