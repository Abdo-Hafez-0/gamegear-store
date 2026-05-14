const { body } = require("express-validator");

const addToCartValidation = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID"),
];

const updateCartValidation = [
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be greater than 0"),
];

module.exports = {
  addToCartValidation,
  updateCartValidation,
};