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
      <Link to={`/courses/${course._id}`}>
        <div className="">
          <div className="rounded-lg">
            <img
              src={course?.thumbnail}
              alt="course thumnail"
              className={`${Height} w-full rounded-xl object-cover `}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-xl text-white font-bold">{title}</p>
            <p className="text-sm text-white flex gap-2">
              <img src={course?.instructor?.image} alt="image" className="w-6 rounded-full" />{course?.instructor?.firstName} {course.instructor.lastName}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-white">{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-white">
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
          </div>
        </div>
      </Link>
    </>
  )
}

export default CourseCard