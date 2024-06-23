// src/controllers/blogController.js
const Blog = require('../models/Blog');

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog == null) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createBlog = async (req, res) => {
    const blog = new Blog({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    });

    try {
        const newBlog = await blog.save();
        res.status(201).json(newBlog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog == null) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (req.body.title != null) {
            blog.title = req.body.title;
        }
        if (req.body.content != null) {
            blog.content = req.body.content;
        }
        if (req.body.author != null) {
            blog.author = req.body.author;
        }

        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (blog == null) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json({ message: 'Deleted Blog' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
