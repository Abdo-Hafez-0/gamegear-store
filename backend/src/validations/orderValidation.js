const { body } = require("express-validator");

const createOrderValidation = [
  body("paymentMethod")
  .notEmpty()
  .withMessage("Payment method is required")
  .isIn([
    "Cash",
  ])
  .withMessage("Sorry only cash available now! ^_^"),

  body("shippingAddress")
    .notEmpty()
    .withMessage("Shipping address is required"),
];

const updateOrderStatusValidation = [
  body("orderStatus")
    .notEmpty()
    .withMessage("Order status is required")
    .isIn([
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
    ])
    .withMessage("Invalid order status"),
];

module.exports = {
  createOrderValidation,
  updateOrderStatusValidation,
};