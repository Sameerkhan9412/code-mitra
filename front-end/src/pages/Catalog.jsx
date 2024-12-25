import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { getCatalogPageData } from '../services/operations/PageAndComponentsData';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiConnector } from '../services/apiConnector';
import { categories } from '../services/apis';
import { useSelector } from 'react-redux';
import Error from './Error';
import CourseCard from '../components/Core/Catalog/CourseCard';
import CourseSlider from '../components/Core/Catalog/CourseSlider';

const Catalog = () => {
  const { loading } = useSelector((state) => state.profile)
  const {catalogName} =useParams();
  const [catalogPageData,setCatalogPageData]=useState(null);
  const [categoryId,setCategoryId]=useState("");

  // fetch alll categories
  useEffect(() => {
    (async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        const category_id = res?.data?.data?.filter(
          (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
        )[0]._id
        setCategoryId(category_id)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
    })()
  }, [catalogName])
  useEffect(() => {
    if (categoryId) {
      ;(async () => {
        try {
          const res = await getCatalogPageData(categoryId)
          setCatalogPageData(res)
        } catch (error) {
          console.log(error)
        }
      }
        
      )()
    }
  }, [categoryId])
  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="custom-loader"></div>
      </div>
    )
  }
  if (!loading && !catalogPageData.success) {
    return <Error />
  }

  return (
    <>
    {/* hero section */}
    <div className='box-content  px-4'>
      <div className='mx-auto flex min-h-[260px]  flex-col justify-center gap-4 text-lg '>
        <p className=''>{`Home/Catalog/`}
        <span className='text-richblue-600 font-semibold'> 
          {catalogPageData?.data?.selectedCategory?.name}
          </span></p>
        <p className='text-3xl font-semibold text-richblue-600'>{catalogPageData?.data?.selectedCategory?.name}</p>
        <p className='max-w-[870px] '>{catalogPageData?.data?.selectedCategory?.description}</p>
      </div>
       {/* Section 1 */}
      <div className=" mx-auto box-content w-full py-2">
        <div className="font-bold text-4xl p-2 mb-2">Famous Youtube Playlist</div>
        <div className=''>
          <CourseSlider
            Courses={catalogPageData?.data?.selectedCategory?.courses}
          />
        </div>
      </div>
       {/* Section 1 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab py-2 lg:max-w-maxContent">
        <div className="font-bold text-4xl">Courses to get you started</div>
        <div className="my-4 flex border-b text-sm gap-4 pb-2">
          <p className='border-b-2 border-richblue-600 text-richblue-600 pb-2'>
            Most Populer
          </p>
          <p>
            New
          </p>
          <p>
            Trending
          </p>
        </div>
        <div className=''>
          <CourseSlider
            Courses={catalogPageData?.data?.selectedCategory?.courses}
          />
        </div>
      </div>
      {/* Section 2 */}
      <div className=" mx-auto box-content w-full  py-2  ">
        <div className="">
        <div className="font-bold text-4xl mb-2">
          Top courses in {catalogPageData?.data?.differentCategory?.name}
          </div>
          <CourseSlider
            Courses={catalogPageData?.data?.selectedCategory?.courses}
          />
          </div>
      </div>

      {/* Section 3 */}
      <div className=" mx-auto box-content w-full py-8">
      <div className="font-bold text-4xl">Frequently Bought</div>
        <div className="py-2">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {catalogPageData?.data?.mostSellingCourses
              ?.slice(0, 4)
              .map((course, i) => (
                <CourseCard course={course} key={i} Height={"h-[400px]"} />
              ))}
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default Catalog