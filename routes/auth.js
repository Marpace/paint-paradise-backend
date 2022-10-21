const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth")

router.post("/login", authController.login)

router.get("/send-verification-code", authController.sendVerificationCode)

router.post("/verify-code", authController.verifyCode)

router.post("/reset-password", authController.resetPassword)

module.exports = router;