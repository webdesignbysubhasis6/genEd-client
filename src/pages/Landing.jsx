import React from 'react';
import Login from '@/components/Login';
import { Button } from '@/components/ui/button';
import { MousePointer2 } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col text-gray-800">
      {/* Hero Section */}
      <div className='px-20 py-4 shadow-sm border flex justify-between'>
        <div className='flex justify-center item-center'>
          <img 
            src="/logo-main.jpg" 
            alt="App Logo" 
            className="mx-auto w-9 rounded-full" 
          />
        </div>
        <Login title="Login"/> 
      </div>

      <div className='grid grid-cols-1 md:grid-cols-5 gap-1'>
        <div className='md:col-span-3'>
          <header className="bg-white py-16">
            <div className="pl-20 py-20 pr-8">
              <div className="text-5xl font-bold text-gray-900 mb-4">
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
              
              <p className="text-1xl text-gray-600 mb-8">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga animi necessitatibus itaque eaque culpa totam optio aspernatur labore incidunt odio recusandae adipisci veritatis libero id laboriosam, vero fugiat dolores tenetur.
              </p>
              <Login title="Get Started"/>              
            </div>
          </header>
        </div>

        <div className='md:col-span-2'>
            <img src="./right-Landing.gif" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Landing;
