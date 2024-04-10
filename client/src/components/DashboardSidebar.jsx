import React, { useState,useEffect } from "react";
import { Sidebar } from "flowbite-react";
import { PiSignOut } from "react-icons/pi";
import { HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";


function DashboardSidebar() {
    const location = useLocation()
    const [tab, settab] = useState('')
    useEffect(() => {
      const UrlParameters = new URLSearchParams(location.search);
      const tabFromURL = UrlParameters.get('tab')
      if (tabFromURL) {
        settab(tabFromURL)
      }
    }, [location.search])
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
            <Sidebar.Item icon={PiSignOut}>Sign Out</Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}

export default DashboardSidebar;
