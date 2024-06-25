const express = require("express");
const getAllUser = express.Router();

const { verifyToken } = require("../middlewares");
const User = require("../models/userModel.js");

/**
 * This is a protected route that requires a valid token for access.
 * It logs the authorization header and returns a JSON response with a message and sample user data.
 *
 * @param {express.Request} req - The Express request object containing the headers and body data.
 * @param {express.Response} res - The Express response object used to send HTTP responses.
 * @returns {void} - This function does not return a value, but sends a JSON response.
 */

getAllUser.get(
  "/get-all-user",
  verifyToken,
  async function getAllUser(req, res) {
    console.log(req.headers.authorization);
    try {

      const user = await User.find();
      
      res.status(200).json({ message: "Protected route", user: user });
    } catch (error) {
      
    }
  }
);

module.exports = getAllUser;
