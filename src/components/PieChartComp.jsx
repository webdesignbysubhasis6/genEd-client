import React, { useEffect, useState } from 'react'
import { Pie, PieChart, ResponsiveContainer } from 'recharts'
import moment from 'moment';

const PieChartComp = ({data}) => {
    // const [data,setData]=useState([]);
    // const getUniqueRecord = () => {
    //     const uniqueRecord = [];
    //     const existingStudent = new Set();

    //     // Check if attendanceList is defined and is an array
    //     if (!Array.isArray(attendanceList)) {
    //         console.error("attendanceList is not defined or not an array.");
    //         return uniqueRecord; // Return an empty array if it's not valid
    //     }

    //     attendanceList.forEach((record) => {
    //         if (!existingStudent.has(record.studentId)) {
    //             existingStudent.add(record.studentId);
    //             uniqueRecord.push(record);
    //         }
    //     });

    //     return uniqueRecord;
    // };

    // useEffect(()=>{
    //     if(attendanceList)
    //     {
    //         const total=getUniqueRecord();
    //         const today=moment().format("D");
    //         const PercentagePresent=(attendanceList.length/(total.length*Number(today))*100)
    //         setData([{
    //             name:'Total Present',
    //             value:Number(PercentagePresent.toFixed(1)),
    //             fill:"#8884d8" 
    //         },
    //         {
    //             name:'Total Absent',
    //             value:100-Number(PercentagePresent.toFixed(1)),
    //             fill:"#82ca9d" 
    //         },
    //     ])
    //     }
    // },[attendanceList])
  return (
    <div className='border p-5 rounded-lg'>
        <h2 className='my-2 font-bold text-2xl text-[#1A3A6E]'>Monthly Attendance</h2>
        <ResponsiveContainer width={'100%'} height={300}>
              <PieChart width={730} height={250}>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label />
      </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PieChartComp