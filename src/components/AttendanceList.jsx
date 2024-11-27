import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import moment from 'moment';
import { attendanceApi, monthClassApi } from '@/utils/api';
import { toast } from 'sonner';
const AttendanceList = ({ attendanceList, selectedMonth,selectedSem,monthClassList }) => {
    // console.log(attendanceList);
    // console.log(typeof(attendanceList));
    const pagination = true;
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [25, 50, 100];
    const [rowData, setRowData] = useState();
    const [colDefs, setColDefs] = useState([
        { field: 'studentId', filter: true },
        { field: 'name', filter: true }
    ])
    const [newRowData,setNewRowData]=useState([])
    const [newcolDefs, setNewColDefs] = useState([
        {field: 'Class Occurence'}
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
        if (attendanceList) {
            const uniqueStudentList = getUniqueRecord();
            const uniqueClassList=getUniqueClassRecord();
            setColDefs([
                { field: 'studentId', filter: true },
                { field: 'name', filter: true }
            ]);
            setNewColDefs([
                {field: 'Class Occurence'}
            ]);
            daysArray.forEach((date) => {
                setNewColDefs(prevData => [
                    ...prevData,
                    { field: date.toString(), width: 50, editable: true }
                ]);
            });
            daysArray.forEach((date) => {
                setColDefs(prevData => [
                    ...prevData,
                    { field: date.toString(), width: 50, editable: true }
                ]);
            });

            const rowDataWithAttendance = uniqueStudentList.map(obj => {
                const attendanceData = daysArray.reduce((acc, day) => ({
                    ...acc,
                    [day]: isPresent(obj.studentId, day)
                }), {});
                return { ...obj, ...attendanceData };
            });
            const rowDataWithClass = daysArray.reduce((acc, day) => {
                const found = uniqueClassList.find(item => item.day === day);
                acc[day] = found ? found.occurence : false; // If occurrence exists, use its value, else false
                return acc;
            }, {});
            setNewRowData([rowDataWithClass]);
            setRowData(rowDataWithAttendance);
        }
    }, [attendanceList, selectedMonth,monthClassList]);


    const isPresent = (studentId, day) => {
        const result = attendanceList.find(item => item.day == day && item.studentId == studentId)
        return result ? true : false;
    }
    
    
    const getUniqueClassRecord = () => {
        const uniqueRecord = [];
        const existingStudent = new Set();

        // Check if attendanceList is defined and is an array
        if (!Array.isArray(monthClassList)) {
            console.error("monthClassList is not defined or not an array.");
            return uniqueRecord; // Return an empty array if it's not valid
        }

        monthClassList.forEach((record) => {
            if (!existingStudent.has(record.id)) {
                existingStudent.add(record.id);
                uniqueRecord.push(record);
            }
        });

        return uniqueRecord;
    };
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
    const onMarkClass=async(day, classStatus)=>{
        const date = moment(selectedMonth).format('MM/YYYY');
        const currentDate = moment(selectedMonth).format('MM/YYYY');;
        const id = `${selectedSem}-${day}/${currentDate}`;
        if (classStatus) {
            const data = {
                id: id,
                day: day,
                occurrence: classStatus,
                date: date
            }
            try {
                const response = await monthClassApi.post("/add-monthly-class", data);
                console.log(response);
                if (response.data) {
                    toast(`Class on day ${day} taking place!`)
                }

            } catch (error) {
                console.error("Error during adding:", error);
            }
        }
        else {
            try {
                const response = await monthClassApi.delete(`/delete-monthly-class?id=${id}`);
                if (response.data) {
                    toast(`Class on day ${day} not occuring!`);
                }
            } catch (error) {
                console.error("Error during deletion:", error);
                toast.error("Failed to delete the class. Please try again.");
            }
        
        }
    }
    const onMarkAttendance = async (day, studentId, presentStatus) => {
        const date = moment(selectedMonth).format('MM/YYYY');
        const currentDate = moment(selectedMonth).format('MM/YYYY');;
        const id = `${studentId}-${day}/${currentDate}`;
        if (presentStatus) {
            const data = {
                id: id,
                day: day,
                studentId: studentId,
                present: presentStatus,
                date: date
            }
            try {
                const response = await attendanceApi.post("/add-attendance", data);
                console.log(response);
                if (response.data) {
                    toast(`Student id: ${studentId} marked as present!`)
                }

            } catch (error) {
                console.error("Error during adding:", error);
            }
        }
        else {
            try {
                const response = await attendanceApi.delete(`/delete-attendance?studentId=${studentId}&day=${day}&date=${date}`);
                console.log(response);
                if (response.data) {
                    toast(`Student id: ${studentId} marked as absent!`)
                }

            } catch (error) {
                console.error("Error during deleting:", error);
            }
        }
    }
    return (
        <div>
            <div
                className="ag-theme-quartz" // applying the Data Grid theme
                style={{ height: 105 }} // the Data Grid will fill the size of the parent container
            >
                <AgGridReact
                    rowData={newRowData}
                    columnDefs={newcolDefs}
                    onCellValueChanged={(e) => onMarkClass(e.colDef.field, e.newValue)}
                />
            </div>
            <div
                className="ag-theme-quartz" // applying the Data Grid theme
                style={{ height: 375 }} // the Data Grid will fill the size of the parent container
            >
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    onCellValueChanged={(e) => onMarkAttendance(e.colDef.field, e.data.studentId, e.newValue)}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                />
            </div>
        </div>
    )
}

export default AttendanceList