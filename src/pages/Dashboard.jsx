import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/core/Dashboard/Sidebar';

const Dashboard = () => {

    const {loading : authLoading} = useSelector((state)=>state.auth);
    const {loading : profileLoading} = useSelector((state)=>state.profile);

    if (profileLoading || authLoading) {
        return(
            <div className="wrapper text-richblue-5">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
                <div className="absolute top-20 left-[18%] text-3xl font-semibold font-inter">Loading...</div>
            </div>
        )
    }

  return (
    <div className='flex relative min-h-[calc(100vh-3.5rem)] '>
      <Sidebar></Sidebar>
      <div className="h-[calc(100vh-3.5rem)] overflow-auto flex-1">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
