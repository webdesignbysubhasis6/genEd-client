import React, { useEffect, useState } from 'react'
import {BarChart, Bar, CartesianGrid, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'

const BarChartComp = ({attendanceList,totalPresentData}) => {
    const [data,setData]=useState([]);
    const getUniqueRecord = () => {
        const uniqueRecord = [];
        const existingStudent = new Set();

        // Check if attendanceList is defined and is an array
        if (!Array.isArray(attendanceList)) {
            console.error("attendanceList is not defined or not an array.");
            return uniqueRecord; // Return an empty array if it's not valid
        }

        attendanceList.forEach((record) => {
            if (!existingStudent.has(record.studentId)) {
                existingStudent.add(record.studentId);
                uniqueRecord.push(record);
            }
        });

        return uniqueRecord;
    };
    useEffect(()=>{
        formatAttendanceListCount();
    },[attendanceList||totalPresentData])
    const formatAttendanceListCount=()=>{
        const totalStudent=getUniqueRecord();
        const total=totalStudent?.length;
        const result=totalPresentData.map((item=>({
            day:item.day,
            presentCount:item.presentCount,
            absentCount:Number(total)-Number(item.presentCount),
        })));
        console.log(result);
        setData(result)
    }
    return (
    <div className='p-5 border rounded-lg shadow-sm'>
        <h2 className='my-2 font-bold text-lg'>Last 7 Days Attendance</h2>
        <ResponsiveContainer width={'100%'} height={300}>
        <BarChart data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="day" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="presentCount" name={"Total Present"} fill="#4caf50" />
  <Bar dataKey="absentCount" name={"Total Absent"} fill="#f44336" />
</BarChart>
</ResponsiveContainer>
    </div>
  )
}

export default BarChartComp