import React, { useState } from 'react'
import { Button } from './ui/button'
import { useForm } from 'react-hook-form';
import { studentApi, teacherApi } from '@/utils/api';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from './ui/input';
  import { toast } from 'sonner';
import { LoaderIcon } from 'lucide-react';
const AddNewTeacher = ({refreshData}) => {
    const [open,setOpen]=useState(false);
    const { register, handleSubmit, watch,reset, formState: { errors } } = useForm();
    const [loading,setLoading]=useState(false);
    const onSubmit=async (data)=>{
        setLoading(true);
        try {
            const response = await teacherApi.post("/add-teacher", data);
              console.log(response);
              if(response.data)
               {
                reset();
                 setOpen(false);
                 toast('New Teacher added!')
                 refreshData()
               }
               
               setLoading(false);
            
          } catch (error) {
            console.error("Error during login:", error); 
          }
      
        console.log(data);
    }
  return (
    <div>
        <Button onClick={()=>setOpen(true)}>+ Add New Teacher</Button>
        <Dialog open={open}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add New Teacher</DialogTitle>
      <DialogDescription>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className='py-2'>
            <label>Id</label>
            <Input placeholder="Ex. 1" {...register('id',{required:true})}/>
        </div>
        <div className='py-2'>
            <label>Full Name</label>
            <Input placeholder="Ex. Subh Paul" {...register('name',{required:true})}/>
        </div>
        <div className='py-2'>
            <label>Email</label>
            <Input placeholder="Ex. subh@gmail.com" {...register('email',{required:true})}/>
        </div>
        <div className='py-2'>
            <label>Department</label>
            <Input placeholder="Ex. IT" {...register('department',{required:true})}/>
        </div>
        <div className='py-2 flex flex-col'>
            <label>Select Gender</label>
            <select className='p-3 border rounded-lg'
            {...register('gender',{required:true})}>
                <option value={"Male"}>
                    Male
                </option>
                <option value={"Female"}>
                    Female
                </option>
                
            </select>
        </div>
        <div className='py-2'>
            <label>Contact Number</label>
            <Input type="number" placeholder="Ex. 98..."
            {...register('contact')}/>
        </div>
        <div className='flex gap-3 item-center justify-end mt-5'>
            <Button type="button" onClick={()=>setOpen(false)} variant="ghost">Cancel</Button>
            <Button 
                type="submit" disabled={loading}>
                    {loading?<LoaderIcon className='animate-spin'/>:
                    "Save"}
                    </Button>
        </div>
        </form>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

    </div>
  )
}

export default AddNewTeacher