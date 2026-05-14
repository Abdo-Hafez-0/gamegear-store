const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");


// POST /api/orders
const createOrder = asyncHandler(async (req, res) => {

  const {
    paymentMethod,
    shippingAddress,
  } = req.body;

  // Find user cart
  const cart = await Cart.findOne({
    user: req.user._id,
  }).populate("items.product");

  // Validate cart
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  let totalPrice = 0;

  const orderItems = [];

  // Loop through cart items
  for (const item of cart.items) {

    const product = await Product.findById(
      item.product._id
    );

    // Product deleted
    if (!product) {
      res.status(404);
      throw new Error(
        `Product not found`
      );
    }

    // Out of stock
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(
        `${product.title} is out of stock`
      );
    }

    // Calculate subtotal
    totalPrice +=
      product.price * item.quantity;

    // Prepare order item
    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
    });

    // Reduce stock
    product.stock -= item.quantity;

    await product.save();
  }

  // Create order
  const order = await Order.create({
    user: req.user._id,

    items: orderItems,

    totalPrice,

    paymentMethod,

    shippingAddress,
  });

  // Clear cart
  cart.items = [];

  await cart.save();

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });

});


// GET /api/orders
const getOrders = asyncHandler(async (req, res) => {

  const orders = await Order.find({
    user: req.user._id,
  })
    .populate("items.product")
    .sort({ createdAt: -1 });

  if (orders.length === 0) {

    return res.status(200).json({
      success: true,
      message: "No orders yet!  :(",
      data: {
        items: [],
      },
    });

  }

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    count: orders.length,
    data: orders,
  });

});


const getAllOrders = asyncHandler(async (req, res) => {

  const page = Number(req.query.page >= 1 ? req.query.page : 1);

  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  // Total orders count
  const totalOrders = await Order.countDocuments();

  // Paginated orders
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("items.product")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    message: "All orders fetched successfully",

    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      limit,
    },

    count: orders.length,

    data: orders,
  });

});


const updateOrderStatus = asyncHandler(async (req, res) => {

  const { orderStatus } = req.body;

  const order = await Order.findById(
    req.params.id
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Allowed statuses
  const allowedStatuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
  ];

  if (!allowedStatuses.includes(orderStatus)) {
    res.status(400);
    throw new Error("Invalid order status");
  }

  order.orderStatus = orderStatus;

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order status updated",
    data: order,
  });

});


module.exports = {
  createOrder,
  getOrders,
  getAllOrders,
  updateOrderStatus
};