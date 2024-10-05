const express = require("express")
const router = express.Router()
const { auth } = require("../middlewares/auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  getEnrolledCourses,
  updateDisplayPicture,
} = require("../controllers/Profile")
const { changePassword } = require("../controllers/Auth")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delete User Account
router.delete("/deleteProfile",auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.put("/updatePassword", auth, changePassword);

module.exports = router