import express from "express";
import { updateMe, changeMyPassword, addMyAddress, updateMyAddress, deleteMyAddress } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/me", protect, updateMe);
router.put("/change-password", protect, changeMyPassword);
router.post("/addresses", protect, addMyAddress);
router.put("/addresses/:addressId", protect, updateMyAddress);
router.delete("/addresses/:addressId", protect, deleteMyAddress);

export default router;