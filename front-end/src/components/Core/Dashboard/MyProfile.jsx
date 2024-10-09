import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import IconBtn from "../../common/IconBtn"
import { formattedDate } from "../../../utils/data-formatter"
export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  return (
    <>
      <h1 className="mb-4 text-3xl font-medium ">
        My Profile
      </h1>
      <div className="flex items-center justify-between rounded-md border-2 border-gray-700 bg-gray-800 p-4 px-8  ">
        <div className="flex items-center gap-x-4">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[78px] rounded-full object-cover"
          />
          <div className="space-y-1">
            <p className="text-lg font-semibold">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>
        </div>
        <IconBtn
          text="Edit"
          onclick={() => {
            navigate("/dashboard/settings")
          }}
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>
      <div className="my-4 flex flex-col gap-y-2 rounded-md border-2 border-gray-700 bg-gray-800  p-4 px-8">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold">About</p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings")
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <p
          className={`${
            user?.additionalDetails?.about
              ? "text-white"
              : "text-gray-400"
          } text-sm font-medium`}
        >
          {user?.additionalDetails?.about ?? "Write Something About Yourself"}
        </p>
      </div>
      <div className="my-4  flex flex-col gap-y-2 rounded-md border-2 border-gray-700 bg-gray-800 p-8 px-8">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-white">
            Personal Details
          </p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings")
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <div className="flex max-w-[500px] justify-between">
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-gray-400">First Name</p>
              <p className="text-sm font-medium">
                {user?.firstName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-gray-400">Email</p>
              <p className="text-sm font-medium ">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-gray-400">Gender</p>
              <p className="text-sm font-medium ">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-gray-400">Last Name</p>
              <p className="text-sm font-medium ">
                {user?.lastName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-gray-400">Phone Number</p>
              <p className="text-sm font-medium">
                {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-gray-400">Date Of Birth</p>
              <p className="text-sm font-medium ">
                {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                  "Add Date Of Birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}