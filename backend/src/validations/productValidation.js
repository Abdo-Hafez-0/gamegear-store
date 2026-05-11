const { body } = require("express-validator");

const createProductValidation = [
  body("title")
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 2, max: 200 })
    .withMessage("Title must be between 2 and 200 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be 0 or a positive integer"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ObjectId"),

  body("brand")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Brand cannot exceed 100 characters"),

  body("description")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),

  body("specifications.dpi")
    .optional()
    .isInt({ min: 0 })
    .withMessage("DPI must be a positive integer"),
];

const updateProductValidation = [
  body("title")
    .optional()
    .isLength({ min: 2, max: 200 })
    .withMessage("Title must be between 2 and 200 characters"),

  body("price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be 0 or a positive integer"),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ObjectId"),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),

  body("specifications.dpi")
    .optional()
    .isInt({ min: 0 })
    .withMessage("DPI must be a positive integer"),
];

module.exports = { createProductValidation, updateProductValidation };