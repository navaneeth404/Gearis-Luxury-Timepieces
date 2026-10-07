import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const ADMIN_EMAIL = "adminemail@gmail.com";
const ADMIN_PASSWORD = "654321";
const ADMIN_NAME = "Gearis Admin";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log("Admin account already exists. Updating role to admin just in case...");
      existing.role = "admin";
      existing.isVerified = true;
      await existing.save();
      console.log("Done. Existing account is now role: admin");
    } else {
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
        isVerified: true,
      });
      console.log("Admin account created successfully.");
    }

    console.log(`\nAdmin login credentials:\nEmail: ${ADMIN_EMAIL}\nPassword: ${ADMIN_PASSWORD}`);
  } catch (err) {
    console.error("Error seeding admin:", err.message);
  } finally {
    mongoose.disconnect();
  }
};

seedAdmin();