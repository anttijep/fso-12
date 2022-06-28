const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {type:String, minlength: 3, required:true},
  name: {type: String, required: true},
  passwordHash: {type: String, required:true},
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog"
    }
  ]
});

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
