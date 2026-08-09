const express = require("express");
const {
  getMenuByRestaurant,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/:restaurantId", getMenuByRestaurant);

router.post("/", authMiddleware, adminMiddleware, createMenuItem);
router.put("/:id", authMiddleware, adminMiddleware, updateMenuItem);
router.delete("/:id", authMiddleware, adminMiddleware, deleteMenuItem);

module.exports = router;
