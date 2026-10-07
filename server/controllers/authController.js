import * as authService from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const { user, otp } = await authService.registerUser({ name, email, password, phone });

    // TEMPORARY: log OTP to the server console until email sending is wired up
    console.log(`OTP for ${email}: ${otp}`);

    res.status(201).json({
      message: "Account created. Please verify the OTP sent to your email.",
      email: user.email,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    await authService.verifyOTP(email, otp);
    res.json({ message: "Email verified successfully. You can now log in." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const { otp } = await authService.resendOTP(email);

    // TEMPORARY: log OTP to the server console until email sending is wired up
    console.log(`Resent OTP for ${email}: ${otp}`);

    res.json({ message: "A new OTP has been sent to your email." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter both email and password" });
    }

    const data = await authService.loginUser(email, password);
    res.json(data);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};