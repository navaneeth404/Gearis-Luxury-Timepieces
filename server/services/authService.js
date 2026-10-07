import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Generates a 6-digit OTP and an expiry timestamp 1 minute from now
const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 60 * 1000); // 60 seconds
  return { otp, otpExpiry };
};

export const registerUser = async ({ name, email, password, phone }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("An account with this email already exists");
  }

  const { otp, otpExpiry } = generateOTP();

  const user = await User.create({
    name,
    email,
    password,
    phone,
    otp,
    otpExpiry,
    isVerified: false,
  });

  return { user, otp };
};

export const verifyOTP = async (email, otp) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Account not found");
  if (user.isVerified) throw new Error("Account already verified");

  if (!user.otp || !user.otpExpiry) {
    throw new Error("No OTP requested. Please request a new one.");
  }
  if (new Date() > user.otpExpiry) {
    throw new Error("OTP has expired. Please request a new one.");
  }
  if (user.otp !== otp) {
    throw new Error("Incorrect OTP");
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return user;
};

export const resendOTP = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Account not found");
  if (user.isVerified) throw new Error("Account already verified");

  const { otp, otpExpiry } = generateOTP();
  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  return { user, otp };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  if (user.isBlocked) {
    throw new Error("This account has been blocked. Contact support.");
  }
  if (!user.isVerified) {
    throw new Error("Please verify your email before logging in");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new Error("Invalid email or password");

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};