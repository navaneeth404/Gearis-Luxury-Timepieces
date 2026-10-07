import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema({
  label: { type: String, default: "Home" },
  line1: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    password: { type: String }, // not required: Google-auth users won't have one
    role: { type: String, enum: ["customer", "admin"], default: "customer" },

    // Email verification (OTP flow)
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },

    // Google authentication
    googleId: { type: String },

    // Admin: block/unblock
    isBlocked: { type: Boolean, default: false },

    // Address management
    addresses: [addressSchema],
  },
  { timestamps: true }
);

// Hash the password before saving, but only if it changed and exists
userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to check a plain-text password against the hashed one
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;