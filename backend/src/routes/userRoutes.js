const express = require("express");
const userRoute = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/userModel.js");
const { generateJwtToken, customErrorHandler, verifyToken } = require("../middlewares");

userRoute.post("/register", async (req, res) => {
  try {
    const user = req.body;

    let errorMessage = "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z\s]+$/;

    switch (true) {
      case user.name === "":
        errorMessage = "Name is required";
        break;
      case user.name.length < 3:
        errorMessage = "Name should be atleast 3 characters long";
        break;
      case !nameRegex.test(user.name):
        errorMessage =
          "Invalid name format. Only letters and spaces are allowed";
        break;
      case user.email === "":
        errorMessage = "Email is required";
        break;
      case !emailRegex.test(user.email):
        errorMessage = "Invalid email format";
        break;
      case user.password === "":
        errorMessage = "Password is required";
        break;
      case user.password.length < 4:
        errorMessage = "Password should be atleast 4 characters long";
        break;
      case user.c_password === "":
        errorMessage = "Confirm password is required";
        break;
      case user.password !== user.c_password:
        errorMessage = "Password and confirm password should be the same";
        break;
    }

    if (errorMessage) {
      return res.status(400).send({
        message: errorMessage,
      });
    }

    const userDb = await User.findOne({ email: user.email });

    if (userDb) {
      return res.status(400).send({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(user.password, salt);

    const newUser = new User({
      full_name: user.name,
      email: user.email,
      password: hashed_password,
    });
    await newUser.save();

    res.status(201).send({
      message: "Registration successful",
      user: newUser,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
});

userRoute.post(
  "/login",
  generateJwtToken,
  customErrorHandler,
  async (req, res) => {
    try {
      const user = req.body;
      const { email, password } = user;
      const token = req.body.token;

      let errorMessage = "";

      switch (true) {
        case email === "":
          errorMessage = "Email is required";
          break;
        case password === "":
          errorMessage = "Password is required";
          break;
      }

      if (errorMessage) {
        return res.status(400).json({ message: errorMessage });
      }

      const userDb = await User.findOne({ email: email });

      if (!userDb) {
        return res.status(400).json({ message: "User does not exist" });
      }

      const isMatch = await bcrypt.compare(password, userDb.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.status(200).json({
        message: "Login successful",
        user: userDb,
        token: token,
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong",
        error: error.message,
        success: false,
      });
    }
  }
);

userRoute.post("/user", async (req, res) => {
  const email = req.body.email;
  // console.log(email);

  try {
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }

    const user = await User.findOne({ email: email });
    // console.log(user);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    res.status(200).json({ user: user, success: true });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
      success: false,
    });
  }
});

userRoute.put("/user",verifyToken, async (req, res) => {
  const user = req.body;
  // console.log(user);

  let errorMessage = "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  try {
    switch (true) {
      case user.name === "":
        errorMessage = "Name is required";
        break;
      case user.name.length < 3:
        errorMessage = "Name should be atleast 3 characters long";
        break;
      case user.email === "":
        errorMessage = "Email is required";
        break;
      case !emailRegex.test(user.email):
        errorMessage = "Invalid email format";
        break;
      case user.password === "":
        errorMessage = "Password is required";
        break;
    }

    if (errorMessage) {
      return res.status(400).json({ message: errorMessage });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(user.password, salt);

    const userDb = await User.findOneAndUpdate(
      { email: user.email },
      { $set: {
        full_name: user.name,
        email: user.email,
        password: hashed_password,
      
      } },
      { new: true, runValidators: true }
    );
    // console.log("userDb->",userDb);

    if (!userDb) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    res.status(200).json({message:"Profile Updated Successfully", success: true });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
      success: false,
    });
  }
});

module.exports = userRoute;
