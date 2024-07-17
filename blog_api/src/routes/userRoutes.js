const express = require('express');
const userController = require("../controllers/userController");
const authController = require('../auth/auth')
const router = express.Router();

router.get('/author', authController.authenticate, userController.getAllBlogs);
router.post("/auth/signup", authController.signup)
router.post("/auth/login", authController.login)

module.exports = router;