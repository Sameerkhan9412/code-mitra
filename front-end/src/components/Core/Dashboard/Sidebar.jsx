import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Spinner from '../../common/Spinner'
import SidebarLinks from './SidebarLinks'
import { sidebarLinks } from '../../../utils/dashboard-links'
import { logout } from '../../../services/operations/authAPI'
import { VscSignOut } from 'react-icons/vsc'
import ConfirmationModal from '../../common/ConfirmationModal'


const Sidebar = () => {

    const {loading:authLoading}=useSelector((state)=>state.auth)
    const {user,loading:profileLoading}=useSelector((state)=>state.profile)
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const [confirmationModal,setConfirmationModal]=useState(null)
    if(authLoading||profileLoading){
        return <Spinner/>
    }
  return (
    <>
    <div className='flex  flex-col justify-between'>
        <div className="flex flex-col">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return (
              <SidebarLinks key={link.id} link={link} iconName={link.icon} />
            )
          })}
          
        </div>
        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-gray-700" id="SideBar"/>
        <div className="flex flex-col">
          <SidebarLinks
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
          />
          
          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="px-8 py-2 text-sm  text-white font-bold"
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
        </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
      </>
  )
}

export default Sidebar