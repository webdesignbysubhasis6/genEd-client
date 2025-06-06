import React from 'react'
import FeedbackAnalysis from './FeedbackAnalysis'

const Feedbacks = () => {
  return (
    <div className='p-10'>
      <h2 className='text-2xl font-bold mb-6'>Feedbacks</h2>
      <div className='flex flex-col gap-6 border rounded-lg shadow-sm p-5 min-h-[70vh]'>
        <FeedbackAnalysis/>
      </div>
    </div>
  )
}

export default Feedbacks
