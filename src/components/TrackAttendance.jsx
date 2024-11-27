import React, { useEffect, useState } from 'react'
import MonthSelection from './MonthSelection'
import { attendanceApi, monthClassApi } from '@/utils/api';
import moment from 'moment';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { GraduationCap, TrendingDown, TrendingUp } from 'lucide-react';
import VisualList from './VisualList';
import PieChartComp from './PieChartComp';
const TrackAttendance = () => {
  const [selectedMonth, setSelectedMonth] = useState();
  const [attendanceList, setAttendanceList] = useState();
  const [totalClassesData, setTotalClassesData] = useState([]);
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.data);
    }
  }, []);

  useEffect(() => {
    if (user && selectedMonth) {
      getStudentAttendance();
      getTotalClasses();
    }
  }, [selectedMonth, user])

  useEffect(() => {
    if (attendanceList && totalClassesData) {
      const PercentagePresent = (attendanceList.length / (totalClassesData.length) * 100)
      setData([{
        name: 'Total Present',
        value: Number(PercentagePresent.toFixed(1)),
        fill: "#8884d8"
      },
      {
        name: 'Total Absent',
        value: 100 - Number(PercentagePresent.toFixed(1)),
        fill: "#82ca9d"
      },
      ])
    }
  }, [attendanceList, totalClassesData])

  const getStudentAttendance = async () => {
    try {
      const month = moment(selectedMonth).format('MM/YYYY');
      const response = await attendanceApi.get(`get-attendance-by-StudentAndMonth?studentId=${user.id}&month=${month}`);

      setAttendanceList(response.data);

    } catch (error) {
      setAttendanceList([])
      console.log(error);
    }
  }
  const getTotalClasses = async () => {
    try {
      const month = moment(selectedMonth).format('MM/YYYY');
      const response = await monthClassApi.get(`getClasses?semester=${user.semester}&month=${month}`)
      setTotalClassesData(response.data.data);

    } catch (error) {
      console.log(error);
    }
  }

  const [newRowData, setNewRowData] = useState([])
  const [newcolDefs, setNewColDefs] = useState([
    { field: 'Class Occurence' }
  ])
  const [rowData, setRowData] = useState();
  const [colDefs, setColDefs] = useState([
    { field: 'studentId' }
  ])
  const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

  const numberOfDays = daysInMonth(
    moment(selectedMonth).format('YYYY'),
    moment(selectedMonth).format('MM')
  );
  // console.log(numberOfDays);
  const daysArray = Array.from({ length: numberOfDays }, (_, i) => i + 1);
  // console.log(daysArray);
  useEffect(() => {
    if (totalClassesData) {
      const uniqueClassList = getUniqueClassRecord();
      setNewColDefs([
        { field: 'Class Occurence' }
      ]);
      daysArray.forEach((date) => {
        setNewColDefs(prevData => [
          ...prevData,
          { field: date.toString(), width: 50, editable: false }
        ]);
      });
      const rowDataWithClass = daysArray.reduce((acc, day) => {
        const found = uniqueClassList.find(item => item.day === day);
        acc[day] = found ? found.occurence : false; // If occurrence exists, use its value, else false
        return acc;
      }, {});
      setNewRowData([rowDataWithClass]);
    }
  }, [selectedMonth, totalClassesData]);
  useEffect(() => {
    if (attendanceList) {
      const uniqueStudentList = getUniqueRecord();
      setColDefs([
        { field: 'studentId', }
      ]);
      daysArray.forEach((date) => {
        setColDefs(prevData => [
          ...prevData,
          { field: date.toString(), width: 50, editable: false }
        ]);
      });

      const rowDataWithAttendance = uniqueStudentList.map(obj => {
        const attendanceData = daysArray.reduce((acc, day) => ({
          ...acc,
          [day]: isPresent(obj.studentId, day)
        }), {});
        return { ...obj, ...attendanceData };
      });
      setRowData(rowDataWithAttendance);
    }
  }, [attendanceList, selectedMonth]);
  const isPresent = (studentId, day) => {
    const result = attendanceList.find(item => item.day == day && item.studentId == studentId)
    return result ? true : false;
  }
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

  const getUniqueClassRecord = () => {
    const uniqueRecord = [];
    const existingStudent = new Set();

    // Check if attendanceList is defined and is an array
    if (!Array.isArray(totalClassesData)) {
      console.error("totalClassesData is not defined or not an array.");
      return uniqueRecord; // Return an empty array if it's not valid
    }

    totalClassesData.forEach((record) => {
      if (!existingStudent.has(record.id)) {
        existingStudent.add(record.id);
        uniqueRecord.push(record);
      }
    });

    return uniqueRecord;
  };
  
  return (
    <div className='p-10'>
      <div className='flex items-center justify-between'>
        <h2 className='font-bold text-2xl'>Track Attendance</h2>
        <div className='flex items-center gap-4'>
          <MonthSelection selectedMonth={setSelectedMonth} />
        </div>
      </div>
      <VisualList icon1={<GraduationCap />}
        icon2={<TrendingUp />}
        icon3={<TrendingDown />}
        title1={"Total Classes"}
        title2={"Total Present"}
        title3={"Total Absent"}
        value1={totalClassesData?.length || 0}
        value2={attendanceList?.length || 0}
        value3={(totalClassesData?.length || 0) - (attendanceList?.length || 0)} />
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        <div className='md:col-span-2 '>
          <div className='mb-5'>
            <h1 className='my-2 font-bold text-lg'>Monthly Classes</h1>
            <div
              className="ag-theme-quartz" // applying the Data Grid theme
              style={{ height: 105 }} // the Data Grid will fill the size of the parent container
            >
              <AgGridReact
                rowData={newRowData}
                columnDefs={newcolDefs}
              />
            </div>
          </div>
          <div>
            <h1 className='my-2 font-bold text-lg'>Monthly Attendance Record</h1>
            <div
              className="ag-theme-quartz" // applying the Data Grid theme
              style={{ height: 110 }} // the Data Grid will fill the size of the parent container
            >
              <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
              />
            </div>
          </div>

        </div>
        <div>
          <PieChartComp data={data} />
        </div>
      </div>
    </div>

  )
}

export default TrackAttendance