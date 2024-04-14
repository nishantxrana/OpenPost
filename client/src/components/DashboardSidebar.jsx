import React, { useState,useEffect } from "react";
import { Sidebar } from "flowbite-react";
import { PiSignOut } from "react-icons/pi";
import { HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../app/user/userSlice";



function DashboardSidebar() {
    const location = useLocation()
    const [tab, settab] = useState('')
    const dispatch = useDispatch();
    useEffect(() => {
      const UrlParameters = new URLSearchParams(location.search);
      const tabFromURL = UrlParameters.get('tab')
      if (tabFromURL) {
        settab(tabFromURL)
      }
    }, [location.search])

    const handleLogOut  =async () => {
      try {
       const data = await fetch('/api/users/logout',{
         method: 'POST',
       })
       const res = await data.json()
       if(data.ok){
         dispatch(logout());
       }
       else{
         console.log(res.message);
       }
      } catch (error) {
       console.log(error.message);
      }}
  return (
    <div>
      <Sidebar className="flex flex-col w-full sm:min-w-60  md:h-screen">
        <Sidebar.Items>
          <Sidebar.ItemGroup as={'div'}>
            <Link to={'/dashboard?tab=profile'}>
            <Sidebar.Item active={tab === 'profile'} label={'User'} labelColor='dark' icon={HiUser} as="div">
              Profile
            </Sidebar.Item>
            </Link>
            <Sidebar.Item className="cursor-pointer" icon={PiSignOut} onClick={handleLogOut}  >Sign Out</Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}

export default DashboardSidebar;
