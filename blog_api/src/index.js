const express = require("express");  // Import Express framework
const mongoose = require("mongoose");  // Import Mongoose for MongoDB interaction
const app = express();  // Initialize Express app
const cors = require('cors');  // Import CORS for handling cross-origin requests
const PORT = process.env.PORT || 5000;  // Define the port number (use environment variable or default to 5000)
const blogRoutes = require('./routes/blogRoutes');  // Import blog routes
const userRouter = require('./routes/userRoutes')

// Middleware
app.use(express.json());  // Middleware to parse JSON request bodies

// CORS
app.use(cors());  // Middleware to enable CORS for all routes

// Routes
app.use("/api", userRouter)
app.use('/api/blogs', blogRoutes);  // Middleware to use blog routes for '/api/blogs' endpoint
app.use("/uploads", express.static("uploads"));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);  // Log server start message with port number
});

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/blogdb", {
    serverSelectionTimeoutMS: 3000,  // Set server selection timeout to 3000ms
  })
  .then(() => console.log("MongoDB connected"))  // Log success message if connection is successful
  .catch((err) => console.log(err));  // Log error message if connection fails
