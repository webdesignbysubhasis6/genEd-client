import React, { useEffect, useState } from 'react'
import TeacherListTable from './TeacherListTable'
import AddNewTeacher from './AddNewTeacher'
import { teacherApi } from '@/utils/api';

const Teacher = () => {
    const [teacherList,setTeacherList]=useState([]);
  useEffect(()=>{
    getAllTeachers();
  },[])

  const getAllTeachers = async () => {
    try {
      const response = await teacherApi.get('/get-all-teachers');
      console.log(response.data); 
      setTeacherList(response.data.data);
      
    } catch (error) {
      setError('Failed to fetch leaderboard data');
      setLoading(false);
    }
  };
  return (
    <div className='p-7'>
        <h2 className='font-bold text-2xl flex justify-between item-center'>Teacher
            <AddNewTeacher refreshData={getAllTeachers}/>
        </h2>
        <TeacherListTable teacherList={teacherList}
        refreshData={getAllTeachers}/>
    </div>
  )
}

export default Teacher