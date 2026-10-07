import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import watchRoutes from "./routes/watchRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; 

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Gearis API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/watches", watchRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));