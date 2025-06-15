import React, { useState } from 'react'
import MonthSelection from './MonthSelection'
import SemSelection from './SemSelection'
import { Button } from './ui/button'
import { attendanceApi, monthClassApi } from '@/utils/api'
import moment from 'moment'
import AttendanceList from './AttendanceList'
const Attendance = () => {
  const [selectedMonth,setSelectedMonth]=useState();
  const [selectedSem,setSelectedSem]=useState();
  const [attendanceList,setAttendanceList]=useState();
  const [monthClassList,setMonthClassList]=useState();
  const onSearchHandler=async ()=>{
    try {
      
      const month=moment(selectedMonth).format('MM/YYYY');
      console.log(month,selectedSem);

      const response = await attendanceApi.get(`get-attendance?semester=${selectedSem}&month=${month}`);
    
      setAttendanceList(response.data);      
      const res=await monthClassApi.get(`getClasses?semester=${selectedSem}&month=${month}`)
      setMonthClassList(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='p-10 '>
      <h2 className='text-2xl font-bold mb-1'>Take Attendance</h2>
      <div className='flex flex-col gap-4 p-5 border rounded-lg shadow-sm sm:flex-row'>
        <div className='flex gap-2 items-center'>
          <label>Select Month:</label>
          <MonthSelection selectedMonth={(value)=>setSelectedMonth(value)}/>
        </div>

        <div className='flex gap-2 items-center'>
          <label>Select Semester:</label>
          <SemSelection selectedSem={(v)=>setSelectedSem(v)}/>
        </div>
        <Button
        onClick={()=>onSearchHandler()}>Search</Button>
      </div>
      <AttendanceList attendanceList={attendanceList}
      monthClassList={monthClassList}
      selectedSem={selectedSem}
      selectedMonth={selectedMonth}/>
    </div>
  )
}

export default Attendance