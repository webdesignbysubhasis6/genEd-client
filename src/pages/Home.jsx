import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react'; // Importing the Menu icon from lucide-react
import SideNav from '@/components/SideNav';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';

const Home = () => {
  const navigate = useNavigate();
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  
    const [role, setRole] = useState("");
  
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const userRole = parsedUser.role;

        setRole(userRole); // Still useful if other parts of the component rely on `role`

        // Use the extracted role directly for navigation
        if (userRole === "student") {
          navigate("/home/track");
        } else if (userRole === "teacher") {
          navigate("/home/dashboard");
        } else {
          navigate("/home/dashboard");
        }
      }
    }, []);

  // useEffect(() => {

  //   navigate('/home/profile');
  // }, []);

  const toggleSideNav = () => {
    setIsSideNavOpen((prev) => !prev);
  };

  return (
    <div>
      <div className='bg-[#1A3A6E] md:w-64 fixed hidden md:block'>
        <SideNav />
      </div>
      <div className='md:ml-64'>
        <Header />
        <div className="selected">
          <Toaster />
          <Outlet />
        </div>
      </div>

      <div className='md:hidden fixed top-4 left-4 z-50'>
        <button onClick={toggleSideNav} className="text-2xl p-2 focus:outline-none">
          <Menu /> 
        </button>
      </div>

      {isSideNavOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-40' onClick={toggleSideNav}>
          <div
            className='fixed top-0 left-0 w-64 bg-[#1A3A6E] h-full z-50 shadow-lg'
          >
            <SideNav />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
