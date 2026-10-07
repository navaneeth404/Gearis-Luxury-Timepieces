import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  watch: { type: mongoose.Schema.Types.ObjectId, ref: "Watch", required: true },
  quantity: { type: Number, required: true },
  priceAtPurchase: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid", "shipped", "delivered", "cancelled"], default: "pending" },
      estimatedDelivery: { type: Date },

    shippingAddress: {
      line1: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },

    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;