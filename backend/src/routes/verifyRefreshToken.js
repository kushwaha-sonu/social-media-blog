const express = require('express');
const verifyRefreshTokenRoute = express.Router();
const jwt = require("jsonwebtoken");



verifyRefreshTokenRoute.post("/verifyRefreshToken", async (req, res) => {
  const refreshToken = req.headers.authorization;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden access", error: err.message });
    }
    res.status(200).json({ message: "Refresh token verified", user: user });
  });

  jwt.sign(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, token) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden access", error: err.message });
    }
    res.status(200).json({ message: "Refresh token verified",...req.body, r_token: token });
  });
});

module.exports = verifyRefreshTokenRoute;