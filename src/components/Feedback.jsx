import React from 'react'
import FeedbackForm from './FeedbackForm'

const Feedback = () => {
  return (
    <div className='p-10'>
      <h2 className='text-2xl font-bold mb-6'>Feedback</h2>
      <div className='flex flex-col-reverse md:flex-row gap-6 border rounded-lg shadow-sm p-5 h-[70vh] items-center justify-between'>
        
                {/* Feedback Form */}
        <div className='w-full md:w-1/2 h-full flex items-center'>
        <FeedbackForm />
        </div>

        {/* Illustration or Visual */}
        <div className='hidden md:flex w-full md:w-1/2 h-full items-center justify-center'>
        <img src="/feedback.svg" alt="Feedback" className='max-h-full object-contain' />
        </div>


      </div>
    </div>
  )
}

export default Feedback
