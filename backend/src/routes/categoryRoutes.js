const express = require("express");
const router = express.Router();

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const {
  createCategoryValidation,
  updateCategoryValidation,
} = require("../validations/categoryValidation");

// Public
router.get("/getCategories", getCategories);

// Admin only
router.post(
  "/createCategory",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  createCategoryValidation,
  validate,
  createCategory
);

router.put(
  "/updateCategory/:id",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  updateCategoryValidation,
  validate,
  updateCategory
);

router.delete(
  "/deleteCategory/:id",
  protect,
  authorizeRoles("admin"),
  deleteCategory
);

module.exports = router;