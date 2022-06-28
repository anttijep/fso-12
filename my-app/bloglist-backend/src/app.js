const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const blogsRouter = require("./controllers/blogs");
const {errorHandler, userExtractor} = require("./utils/middleware");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/blogs", userExtractor, blogsRouter);
if (process.env.NODE_ENV === "test") {
  const testRouter = require("./controllers/testrouter");
  app.use("/api/testing", testRouter);
}
app.use(errorHandler);

module.exports = app;
