import React from 'react'
import Card from './Card';

const VisualList = ({icon1,icon2,icon3,title1,title2,title3,value1,value2,value3}) => {
  return (
    <div className='grid grid-cols-1 
    md:grid-cols-2 lg:grid-cols-3 gap-5 my-6'>
        <Card icon={icon1} title={title1}
        value={value1}/>
        <Card icon={icon2} title={title2}
        value={value2}/>
        <Card icon={icon3} title={title3}
        value={value3}/>
    </div>
  )
}

export default VisualList