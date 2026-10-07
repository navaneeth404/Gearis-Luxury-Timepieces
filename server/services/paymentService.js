import crypto from "crypto";
import razorpayInstance from "../config/razorpay.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Watch from "../models/Watch.js";

// Step 1: Create a Razorpay order for the user's current cart total
export const createRazorpayOrder = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.watch");
  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty");
  }

  const totalAmount = cart.items.reduce(
    (sum, item) => sum + item.watch.price * item.quantity,
    0
  );

  // Razorpay expects the amount in the smallest currency unit (paise, not rupees)
  const razorpayOrder = await razorpayInstance.orders.create({
    amount: Math.round(totalAmount * 100),
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  return { razorpayOrder, totalAmount, cart };
};

// Step 2: Verify the payment signature Razorpay sends back after checkout completes
export const verifyAndCreateOrder = async (userId, { razorpay_order_id, razorpay_payment_id, razorpay_signature, shippingAddress }) => {
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    throw new Error("Payment verification failed");
  }

  const cart = await Cart.findOne({ user: userId }).populate("items.watch");
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const orderItems = cart.items.map((item) => ({
    watch: item.watch._id,
    quantity: item.quantity,
    priceAtPurchase: item.watch.price,
  }));

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );

    const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    status: "paid",
    shippingAddress,
    estimatedDelivery,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
  });

  // Reduce stock for each purchased watch
  for (const item of cart.items) {
    await Watch.findByIdAndUpdate(item.watch._id, { $inc: { stock: -item.quantity } });
  }

  // Clear the cart now that the order is placed
  cart.items = [];
  await cart.save();

  return order;
};

export const getMyOrders = async (userId) => {
  return Order.find({ user: userId }).populate("items.watch").sort({ createdAt: -1 });
};


export const getOrderById = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, user: userId }).populate("items.watch");
  if (!order) throw new Error("Order not found");
  return order;
};

export const cancelOrder = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new Error("Order not found");

  if (["shipped", "delivered", "cancelled"].includes(order.status)) {
    throw new Error(`Cannot cancel an order that is already ${order.status}`);
  }

  order.status = "cancelled";
  await order.save();
  return order;
};