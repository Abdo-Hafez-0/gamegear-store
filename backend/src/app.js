const express = require("express");
const cors = require("cors");
const path = require("path");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Static — serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;