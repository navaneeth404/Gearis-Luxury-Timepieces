import Cart from "../models/Cart.js";

export const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.watch");
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

export const addItem = async (userId, watchId, quantity = 1) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  const existingItem = cart.items.find((item) => item.watch.toString() === watchId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ watch: watchId, quantity });
  }

  await cart.save();
  return Cart.findById(cart._id).populate("items.watch");
};

export const updateItemQuantity = async (userId, itemId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  const item = cart.items.id(itemId);
  if (!item) throw new Error("Item not found in cart");

  if (quantity <= 0) {
    item.deleteOne();
  } else {
    item.quantity = quantity;
  }

  await cart.save();
  return Cart.findById(cart._id).populate("items.watch");
};

export const removeItem = async (userId, itemId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  const item = cart.items.id(itemId);
  if (!item) throw new Error("Item not found in cart");

  item.deleteOne();
  await cart.save();
  return Cart.findById(cart._id).populate("items.watch");
};