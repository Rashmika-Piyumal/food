const Cart = require("../models/Cart");
const MenuItem = require("../models/MenuItem");

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.menuItemId");
    res.status(200).json({ success: true, data: cart || { userId: req.user.id, items: [] }, message: "Cart fetched" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body;

    if (!menuItemId || !quantity) {
      return res.status(400).json({ success: false, data: null, message: "menuItemId and quantity are required" });
    }

    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ success: false, data: null, message: "Menu item not found" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const existingItem = cart.items.find((item) => item.menuItemId.toString() === menuItemId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ menuItemId, quantity });
    }

    await cart.save();
    await cart.populate("items.menuItemId");

    res.status(200).json({ success: true, data: cart, message: "Item added to cart" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { menuItemId } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, data: null, message: "A valid quantity is required" });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, data: null, message: "Cart not found" });
    }

    const item = cart.items.find((item) => item.menuItemId.toString() === menuItemId);
    if (!item) {
      return res.status(404).json({ success: false, data: null, message: "Item not in cart" });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.menuItemId");

    res.status(200).json({ success: true, data: cart, message: "Quantity updated" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const removeItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, data: null, message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.menuItemId.toString() !== menuItemId);
    await cart.save();
    await cart.populate("items.menuItemId");

    res.status(200).json({ success: true, data: cart, message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

module.exports = { getCart, addToCart, updateQuantity, removeItem };
