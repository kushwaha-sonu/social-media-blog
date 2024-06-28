const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const encodePassword = async (req, res, next) => {
  try {
    const pass = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(pass, salt);
    req.body.password = hashed_password; 
    next();
  } catch (error) {
    res.status(500).json({ message: "Error encoding password" });
  }
};


const generateJwtToken = (req, res,next) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: 3600 });
  req.body.token = token;
  next();
}


const generateRefreshToken=(req,res,next)=>{
  const user = req.body;
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  req.body.refreshToken = refreshToken;
  next();
}


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1]; 
  // console.log(token);
  if (token===null || token===undefined) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    
    if (err) {
      return res.status(403).json({ message: "Please Login to create blog",error: err.message });
    }
    req.user = user;
    next();
  });
}


const customErrorHandler = (err, req, res, next) => {
  if (err) {
    console.error(err); // Log the error for debugging purposes
    // Determine the status code based on the type of error or use 500 by default
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message || "Something went wrong" });
  } else {
    next();
  }
}


module.exports = { encodePassword ,generateJwtToken,verifyToken,customErrorHandler,generateRefreshToken};
