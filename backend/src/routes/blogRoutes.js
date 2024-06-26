const express = require("express");
const blogRoute = express.Router();
const Blog = require("../models/blogModel");

blogRoute.post("/create-blog", async (req, res) => {
  try {
    const blogData = req.body;
    // console.log(blogData);
    switch (true) {
      case !blogData.title && !blogData.description:
        return res
          .status(400)
          .json({ message: "Please provide title and description" });
      case !blogData.title:
        return res.status(400).json({ message: "Please provide a title" });
      case blogData.title.length < 10:
        return res
          .status(400)
          .json({ message: "Title should be at least 10 characters long" });
      case !blogData.description:
        return res
          .status(400)
          .json({ message: "Please provide a description" });
      case blogData.description.length < 20:
        return res.status(400).json({
          message: "Description should be at least 20 characters long",
        });
    }
    const blog = new Blog({
      title: blogData.title,
      content: blogData.description,
    });

    await blog.save();
    res.status(201).json({ message: "Blog created successfully", blog: blog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

blogRoute.get("/get-blogs", async (req, res) => {
  try {
    const blogs = await Blog.find({});
    if (!blogs.length) {
      return res.status(404).json({ message: "No blogs found" });
    }
    res.status(200).json({ blogs: blogs });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

blogRoute.get("/get-blogs/:id", async (req, res) => {
  try {
    const id=req.params.id;
    // console.log(id);
    const blog = await Blog.findById(id);
    // console.log(blog);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ blog: blog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

module.exports = blogRoute;
