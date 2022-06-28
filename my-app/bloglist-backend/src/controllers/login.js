const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (req, resp) => {
  const { username, password } = req.body;
  const user = await User.findOne({username});

  if (!(user && password && await bcrypt.compare(password, user.passwordHash))) {
    return resp.status(401).json({error: "invalid username or password"});
  }
  const token = jwt.sign({username: user.username, id:user._id}, process.env.SECRET);
  resp.status(200).send({token, username:user.username, name:user.name, id:user._id.toString()});
});


module.exports = loginRouter;
