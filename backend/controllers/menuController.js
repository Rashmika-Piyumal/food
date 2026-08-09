const MenuItem = require("../models/MenuItem");

const getMenuByRestaurant = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurantId: req.params.restaurantId });
    res.status(200).json({ success: true, data: menuItems, message: "Menu items fetched" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.create(req.body);
    res.status(201).json({ success: true, data: menuItem, message: "Menu item created" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!menuItem) {
      return res.status(404).json({ success: false, data: null, message: "Menu item not found" });
    }
    res.status(200).json({ success: true, data: menuItem, message: "Menu item updated" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ success: false, data: null, message: "Menu item not found" });
    }
    res.status(200).json({ success: true, data: null, message: "Menu item deleted" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

module.exports = { getMenuByRestaurant, createMenuItem, updateMenuItem, deleteMenuItem };
