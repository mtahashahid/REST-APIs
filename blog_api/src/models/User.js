const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "A user must have a first name"],
  },
  lastname: {
    type: String,
    required: [true, "A user must have a last name"],
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: [true, "A user email must be unique"],
    lowercase: true,
    validate: [validator.isEmail, "Please, enter a valid email"],
  },
  password: {
    type: String,
    required: true,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.isValidPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;