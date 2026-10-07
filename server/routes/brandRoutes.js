import express from "express";
import { getBrands, addBrand, editBrand, removeBrand } from "../controllers/brandController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBrands);

router.post("/", protect, adminOnly, addBrand);
router.put("/:id", protect, adminOnly, editBrand);
router.delete("/:id", protect, adminOnly, removeBrand);

export default router;