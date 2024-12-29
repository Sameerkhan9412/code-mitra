import React, { useEffect, useState } from "react";
import { BiInfoCircle } from "react-icons/bi";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BsFillCaretRightFill } from "react-icons/bs";

import ConfirmationModal from "../components/common/ConfirmationModal";
import RatingStars from "../components/common/RatingStars";

import { formatDate } from "../utils/format-date";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import GetAvgRating from "../utils/avgRating";
import Error from "../pages/Error";
import Spinner from "../components/common/Spinner";
import CourseAccordianBar from "../components/Core/Course/CourseAccordianBar";
import CourseDetailsCard from "../components/Core/Course/CourseDetailsCard";
import {buyCourse} from '../services/operations/studentFeaturesAPI'

function CourseDetails() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.profile);
  const { paymentLoading } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Getting courseId from url parameter
  const { courseId } = useParams();

  // Declear a state to save the course details
  const [response, setResponse] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  useEffect(() => {
    // Calling fetchCourseDetails fucntion to fetch the details
    (async () => {
      try {
        const res = await fetchCourseDetails(courseId);
        setResponse(res);
      } catch (error) {
        console.log("Could not fetch Course Details");
      }
    })();
  }, [courseId]);


  // Calculating Avg Review count
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  useEffect(() => {
    const count = GetAvgRating(response?.data?.courseDetails.ratingAndReviews);
    setAvgReviewCount(count);
  }, [response]);

  // // Collapse all
  const [isActive, setIsActive] = useState(Array(0));
  const handleActive = (id) => {
    // console.log("called", id)
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat([id])
        : isActive.filter((e) => e !== id)
    );
  };

  // Total number of lectures
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
  useEffect(() => {
    let lectures = 0;
    response?.data?.courseDetails?.courseContent?.forEach((sec) => {
      lectures += sec.SubSection.length || 0;
    });
    setTotalNoOfLectures(lectures);
  }, [response]);

  if (loading || !response) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <Spinner/>
      </div>
    );
  }
  if (!response.success) {
    return <Error />;
  }

  const {
    _id: course_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = response.data?.courseDetails;

  const handleBuyCourse = () => {
    if (token) {
     buyCourse(token, [courseId], user, navigate, dispatch);
      return;
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  if (paymentLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }
  

  return (
    <>
      <div className={`relative w-full`}>
        {/* Hero Section */}
        <div className="mx-auto box-content grid grid-cols-3 lg:w-[1260px]">
          <div className=" col-span-2 mx-2 px-2">
            <div
              className={` my-5 flex flex-col justify-center gap-4 py-5  text-white`}
            >
              <div>
                <p className="text-4xl font-bold text-richblue-700 rounded-md transition-colors sm:text-[42px]">
                  {courseName}
                </p>
              </div>
              <p className={`text-richblack-200`}>{courseDescription}</p>
              <div className="text-md flex flex-wrap items-center gap-2">
                <span className="text-yellow-25">{avgReviewCount?avgReviewCount:"0"}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                {/* <span>{`(${ratingAndReviews.length} reviews)`}</span> */}
                <span>{`(2 reviews)`}</span>
                <span>{`${studentsEnrolled.length} students enrolled`}</span>
              </div>
              <div>
                <p className="">
                  Created By {`${instructor.firstName} ${instructor.lastName}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-5 text-lg">
                <p className="flex items-center gap-2">
                  {" "}
                  <BiInfoCircle /> Created at {formatDate(createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  {" "}
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>
            <div className="mx-auto box-content text-start">
        <div className="mx-auto max-w-maxContentTab">
          {/* What will you learn section */}
          <div className="my-8 border border-richblue-700 p-8">
            <p className="text-3xl font-semibold text-richblue-700">What you'll learn</p>
            <div className="mt-5 ">
              {whatYouWillLearn}
            </div>
          </div>
          <div className={``}>
            <p className={`my-3 text-3xl font-semibold text-richblue-700 `}>
            Prerequisites / Requirement :
            </p>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              {response.data.courseDetails.instructions.map((item, i) => {
                return (
                  <p className={`flex gap-2`} key={i}>
                    <BsFillCaretRightFill className="text-richblue-700"/>
                    <span>{item}</span>
                  </p>
                )
              })}
            </div>
          </div>

          {/* Course Content Section */}
          <div className="">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] font-semibold text-richblue-700 mt-5">Course Content</p>
              <div className="flex flex-wrap justify-between gap-2">
                <div className="flex gap-2">
                  <span>
                    {courseContent.length} {`section(s)`}
                  </span>
                  <span>
                    {totalNoOfLectures} {`lecture(s)`}
                  </span>
                  <span>{response.data?.totalDuration} total length</span>
                </div>
                <div>
                  <button
                    className="text-richblue-700"
                    onClick={() => setIsActive([])}
                  >
                    Collapse all sections
                  </button>
                </div>
              </div>
            </div>

            {/* Course Details Accordion */}
            <div className="py-4">
              {courseContent?.map((course, index) => (
                <CourseAccordianBar
                  course={course}
                  key={index}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))}
            </div>

            {/* Author Details */}
            <div className="py-4">
              <p className="text-[28px] font-semibold text-richblue-600">Author</p>
              <div className="flex items-center gap-4 py-4">
                <img
                  src={
                    instructor.image
                      ? instructor.image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                  }
                  alt="Author"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
              </div>
              <p className="text-richblue-700">
                {instructor?.additionalDetails?.about}
              </p>
            </div>
          </div>
        </div>
      </div>
          </div>
          {/* Courses Card */}
          <div className="col-span-1 rounded-md bg-richblue-200 mx-3 mt-4 p-3 px-2">
            <CourseDetailsCard
              course={response?.data?.courseDetails}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleBuyCourse}
            />
          </div>
        </div>
      </div>
      
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}

export default CourseDetails;