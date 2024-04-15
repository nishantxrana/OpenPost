import React, { useState,useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import DashboardSidebar from '../components/DashboardSidebar'
import DashboardProfile from '../components/DashboardProfile'
import DashboardPosts from '../components/DashboardPosts'


function Dashboard() {
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
    <div className='min-h-screen flex flex-col md:flex-row w-full'>
    <div className=''>
      <DashboardSidebar/>
    </div>
    {tab === 'profile' && <DashboardProfile />}
    {tab === 'posts' && <DashboardPosts />}
    </div>
  )
}

export default Dashboard