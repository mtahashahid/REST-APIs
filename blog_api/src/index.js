const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;
const blogRoutes = require('./routes/blogRoutes');

// Middleware
app.use(express.json());

// Routes
app.use('/api/blogs', blogRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/blogdb", {
    serverSelectionTimeoutMS: 3000,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
