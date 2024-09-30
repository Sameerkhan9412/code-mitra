import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Core/Dashboard/Sidebar';

const Dashboard = () => {
    const {loading:authLoading}=useSelector((state)=>state.auth);
    const {loading:profileLoading}=useSelector((state)=>state.profile);
    if(profileLoading|| authLoading){
        return (
            <div className="mt-10">
            loading...
            </div>
        )
    }

  return (
    <div className='relative flex h-[calc(100vh-3.5rem)] pt-4 overflow-y-hidden'>
            <Sidebar />
        <div className="h-[100vh] flex-1 overflow-auto border-2">
            <div className=" mx-auto w-11/12 max-w-[1000px] py-10">
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default Dashboard