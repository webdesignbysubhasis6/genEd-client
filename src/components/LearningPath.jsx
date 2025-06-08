import React from 'react'
import LearningPathRecommendation from './LearningPathRecommendation'

const LearningPath = () => {
  return (
    <div className='p-10'>
      <h2 className='text-2xl font-bold mb-6'>Recommendation</h2>
      <div className='flex flex-col gap-6 border rounded-lg shadow-sm p-5 min-h-[70vh]'>
        <LearningPathRecommendation/>
      </div>
    </div>
  )
}

export default LearningPath
