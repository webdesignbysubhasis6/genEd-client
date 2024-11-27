import React, { useEffect, useState } from 'react'
import MonthSelection from './MonthSelection'
import SemSelection from './SemSelection';
import { attendanceApi } from '@/utils/api';
import moment from 'moment';
import VisualList from './VisualList';
import BarChartComp from './BarChartComp';
import PieChartComp from './PieChartComp';
import { GraduationCap, TrendingDown, TrendingUp } from 'lucide-react';
const Dashboard = () => {
  const [selectedMonth,setSelectedMonth]=useState();
  const [selectedSem,setSelectedSem]=useState();
  const [attendanceList,setAttendanceList]=useState();
  const [totalPresentData,setTotalPresentData]=useState([]);
  const [totalStudents,setTotalStudents]=useState(0);
    const [presentPercentage,setPresentPercentage]=useState(0);
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
        if(attendanceList)
        {
            const total=getUniqueRecord();
            setTotalStudents(total.length);
            const today=moment().format("D");
            const PercentagePresent=(attendanceList.length/(total.length*Number(today))*100)
            setPresentPercentage(PercentagePresent);
            setData([{
              name:'Total Present',
              value:Number(PercentagePresent.toFixed(1)),
              fill:"#8884d8" 
          },
          {
              name:'Total Absent',
              value:100-Number(PercentagePresent.toFixed(1)),
              fill:"#82ca9d" 
          },
      ])
        }
    },[attendanceList])
    //console.log(presentPercentage);



  useEffect(()=>{
    getTotalPresentCount();
    getStudentAttendance();    
  },[selectedMonth||selectedSem])
 

  const getStudentAttendance=async()=>{
    try {
      const month=moment(selectedMonth).format('MM/YYYY');
      const response = await attendanceApi.get(`get-attendance?semester=${selectedSem}&month=${month}`);
      
      setAttendanceList(response.data);      
      
    } catch (error) {
      console.log(error);
    }
  }
  const getTotalPresentCount=async()=>{
    try {
        const month=moment(selectedMonth).format('MM/YYYY');
        const response = await attendanceApi.get(`get-monthly-attendance?semester=${selectedSem}&month=${month}`);
        
        setTotalPresentData(response.data);      
        
      } catch (error) {
        console.log(error);
      }
}
  return (
    <div className='p-10'>
      <div className='flex items-center justify-between'>
      <h2 className='font-bold text-2xl'>Dashboard</h2>
      <div className='flex items-center gap-4'>
        <MonthSelection selectedMonth={setSelectedMonth}/>
        <SemSelection selectedSem={setSelectedSem}/>
      </div>
      </div>
      
      <VisualList icon1={<GraduationCap/>}
      icon2={<TrendingUp/>}
      icon3={<TrendingDown/>}
      title1={"Total Student"}
      title2={"Total Present %"}
      title3={"Total Absent %"}
      value1={totalStudents}
      value2={presentPercentage.toFixed(1)}
      value3={(100-presentPercentage).toFixed(1)}/>

      {/* <VisualList attendanceList={attendanceList}/> */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        <div className='md:col-span-2'>
          <BarChartComp attendanceList={attendanceList} totalPresentData={totalPresentData}/>
        </div>
        <div>
          <PieChartComp data={data}/>
        </div>
      </div>
    </div>
  )
}

export default Dashboard