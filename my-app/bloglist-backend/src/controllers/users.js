const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (req, resp) => {
  const {username, name, password } = req.body;
  if (await User.findOne({username})) {
    return resp.status(400).json({error: "username must be unique"});
  }
  if (!password || password.length < 3) {
    return resp.status(400).json({error: "invalid password"});
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, name, passwordHash});

  const savedUser = await user.save();
  resp.status(201).json(savedUser);
});

usersRouter.get("/", async (req, resp) => {
  const ret = await User.find({}).populate("blogs",{url:1, title:1, author:1, id:1});
  resp.json(ret);
});

module.exports = usersRouter;

