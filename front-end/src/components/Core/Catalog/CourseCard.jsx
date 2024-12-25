import React, { useEffect, useState } from "react"
// Icons
import { FaRegStar, FaStar } from "react-icons/fa"
import ReactStars from "react-rating-stars-component"
import { Link } from "react-router-dom"

import GetAvgRating from "../../../utils/avgRating"
import RatingStars from "../../common/RatingStars"

function CourseCard({ course, Height }) {
  console.log(course.instructor.lastName)
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  const [title,setTitle]=useState(course.courseName);
  useEffect(() => {
    if(title.length>80){
      const newTitle=title.slice(0,80)+"...";
      setTitle(newTitle);
    }
    const count = GetAvgRating(course.ratingAndReviews)
    setAvgReviewCount(count)
  }, [course])
  // console.log("count............", avgReviewCount)

  return (
    <>
     <Link to={`/course-details/${course._id}` } className="">
        <div className="">
          <div className="rounded-lg ">
            <img
              src={course?.thumbnail}
              alt="course thumnail"
              className={` w-full rounded-xl object-cover `}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-xl text-richblack-5">{course?.courseName}</p>
            <p className="text-sm text-gray-400 flex gap-2">
              <img src={course.instructor.image} alt="" className="h-5 rounded-lg" />
              {course?.instructor?.firstName} {course?.instructor?.lastName}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-richblue-600">{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-richblue-600">
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className="text-xl text-richblue-500">Rs. {course?.price}</p>
          </div>
        </div>
      </Link>
    </>
  )
}

export default CourseCard