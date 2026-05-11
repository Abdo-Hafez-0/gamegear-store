const Product = require("../models/Product");
const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");

// GET /api/products  (filtering + search)
const getProducts = asyncHandler(async (req, res) => {
  const { category, brand, minPrice, maxPrice, search } = req.query;

  const filter = {};

  // Category filter — accepts ObjectId or category name
  if (category) {
    if (mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    } else {
      const cat = await Category.findOne({
        name: { $regex: category, $options: "i" },
      });
      if (cat) filter.category = cat._id;
      else filter.category = null; // returns empty list
    }
  }

  // Brand filter (case-insensitive)
  if (brand) {
    filter.brand = { $regex: brand, $options: "i" };
  }

  // Price range filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Title search
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const products = await Product.find(filter)
    .populate("category", "name")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    count: products.length,
    data: products,
  });
});

// GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name description")
    .populate("createdBy", "name email");

  if (!product) throw new Error("Product not found");

  res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    data: product,
  });
});

// POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    stock,
    brand,
    category,
    rating,
    specifications,
  } = req.body;

  // Verify category exists
  const cat = await Category.findById(category);
  if (!cat) throw new Error("Category not found");

  // Handle uploaded images
  const images = req.files ? req.files.map((f) => f.path) : [];

  const product = await Product.create({
    title,
    description,
    price,
    stock,
    brand,
    category,
    images,
    rating,
    specifications:
      typeof specifications === "string"
        ? JSON.parse(specifications)
        : specifications,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

// PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new Error("Product not found");

  const {
    title,
    description,
    price,
    stock,
    brand,
    category,
    rating,
    specifications,
  } = req.body;

  if (category) {
    const cat = await Category.findById(category);
    if (!cat) throw new Error("Category not found");
    product.category = category;
  }

  if (title !== undefined) product.title = title;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;
  if (brand !== undefined) product.brand = brand;
  if (rating !== undefined) product.rating = rating;

  if (specifications) {
    const parsed =
      typeof specifications === "string"
        ? JSON.parse(specifications)
        : specifications;
    product.specifications = { ...product.specifications, ...parsed };
  }

  // Append newly uploaded images (or replace — here we append)
  if (req.files && req.files.length > 0) {
    product.images = [...product.images, ...req.files.map((f) => f.path)];
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

// DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new Error("Product not found");

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    data: null,
  });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};