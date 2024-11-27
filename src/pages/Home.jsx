import SideNav from '@/components/SideNav'
import React, { useEffect } from 'react'
import { Router, Routes, Route ,Outlet, useNavigate} from 'react-router-dom';
import Header from '@/components/Header'
import { Toaster } from '@/components/ui/sonner';
const Home = () => {
  const navigate = useNavigate();
  useEffect(()=>{
    navigate('/home/profile');
  },[])
  return (
    <div><div className='md:w-64 fixed hidden md:block'><SideNav/></div>
    <div className='md:ml-64'>
        <Header/>
        <div className="selected">
        <Toaster/>
        <Outlet />
   
        </div>
    </div>
    </div>
  )
}

export default Home