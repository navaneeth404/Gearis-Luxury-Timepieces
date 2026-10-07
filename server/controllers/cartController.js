import * as cartService from "../services/cartService.js";

export const getMyCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user._id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { watchId, quantity } = req.body;
    if (!watchId) {
      return res.status(400).json({ message: "watchId is required" });
    }
    const cart = await cartService.addItem(req.user._id, watchId, quantity || 1);
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await cartService.updateItemQuantity(req.user._id, req.params.itemId, quantity);
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const cart = await cartService.removeItem(req.user._id, req.params.itemId);
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};