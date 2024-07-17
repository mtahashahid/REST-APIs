// src/controllers/blogController.js
const Blog = require("../models/Blog");
const { format } = require("date-fns");
const upload = require("../middleware/multer");


exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ state: "published" });
    const formattedBlogs = blogs.map((blog) => ({
      ...blog._doc,
      date: format(new Date(blog.date), "MMMM d, yyyy"),
    }));
    res.json(formattedBlogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog == null) {
      return res.status(404).json({ message: "Blog not found" });
    }
    const formattedBlog = {
      ...blog._doc,
      date: format(new Date(blog.date), "MMMM d, yyyy"),
    };
    res.json(formattedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBlog = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    const blog = new Blog({
      title: req.body.title,
      tags: req.body.tags,
      content: req.body.content,
      state: req.body.state,
      author: req.body.author,
      date: req.body.date,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    try {
      const newBlog = await blog.save();
      res.status(201).json(newBlog);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
};

exports.updateBlog = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    try {
      const blog = await Blog.findById(req.params.id);
      if (blog == null) {
        return res.status(404).json({ message: "Blog not found" });
      }

      if (req.body.title != null) {
        blog.title = req.body.title;
      }
      if (req.body.tags != null) {
        blog.tags = req.body.tags;
      }
      if (req.body.content != null) {
        blog.content = req.body.content;
      }
      if (req.body.state != null) {
        blog.state = req.body.state;
      }
      if (req.body.author != null) {
        blog.author = req.body.author;
      }
      if (req.body.date != null) {
        blog.date = req.body.date;
      }
      if (req.file != null) {
        blog.imageUrl = `/uploads/${req.file.filename}`;
      }

      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (blog == null) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json({ message: "Deleted Blog" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
