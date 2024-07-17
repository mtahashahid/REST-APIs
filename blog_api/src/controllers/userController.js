const Blog = require("../models/Blog");

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ authorId: req.user._id });
    res.status(200).json({
      status: "success",
      blogs,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};