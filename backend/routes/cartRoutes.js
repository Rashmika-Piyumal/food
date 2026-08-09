const express = require("express");
const { getCart, addToCart, updateQuantity, removeItem } = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:menuItemId", updateQuantity);
router.delete("/:menuItemId", removeItem);

module.exports = router;
