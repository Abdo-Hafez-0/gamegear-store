const express = require("express");

const {
  createOrder,
  getOrders,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const {
  protect,
} = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const { validate } = require("../middleware/validateMiddleware");

const {
  createOrderValidation,
  updateOrderStatusValidation,
} = require("../validations/orderValidation");

const router = express.Router();

// POST Create order
router.post(
  "/",
  protect,
  createOrderValidation,
  validate,
  createOrder
);
// GET get user orders
router.get("/", protect, getOrders);

router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  getAllOrders
);

// PUT update order status
// admin only
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateOrderStatusValidation,
  validate,
  updateOrderStatus
);

module.exports = router;