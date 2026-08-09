const express = require("express");
const { placeOrder, getOrderHistory } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", placeOrder);
router.get("/", getOrderHistory);

module.exports = router;
