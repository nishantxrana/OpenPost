import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'


function AdminOnlyPrivateMask() {
    const {currentUser} = useSelector((state)=> state.user)
  return currentUser && currentUser.rest.isAdmin ? <Outlet/> : <Navigate to='signin'/>
}

export default AdminOnlyPrivateMask