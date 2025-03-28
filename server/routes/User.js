// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
  login,
  signUp,
  sendOTP,
  changePassword,
} = require("../controllers/auth")
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/resetPassword")

const {contact} = require("../controllers/contact");

const { auth } = require("../middlewares/auth")

// Routes for Login, Signup, Authentication & ContactUs 

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signUp)

// Route for sending OTP to the user's email
router.post("/sendotp", sendOTP)

// Route for Changing the password
router.post("/changepassword", auth, changePassword)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)


// ********************************************************************************************************
//                                      Contact Us
// ********************************************************************************************************
router.post("/contact-us",contact)

// Export the router for use in the main application
module.exports = router