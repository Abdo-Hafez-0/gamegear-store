const express = require("express");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require("../controllers/cartController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// GET user cart
router.get("/", protect, getCart);
// Post add item to cart
router.post("/", protect, addToCart);
// PUT update cartItem quantity
router.put("/:productId", protect, updateCartItem);
// DELETE clear the cart
router.delete("/", protect, clearCart);
// DELETE remove item from the cart
router.delete("/:productId", protect, removeCartItem);

module.exports = router;