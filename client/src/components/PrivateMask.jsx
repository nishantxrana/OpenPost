import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'


function PrivateMask() {
    const {theme} = useSelector((state)=> state.user)
  return theme ? <Outlet/> : <Navigate to='signin'/>
}

export default PrivateMask