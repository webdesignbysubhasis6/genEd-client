import React, { useEffect, useState } from 'react'
import MonthSelection from './MonthSelection'
import SemSelection from './SemSelection';
import { attendanceApi, monthClassApi } from '@/utils/api';
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
  const [totalClassesData, setTotalClassesData] = useState([]);
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
      getStudentAttendance(); 
      getTotalClasses();  
      
    },[selectedMonth || selectedSem])
    useEffect(()=>{
      getTotalPresentCount(); 
    },[attendanceList && selectedMonth])
    useEffect(()=>{
        if(attendanceList)
        { 
            const total=getUniqueRecord();
            setTotalStudents(total.length);
            const PercentagePresent=totalClassesData.length === 0 
            ? 0 : (attendanceList.length/(total.length*totalClassesData.length)*100)
            setPresentPercentage(PercentagePresent);
            setData([{
              name:'Total Present',
              value:Number(PercentagePresent.toFixed(1)),
              fill:"#4caf50" 
          },
          {
              name:'Total Absent',
              value:100-Number(PercentagePresent.toFixed(1)),
              fill:"#f44336" 
          },
      ])
        }
    },[attendanceList])
    //console.log(presentPercentage);



  
  
  const getTotalClasses = async () => {
    try {
      const month = moment(selectedMonth).format('MM/YYYY');
      const response = await monthClassApi.get(`getClasses?semester=${selectedSem}&month=${month}`)
      setTotalClassesData(response.data.data);

    } catch (error) {
      console.log(error);
    }
  }
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
        console.log(totalPresentData);
      } catch (error) {
        console.log(error);
      }
}
  return (
    <div className='p-10 bg-[#dcedf5] min-h-screen'>
      <div className='flex items-center justify-between'>
      <h2 className='font-bold text-3xl text-[#1A3A6E]'>Dashboard</h2>
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
        <div className='md:col-span-2 rounded-2xl shadow-xl border bg-white p-5 transition-transform duration-300 hover:scale-[1.02]'>
  <BarChartComp attendanceList={attendanceList} totalPresentData={totalPresentData} />
</div>

<div className='rounded-2xl shadow-xl border bg-white p-5 transition-transform duration-300 hover:scale-[1.02]'>
  <PieChartComp data={data} />
</div>

      </div>
      </div>
  )
}

export default Dashboard