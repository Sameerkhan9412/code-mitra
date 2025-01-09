import React from 'react'
import { useState } from 'react'
import {Chart,registerables} from 'chart.js';
import { Pie } from 'react-chartjs-2';
Chart.register(...registerables);

const InstructorChart = ({courses}) => {
    const [currChart,setCurrChart]=useState("students");
    // functions to generate random colors
    const getRandomColors=(numColors)=>{
        const colors=[];
        for(let i=0;i<numColors;i++){
            const color=`rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)})`;
            colors.push(color);
        }
        return colors; 
    }

    // create data for chart displaying student info
    const chartDataForStudents={
        labels:courses.map((course)=>course.courseName),
        datasets:[
            {
                data:courses.map((course)=>course.totalStudentsEnrolled),
                backgroundColor:getRandomColors(courses.length),
            }
        ]
    }

    // create data for chart displaying income info
    const chartDataForIncome={
        labels:courses.map((course)=>course.courseName),
        datasets:[
            {
                data:courses.map((course)=>course.totalAmountGenerated),
                backgroundColor:getRandomColors(courses.length),
            }
        ]
    }

    // create opptions 
    const options={
      
    }




  return (
    <div className='p-4 m-4  min-h-[60vh] relative  w-[80%]'>
         <p className=' text-richblue-600 font-extrabold text-4xl text-center underline'>Visualise</p>
         <div className='flex gap-x-5 px-2 py-1 bg-white m-2 justify-center text-richblue-700 font-bold text-3xl ' >
            <button onClick={()=>setCurrChart("students")} className={`${currChart == "students" ? "underline" : "underline-none"}`}>Student</button>
            <button onClick={()=>setCurrChart("income")} className={`${currChart != "students" ? "underline" : "underline-none"}`}>Income</button>
         </div>
         <div  className='  flex'>
            <Pie data={currChart==="students"? chartDataForStudents :chartDataForIncome}
            options={ {maintainAspectRatio: false}  } 
             width={"300px"} height={"300px"}  />
         </div>
    </div>
  )
}

export default InstructorChart