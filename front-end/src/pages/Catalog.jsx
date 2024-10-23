import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { getCatalogPageData } from '../services/operations/PageAndComponentsData';
import { useParams } from 'react-router-dom';
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
  console.log("hihihi",catalogPageData)
  useEffect(() => {
    if (categoryId) {
      ;(async () => {
        try {
          const res = await getCatalogPageData(categoryId)
          setCatalogPageData(res)
          console.log("my res",res);
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
      <div className='mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent '>
        <p className=''>{`Home/Catalog/`}
        <span className='text-blue'> 
          {catalogPageData?.data?.selectedCategory
?.name}
          </span></p>
        <p className='text-3xl font-bold'>{catalogPageData?.data?.selectedCategory
?.name}</p>
        <p className='max-w-[870px] '>{catalogPageData?.data?.selectedCategory
?.description}</p>
      </div>
      <div>
       {/* Section 1 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="text-lg font-bold text-blue">Courses to get you started</div>
        <div className="my-4 flex border-b text-sm">
          <p>
            Most Populer
          </p>
          <p>
            New
          </p>
        </div>
        <div>
          <CourseSlider
            Courses={catalogPageData?.data?.selectedCategory?.courses}
          />
          
        </div>
      </div>
      {/* Section 2 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">
          Top courses in {catalogPageData?.data?.differentCategory?.name}
        </div>
        <div className="py-8">
          <CourseSlider
            Courses={catalogPageData?.data?.differentCategory?.courses}
          />
        </div>
      </div>

      {/* Section 3 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Frequently Bought</div>
        <div className="py-8">
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
    </div>
    </>
  )
}

export default Catalog