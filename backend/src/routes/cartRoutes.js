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

const { validate } = require("../middleware/validateMiddleware");

const {
  addToCartValidation,
  updateCartValidation,
} = require("../validations/cartValidation");

const router = express.Router();

// GET user cart
router.get("/", protect, getCart);
// Post add item to cart
router.post(
  "/",
  protect,
  addToCartValidation,
  validate,
  addToCart
);
// PUT update cartItem quantity
router.put(
  "/:productId",
  protect,
  updateCartValidation,
  validate,
  updateCartItem
);
// DELETE clear the cart
router.delete("/", protect, clearCart);
// DELETE remove item from the cart
router.delete("/:productId", protect, removeCartItem);

module.exports = router;