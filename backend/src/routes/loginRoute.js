const express = require("express");
const bcrypt = require("bcrypt");
const loginRoute = express.Router();

const User = require("../models/userModel.js");
const {
  generateJwtToken,
  customErrorHandler,
  generateRefreshToken,
} = require("../middlewares");

loginRoute.post(
  "/login-route",
  generateJwtToken,
  generateRefreshToken,
  customErrorHandler,
  async (req, res) => {
    try {
      const user = req.body;
      const { email, password } = user;
      const token = req.body.token;

      const userDb = await User.findOne({ email: email });

      if (!userDb) {
        return res.status(400).json({ message: "User does not exist" });
      }

      //   const authHeader = req.headers.authorization;
      //   const token = authHeader.split(" ")[1];
      //   console.log(token);

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
        message: "Internal server error",
        error: error.message,
        success: false,
      });
    }
  }
);

module.exports = loginRoute;
