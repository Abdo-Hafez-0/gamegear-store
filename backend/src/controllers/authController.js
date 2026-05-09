const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { validationResult } = require("express-validator");
const asyncHandler = require("../utils/asyncHandler");

// Register Controller
const registerUser = asyncHandler(async (req, res) => {

  // Validation Errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const {
    name,
    email,
    password,
    phone,
    address,
  } = req.body;


  // Check Existing User
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error("Email already exists");
  }


  // Hash Password
  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(
    password,
    salt
  );


  // Create User
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
  });


  // Generate JWT
  const token = generateToken(
    user._id,
    user.role
  );


  res.status(201).json({
    success: true,
    message: "User registered successfully",

    token,

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});


// Login Controller
const loginUser = asyncHandler(async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { email, password } = req.body;


  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Wrong email or password");
  }


  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    res.status(401);
    throw new Error("Wrong email or password");
  }


  const token = generateToken(
    user._id,
    user.role
  );


  res.status(200).json({
    success: true,
    message: "Login successful",

    token,

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});


// Profile Controller
const getProfile = asyncHandler(async (req, res) => {

  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    user: req.user,
  });

});


// Admin Dashbourd Test
const adminDashboard = asyncHandler(async (req, res) => {

  res.status(200).json({
    success: true,
    message: "Welcome Admin",
    user: req.user,
  });

});


module.exports = {
  registerUser,
  loginUser,
  getProfile,
  adminDashboard,
};