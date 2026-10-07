import express from "express";
import { getWatches, getFeatured, getWatch, addWatch, editWatch, removeWatch } from "../controllers/watchController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getWatches);
router.get("/featured", getFeatured);
router.get("/:id", getWatch);

router.post("/upload-image", protect, adminOnly, upload.single("image"), (req, res) => {
  res.json({ imageUrl: req.file.path });
});

router.post("/", protect, adminOnly, addWatch);
router.put("/:id", protect, adminOnly, editWatch);
router.delete("/:id", protect, adminOnly, removeWatch);

export default router;