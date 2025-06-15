import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { teacherApi } from '@/utils/api';
import { toast } from 'sonner';
  
const TeacherListTable = ({teacherList,refreshData}) => {
    const pagination = true;
const paginationPageSize = 10;
const paginationPageSizeSelector = [25, 50, 100];
    const CustomButtons=(props)=>{
        return (<AlertDialog>
            <AlertDialogTrigger>
            <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your record
                  and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={()=>DeleteRecord(props?.data?.id)}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          )
    }
    const [colDefs,setColDefs]=useState([
        {field:"id",filter:true},
        {field:"name",filter:true},
        {field:"email",filter:true},
        {field:"department",filter:true},
        {field:"gender",filter:true},
        {field:"contact",filter:true},
        {field:"Remove",cellRenderer:CustomButtons},
    ])
    const [rowData,setRowData]=useState();
    const [searchInput,setSearchInput]=useState();
    useEffect(()=>{
        teacherList&& setRowData(teacherList)
    },[teacherList])
const DeleteRecord=async (id)=>{
    try {
        const response = await teacherApi.get(`/deleteRecord?id=${id}`);
        console.log(response); 
        if(response.data)
        {
            toast("Teacher Deleted!");
            refreshData();
        }
        
      } catch (error) {
        console.log(error);
      }
}

  return (
    <div className='my-7'>
         <div
  className="ag-theme-quartz" // applying the Data Grid theme
  style={{ height: 500 }} // the Data Grid will fill the size of the parent container
 >

    <div className='p-2 rounded-lg border shawdow-sm flex gap-2
    mb-4 max-w-sm bg-white rounded-2xl shadow-xl border transition-transform duration-300 hover:scale-[1.01]'>
        <Search/>
        <input type="text" placeholder='Search' 
        className='outline-none w-full'
        onChange={(e)=>setSearchInput(e.target.value)}/>
    </div>
   <AgGridReact className='bg-white rounded-2xl shadow-xl border transition-transform duration-300 hover:scale-[1.01]'
       rowData={rowData}
       columnDefs={colDefs}
       quickFilterText={searchInput}
       pagination={pagination}
    paginationPageSize={paginationPageSize}
    paginationPageSizeSelector={paginationPageSizeSelector}
   />
 </div>
    </div>
  )
}

export default TeacherListTable