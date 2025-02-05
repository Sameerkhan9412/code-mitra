import React from "react"
import copy from "copy-to-clipboard"

import { toast } from "react-hot-toast"
import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import { addToCart } from "../../../slices/CartSlice"
import {buyCourse} from '../../../services/operations/studentFeaturesAPI'




const CourseIncludes = [
  "8 hours on-demand video",
  "Full Lifetime access",
  "Access on Mobile and TV",
  "Certificate of completion",
]

function CourseDetailsCard({ course, setConfirmationModal }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handledBuyCourse = () => {
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch)
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  const {
    thumbnail: ThumbnailImage,
    price: CurrentPrice,
    _id: courseId,
  } = course

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link copied to clipboard")
  }

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    if (token) {
      // console.log("this is the course ",course)
      dispatch(addToCart(course))
      // console.log("dispatching add to cart")
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  // console.log("Student already enrolled ", course?.studentsEnroled, user?._id)

  return (
    <>
      <div
        className={`flex flex-col gap-2 rounded-md bg-richblue-700`}
      >
        {/* Course Image */}
        <img
          src={ThumbnailImage}
          alt={course?.courseName}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden object-cover md:max-w-full p-4"
        />

        <div className="px-4">
          <div className="space-x-3 pb-2 text-3xl font-semibold">
            Rs. {CurrentPrice}
          </div>
          <div className="flex flex-col gap-y-2">
            <button className="bg-richblue-600 p-2 rounded-md transition-colors hover:bg-richblue-300" onClick={
              user&&course?.studentsEnrolled.includes(user._id)
              ?()=>navigate("/dashboard/enrolled-courses")
              :handledBuyCourse
            }>
              {
                // console.log("hello setting",course?.studentsEnrolled)
                user&&course?.studentsEnrolled.includes(user._id)?"Go To Course":"Buy Now"
              }
            </button>
            {
              (!course?.studentsEnrolled.includes(user?._id)&&(
                <button className=" bg-gray-500 p-2 rounded-md transition-colors hover:bg-richblue-300" onClick={handleAddToCart}>Add to Cart</button>
              ))
            }
          </div>
          <div>
            <p className="pb-2 pt-2 text-center text-sm text-richblack-25">
              30-Day Money-Back Guarantee
            </p>
          </div>
<div className="text-center">
            <button
              className="mx-auto flex items-center gap-2 py-2 text-yellow-100 "
              onClick={handleShare}
            >
              <FaShareSquare size={15} /> Share
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseDetailsCard