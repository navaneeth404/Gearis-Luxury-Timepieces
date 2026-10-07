import User from "../models/User.js";
import Order from "../models/Order.js";
import Watch from "../models/Watch.js";

export const getDashboardStats = async () => {
  const paidOrders = await Order.find({ status: { $in: ["paid", "shipped", "delivered"] } });

  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments({ role: "customer" });
  const totalWatches = await Watch.countDocuments();

  const recentOrders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(5);

  return { totalRevenue, totalOrders, totalUsers, totalWatches, recentOrders };
};

export const getAllUsers = async () => {
  return User.find({ role: "customer" }).select("-password").sort({ createdAt: -1 });
};

export const toggleBlockUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.isBlocked = !user.isBlocked;
  await user.save();
  return user;
};

export const getAllOrders = async () => {
  return Order.find().populate("user", "name email").populate("items.watch").sort({ createdAt: -1 });
};

export const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  order.status = status;
  await order.save();
  return order;
};