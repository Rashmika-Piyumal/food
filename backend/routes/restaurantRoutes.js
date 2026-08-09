const express = require("express");
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);

router.post("/", authMiddleware, adminMiddleware, createRestaurant);
router.put("/:id", authMiddleware, adminMiddleware, updateRestaurant);
router.delete("/:id", authMiddleware, adminMiddleware, deleteRestaurant);

module.exports = router;
