const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
  adminDashboard,
} = require("../controllers/authController");

const {
  registerValidation,
  loginValidation,
} = require("../validations/authValidation");

const {
  protect,
} = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// Register
router.post("/register", registerValidation, registerUser);

// Login
router.post("/login", loginValidation, loginUser);

// Profile
router.get("/profile", protect, getProfile);

// Admin dashboard test
router.get("/admin", protect, authorizeRoles("admin"), adminDashboard);


module.exports = router;