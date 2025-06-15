import React from 'react'
import FeedbackAnalysis from './FeedbackAnalysis'

const Feedbacks = () => {
  return (
    <div className='p-10 bg-[#dcedf5] min-h-screen'>
      <h2 className='font-bold mb-6 text-3xl text-[#1A3A6E]'>Feedbacks</h2>
      <div className='flex flex-col gap-6 rounded-2xl shadow-xl p-6 min-h-[70vh] bg-white border  transition-transform duration-300 hover:scale-[1.02]'>
  <FeedbackAnalysis />
</div>
    </div>
  )
}

export default Feedbacks
