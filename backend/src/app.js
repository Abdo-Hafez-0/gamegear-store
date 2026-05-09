const express = require("express");
const cors = require("cors");

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);


module.exports = app;