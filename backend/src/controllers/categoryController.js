const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    data: categories,
  });
});

// POST /api/categories
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const image = req.file ? req.file.path : undefined;

  const category = await Category.create({ name, description, image });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

// PUT /api/categories/:id
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const category = await Category.findById(req.params.id);
  if (!category) throw new Error("Category not found");

  if (name) category.name = name;
  if (description !== undefined) category.description = description;
  if (req.file) category.image = req.file.path;

  await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

// DELETE /api/categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new Error("Category not found");

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    data: null,
  });
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};