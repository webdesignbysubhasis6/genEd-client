import React, { useEffect, useState } from 'react'
import AddNewStudent from './AddNewStudent'
import { studentApi } from '@/utils/api';
import StudentListTable from './StudentListTable';
const Student = () => {
  const [studentList,setStudentList]=useState([]);
  useEffect(()=>{
    getAllStudents();
  },[])

  const getAllStudents = async () => {
    try {
      const response = await studentApi.get('/get-all-students');
      console.log(response.data); 
      setStudentList(response.data.data);
      
    } catch (error) {
      setError('Failed to fetch leaderboard data');
      setLoading(false);
    }
  };
  return (
    <div className='p-7'>
        <h2 className='font-bold text-2xl flex justify-between item-center'>Students
            <AddNewStudent
            refreshData={getAllStudents}/>
        </h2>
        <StudentListTable studentList={studentList}
        refreshData={getAllStudents}/>
    </div>
  )
}

export default Student