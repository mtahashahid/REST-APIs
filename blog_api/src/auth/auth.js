const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
require('dotenv').config();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    });

    const token = signToken(newUser._id);
    newUser.password = undefined;

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.isValidPassword(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }

    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while logging in",
    });
  }
};

exports.authenticate = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized",
      });
    }

    const decodedPayload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decodedPayload.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "User with this token does not exist",
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: "Invalid token",
    });
  }
};