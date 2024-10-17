const express = require("express")
const router = express.Router()
const { auth,isAdmin } = require("../middlewares/auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../controllers/profile")

const {getAllUsers, deleteAccountByAdmin} = require("../controllers/admin");

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile",auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

// Instructor dashboard
// router.get("/instructorDashboard",auth,isInstructor, instructorDashboard)
router.get("/instructorDashboard",auth, instructorDashboard)

// ********************************************************************************************************
//                                      Admin routes
// ********************************************************************************************************
//*Admin getting all user data
router.get("/allUserData",auth, isAdmin, getAllUsers)
router.delete("/deleteAccountByAdmin",auth, isAdmin, deleteAccountByAdmin)

module.exports = router