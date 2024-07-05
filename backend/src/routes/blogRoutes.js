const express = require("express");
const blogRoute = express.Router();
const Blog = require("../models/blogModel");
const User = require("../models/userModel");

const { verifyToken } = require("../middlewares/index");

blogRoute.post("/create-blog", verifyToken, async (req, res) => {
  try {
    const blogData = req.body;
    const user_email = req.user.email;

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
        return res
          .status(400)
          .json({
            message: "Description should be at least 20 characters long",
          });
    }

    if (!user_email) {
      return res.status(400).json({ message: "User email not found" });
    }

    const user = await User.findOne({ email: user_email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const blog = new Blog({
      title: blogData.title,
      content: blogData.description,
      author: user._id,
    });

    const savedBlog = await blog.save();

    const populatedBlog = await Blog.findById(savedBlog._id).populate("author");
    res
      .status(201)
      .json({ message: "Blog created successfully", blog: populatedBlog });
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
    const id = req.params.id;
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
blogRoute.get("/get-user-blogs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const blog = await Blog.find({
      author: id,
    });
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

blogRoute.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const blog = await Blog.findByIdAndDelete({
      _id: id,
    });
    console.log(blog);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});
blogRoute.put("/update/:id",verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const blog = await Blog.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
        },
      }
    );
    console.log(blog);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog Updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

module.exports = blogRoute;
