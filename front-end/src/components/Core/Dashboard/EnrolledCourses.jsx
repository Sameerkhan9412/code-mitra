import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { MdOutlineSlowMotionVideo } from "react-icons/md";

import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI';
import ProgressBar from '@ramonak/react-progress-bar';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Spinner from '../../common/Spinner';


const EnrolledCourses = () => {
    const { token } = useSelector((state) => state.auth)
    const navigate = useNavigate()
  
    const [enrolledCourses, setEnrolledCourses] = useState(null)
  
    useEffect(() => {
      ;(async () => {
        console.log("token:",token)
        try {

          const res = await getUserEnrolledCourses(token) // Getting all the published and the drafted courses
          // Filtering the published course out
          const filterPublishCourse = res.filter((ele) => ele.status !== "Draft")
          setEnrolledCourses(filterPublishCourse)
        } catch (error) {
          console.log("Could not fetch enrolled courses.")
          console.log(error)
        }
      })()
    }, [])
  return (
    <>
      <div className="text-3xl text-white font-bold mb-2">Enrolled Courses</div>
      <div>
        {
          !enrolledCourses?(
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <Spinner/>
          </div>
          ):
          !enrolledCourses.length?(
            <p className="grid h-[10vh] w-full place-content-center text-blue text-3xl">
          You have not enrolled in any course yet
        </p>
          ):(
            <div className='grid grid-cols-3 gap-4'>
            {enrolledCourses.map((course, i) => (
              <div className='relative'>
                <div className='relative'>
                    <img src={course.thumbnail} alt="course image" className='rounded-lg h-[200px] object-cover w-full overflow-hidden ' />
                    <div className='absolute inset-0 bg-black opacity-40 rounded-lg'></div>
                </div>
                    <p className='p-1 font-bold'>{course.courseName.length>32?course.courseName.slice(0,32)+"...":course.courseName}</p>
                    <button className=' text-center text-lg text-black bg-white w-full mt-2 rounded-md flex justify-center items-center gap-2 p-1' onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.SubSection?.[0]?._id}`
                  )
                }} ><MdOutlineSlowMotionVideo  className=' text-2xl'/>View Course</button>
                    <div className='w-12 absolute bottom-1/4 right-3 bg-white h-12 rounded-full p-1 '>
                    <CircularProgressbar value={course.progressPercentage||0} maxValue={100} text={`${course.progressPercentage}%`}  strokeWidth={12} styles={{
                path: {
                    stroke: `black`,
                },
                trail: {
                  stroke: '',
                },text: {
                  fill: `black`,
                  fontSize: '26px',
                  fontWeight:400
                },
            }}/>

                    </div>
                    </div>
            ))}
          </div>
          
          )
        }
      </div>
    </>
  )
}

export default EnrolledCourses