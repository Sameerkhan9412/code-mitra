import { FaCheck } from "react-icons/fa"
import { useSelector } from "react-redux"
import CourseInformationForm from "./CourseInformation.jsx/CourseInformationForm"
import CourseBuilderForm from "./CourseBuilder.jsx/CourseBuilderForm"
import PublishCourse from "./PublishCourse"


export default function RenderSteps() {
  const { step } = useSelector((state) => state.course)

  const steps = [
    {
      id: 1,
      title: "Course Information",
    },
    {
      id: 2,
      title: "Course Builder",
    },
    {
      id: 3,
      title: "Publish",
    },
  ]

  return (
    <>
    <div className="grid grid-cols-4">
      <div className=" flex flex-col order-2">
      <div className="">
        {steps.map((item) => (
          <>
            <div
              className="flex flex-col items-center "
              key={item.id}
            >
              <button
                className={`grid cursor-default aspect-square w-[34px] place-items-center rounded-full   ${
                  step === item.id
                    ? "bg-richblue-700"
                    : "border-gray-700 bg-gray-700 text-white"
                } ${step > item.id && " "}} `}
              >
                {step > item.id ? (
                  <FaCheck className="font-bold text-richblack-900" />
                ) : (
                  item.id
                )}
              </button>
              <p className="font-bold">{item.title}</p>
              
            </div>
            {item.id !== steps.length && (
              <>
                <div
                  className={`h-24 w-1 m-auto border-dashed mb-2 ${
                  step > item.id  ? " bg-richblue-700" : "border-gray-500 bg-slate-700"
                } `}
                ></div>
              </>
            )}
          </>
        ))}
      </div>
      </div>
      {/* Render specific component based on current step */}
      <div className="col-span-3 order-1">
      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 && <PublishCourse />} 
      </div>
    </div>
    </>
  )
}