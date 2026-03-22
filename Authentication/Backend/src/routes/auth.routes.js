const express = require("express");
const authController = require("../controllers/auth.controller");
const { authUser } = require("../middlewares/auth.middleware");
const {
  validationLogin,
  validationRegister,
} = require("../middlewares/validation.middleware");
const router = express.Router();

router.post("/register", validationRegister, authController.registerUser);

router.post('/verify-otp',authController.verifyOTP)

router.post("/login", validationLogin, authController.loginUser);

router.post("/logout", authUser, authController.logoutUser);

module.exports = router;
