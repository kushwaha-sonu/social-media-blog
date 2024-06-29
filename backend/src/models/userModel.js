const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    }, 
    password: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const User=mongoose.model.User ||mongoose.model("User", userModel);
module.exports = User;
