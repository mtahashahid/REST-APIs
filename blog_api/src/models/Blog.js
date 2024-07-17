const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  tags: [String],
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  imageUrl: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
