import express from "express";
import { getStats, getUsers, toggleBlock, getOrders, updateOrder } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.put("/users/:userId/toggle-block", toggleBlock);
router.get("/orders", getOrders);
router.put("/orders/:orderId", updateOrder);

export default router;


// import express from "express";
// import { protect, adminOnly } from "../middleware/authMiddleware.js";
// import {
//   getAdminStats,
//   getAdminUsers,
//   toggleBlockUser,
//   getAdminOrders,
//   changeOrderStatus,
// } from "../controllers/adminController.js";

// const router = express.Router();

// router.use(protect, adminOnly);

// router.get("/stats", getAdminStats);
// router.get("/users", getAdminUsers);
// router.put("/users/:userId/toggle-block", toggleBlockUser);
// router.get("/orders", getAdminOrders);
// router.put("/orders/:orderId", changeOrderStatus);

// export default router;