import React from 'react'
import LearningPathRecommendation from './LearningPathRecommendation'

const LearningPath = () => {
  return (
    <div className='p-10 bg-[#dcedf5] min-h-screen'>
      <h2 className='text-3xl text-[#1A3A6E] font-bold mb-6'>Recommendation</h2>
      <div className='flex flex-col gap-6 border rounded-lg shadow-sm p-5 min-h-[70vh] bg-white rounded-2xl shadow-xl border transition-transform duration-300 hover:scale-[1.01]'>
        <LearningPathRecommendation/>
      </div>
    </div>
  )
}

export default LearningPath
