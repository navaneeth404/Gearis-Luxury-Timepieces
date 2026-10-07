import express from "express";
import { getMyCart, addToCart, updateCartItem, removeCartItem } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyCart);
router.post("/", protect, addToCart);
router.put("/:itemId", protect, updateCartItem);
router.delete("/:itemId", protect, removeCartItem);

export default router;