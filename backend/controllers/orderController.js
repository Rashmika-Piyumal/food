const Cart = require("../models/Cart");
const Order = require("../models/Order");

const placeOrder = async (req, res) => {
  try {
    const { deliveryAddress } = req.body;

    if (!deliveryAddress) {
      return res.status(400).json({ success: false, data: null, message: "deliveryAddress is required" });
    }

    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.menuItemId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, data: null, message: "Cart is empty" });
    }

    const restaurantIds = new Set(cart.items.map((item) => item.menuItemId.restaurantId.toString()));
    if (restaurantIds.size > 1) {
      return res.status(400).json({ success: false, data: null, message: "Cart contains items from multiple restaurants" });
    }

    const items = cart.items.map((item) => ({
      menuItemId: item.menuItemId._id,
      name: item.menuItemId.name,
      price: item.menuItemId.price,
      quantity: item.quantity,
    }));

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      userId: req.user.id,
      restaurantId: cart.items[0].menuItemId.restaurantId,
      items,
      totalPrice,
      deliveryAddress,
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, data: order, message: "Order placed" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders, message: "Order history fetched" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

module.exports = { placeOrder, getOrderHistory };
