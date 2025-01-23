import React from 'react';
import Login from '@/components/Login';
import { Button } from '@/components/ui/button';
import { MousePointer2 } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col text-gray-800">
      {/* Hero Section */}
      <div className='px-20 py-4 shadow-sm border flex justify-between'>
        <div className='flex justify-center item-center gap-3'>
          <img 
            src="/logo-main.jpg" 
            alt="App Logo" 
            className="mx-auto w-9 rounded-full" 
          />
          <div className='text-2xl font-bold text-[#146ef5]'> GenEd</div>
        </div>
        
        <Login title="Login"/>
       
         
      </div>

      <div className='grid grid-cols-1 md:grid-cols-5 gap-1'>
        <div className='md:col-span-3'>
          <header className="bg-white py-16">
            <div className="p-20">
              <div className="text-justify text-5xl font-bold text-gray-900 mb-4">
                Transform Academic Management
              </div>
              <div className='flex'>
              <div className="text-5xl font-bold text-gray-900 mb-4 mr-4">
                with
              </div>
              <div className="text-5xl font-bold text-[#146ef5] mb-4">
                GenEd
              </div>
              </div>
              
              <p className="text-justify text-1xl text-gray-600 mb-8">
              Experience seamless academic management with GenEd. From efficient attendance tracking and insightful analytics to role-based access control and performance prediction, GenEd simplifies complexities, empowering institutions to focus on what matters most—student success. Transform the way you manage academics and embrace a smarter, data-driven approach with GenEd.
              </p>
              <Login title="Get Started"/>              
            </div>
          </header>
        </div>

        <div className='md:col-span-2 hidden md:block'>
            <img src="./right-Landing.gif" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Landing;
