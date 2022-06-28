const User = require("../models/user");
const jwt = require("jsonwebtoken");

const errorHandler = (err, req, resp, next) => {
  if (err.name === "ValidationError") {
    return resp.status(400).json({ error: err.message });
  }
  if (err.name === "JsonWebTokenError") {
    return resp.status(401).json({ error: "invalid token" });
  }
  if (err.name === "CastError") {
    return resp.status(400).json({ error: "invalid id" });
  }
  next(err);
};

const tokenExtractor = (req, resp, next) => {
  const authr = req.get("authorization");
  if (authr && authr.toLowerCase().startsWith("bearer ")) {
    req.token = authr.substring(7);
  }
  next();
};

const userExtractor = async (req, resp, next) => {
  const authr = req.get("authorization");
  if (authr && authr.toLowerCase().startsWith("bearer ")) {
    const token = authr.substring(7);
    const decoded = jwt.verify(token, process.env.SECRET);
    if (decoded && decoded.id) {
      req.user = await User.findById(decoded.id);
    }
  }
  next();
};

module.exports = { errorHandler, tokenExtractor, userExtractor };
