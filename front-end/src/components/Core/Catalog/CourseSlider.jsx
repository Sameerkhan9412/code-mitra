import React, { useEffect, useState } from "react"
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y,FreeMode,Autoplay } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import CourseCard from "./CourseCard"

function Course_Slider({ Courses }) {
  console.log(Courses)
  return (
    <>
      {Courses?.length ? (
        <div
          className="max-h-[30rem] grid  gap-4 grid-cols-3" 
        >
          {Courses?.map((course, i) => (
            <div key={i}>
              <CourseCard course={course} Height={"h-[250px]"} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </>
  )
}

export default Course_Slider