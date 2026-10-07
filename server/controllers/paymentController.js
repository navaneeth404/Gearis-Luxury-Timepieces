import * as paymentService from "../services/paymentService.js";

export const createOrder = async (req, res) => {
  try {
    const { razorpayOrder, totalAmount } = await paymentService.createRazorpayOrder(req.user._id);
    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      totalAmount,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Create order error:", err);
    const message = err?.error?.description || err?.message || "Could not create payment order";
    res.status(400).json({ message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const order = await paymentService.verifyAndCreateOrder(req.user._id, req.body);
    res.json({ message: "Payment verified, order placed.", order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await paymentService.getMyOrders(req.user._id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getOrder = async (req, res) => {
  try {
    const order = await paymentService.getOrderById(req.user._id, req.params.orderId);
    res.json(order);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await paymentService.cancelOrder(req.user._id, req.params.orderId);
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};