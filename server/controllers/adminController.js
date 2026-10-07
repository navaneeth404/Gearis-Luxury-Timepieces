import * as adminService from "../services/adminService.js";

export const getStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleBlock = async (req, res) => {
  try {
    const user = await adminService.toggleBlockUser(req.params.userId);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await adminService.getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await adminService.updateOrderStatus(req.params.orderId, status);
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


