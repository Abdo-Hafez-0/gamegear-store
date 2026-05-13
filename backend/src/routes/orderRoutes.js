const express = require("express");

const {
  createOrder,
  getOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const {
  protect,
} = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// POST Create order
router.post("/", protect, createOrder);
// GET get user orders
router.get("/", protect, getOrders);

// PUT update order status
// admin only
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateOrderStatus
);

module.exports = router;