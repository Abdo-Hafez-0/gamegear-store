const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles  = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const {
  createProductValidation,
  updateProductValidation,
} = require("../validations/productValidation");

// Public
router.get("/getProducts", getProducts);
router.get("/getProductById/:id", getProductById);

// Admin only
router.post(
  "/createProduct",
  protect,
  authorizeRoles("admin"),
  upload.array("images", 10),
  createProductValidation,
  validate,
  createProduct
);

router.put(
  "/updateProduct/:id",
  protect,
  authorizeRoles("admin"),
  upload.array("images", 10),
  updateProductValidation,
  validate,
  updateProduct
);

router.delete(
  "/deleteProduct/:id",
  protect,
  authorizeRoles("admin"),
  deleteProduct
);

module.exports = router;