const express = require("express");
const app = express();
app.use(express.json());
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");


app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  })
);

const connectDB = require("./helper/dB");
const blogRoute = require("./routes/blogRoutes");
const userRoute = require("./routes/userRoutes");

const verifyRefreshTokenRoute = require("./routes/verifyRefreshToken");
const registrationRoute = require("./routes/registrationRoute");
const loginRoute = require("./routes/loginRoute");
const getAllUser = require("./routes/getAllUser");

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api", blogRoute);
app.use("/api", userRoute);

app.use("/api", registrationRoute);
app.use("/api", loginRoute);
app.use("/api", getAllUser);
app.use("/api", verifyRefreshTokenRoute);

app.listen(process.env.PORT || 4002, (err) => {
  if (err) {
    throw err;
  }
  connectDB();
  console.log("server listening on port", process.env.PORT);
});
