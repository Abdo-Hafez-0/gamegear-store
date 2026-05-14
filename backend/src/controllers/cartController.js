const Cart = require("../models/Cart");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/cart
const getCart = asyncHandler(async (req, res) => {

  // Find user's cart
  const cart = await Cart.findOne({
    user: req.user._id,
  }).populate("items.product");

  // If user has no cart yet
  if (!cart) {

    return res.status(200).json({
      success: true,
      message: "Cart is empty",
      data: {
        items: [],
      },
    });

  }

  res.status(200).json({
    success: true,
    message: "Cart fetched successfully",
    data: cart,
  });

});


// POST /api/cart
const addToCart = asyncHandler(async (req, res) => {

  const { productId } = req.body;

  // Check product exists
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Find user cart
  let cart = await Cart.findOne({
    user: req.user._id,
  });

  // If cart doesn't exist create one
  if (!cart) {

    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });

  }

  // Check if product already exists in cart
  const existingItem = cart.items.find(
    (item) =>
      item.product.toString() === productId
  );

  if (existingItem) {

  if (existingItem.quantity + 1 > product.stock) {
    res.status(400);
    throw new Error("Requested quantity exceeds stock");
  }

  existingItem.quantity += 1;

} else {

  if (product.stock < 1) {
    res.status(400);
    throw new Error("Product is out of stock");
  }

  cart.items.push({
    product: productId,
    quantity: 1,
  });

}

  await cart.save();

  // Populate product details
  await cart.populate("items.product");

  res.status(200).json({
    success: true,
    message: "Product added to cart",
    data: cart,
  });

});


// PUT /api/cart/:productId
const updateCartItem = asyncHandler(async (req, res) => {

  const { quantity } = req.body;

  const { productId } = req.params;

  // Validate quantity
  if (!quantity || quantity < 1) {
    res.status(400);
    throw new Error("Quantity must be greater than 0");
  }

  // Check product exists
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check stock
  if (quantity > product.stock) {
    res.status(400);
    throw new Error("Requested quantity exceeds stock");
  }

  // Find user cart
  const cart = await Cart.findOne({
    user: req.user._id,
  });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  // Find cart item
  const item = cart.items.find(
    (item) =>
      item.product.toString() === productId
  );

  if (!item) {
    res.status(404);
    throw new Error("Product not found in cart");
  }

  // Update quantity
  item.quantity = quantity;

  await cart.save();

  await cart.populate("items.product");

  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    data: cart,
  });

});


// DELETE /api/cart/:productId
const removeCartItem = asyncHandler(async (req, res) => {

  const { productId } = req.params;

  // Find cart
  const cart = await Cart.findOne({
    user: req.user._id,
  });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  // Check item exists
  const itemExists = cart.items.find(
    (item) =>
      item.product.toString() === productId
  );

  if (!itemExists) {
    res.status(404);
    throw new Error("Product not found in cart");
  }

  // Remove item
  cart.items = cart.items.filter(
    (item) =>
      item.product.toString() !== productId
  );

  await cart.save();

  await cart.populate("items.product");

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
    data: cart,
  });

});


// 
const clearCart = asyncHandler(async (req, res) => {

  const cart = await Cart.findOne({
    user: req.user._id,
  });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = [];

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
    data: cart,
  });

});



module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};