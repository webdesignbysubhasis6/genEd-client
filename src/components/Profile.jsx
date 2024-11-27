import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { LoaderIcon } from 'lucide-react';
import { Button } from "./ui/button";
import { utilsApi } from "@/utils/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [open, setOpen] = useState(false); // For dialog visibility
  const [loading, setLoading] = useState(false); // To indicate submission state

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.data); 
      setRole(parsedUser.role); 
    }
  }, []);

  const handlePasswordChange =async (data) => {
    setLoading(true);
    const updatedData = { ...data,...user};
    try {
      const response = await utilsApi.post('/change-password', updatedData);
      //console.log(response.data);
      if (response.status === 200) {
        toast.success('Password Changed Succesfully!');
        reset();
        setOpen(false);
      } else {
        toast.error(response.data.message || 'failed');
      }
    } catch (error) {
      console.error('Error during password change:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred during password change';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-7">
      <div className="flex justify-between">
      <h2 className="font-bold text-2xl flex justify-between items-center mb-4">
        Profile
      </h2>
      <Button onClick={() => setOpen(true)}>
      Change Password
    </Button>
      </div>
      
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="max-w-md mx-auto">
      <DialogHeader>
        <DialogTitle>
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold">Change Password</h2>
          </div>
        </DialogTitle>
      </DialogHeader>
      <DialogDescription>
        <form
          onSubmit={handleSubmit(handlePasswordChange)}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Old Password</label>
            <Input
              type="password"
              placeholder="Enter old password"
              {...register("oldPassword", { required: true })}
            />
            {errors.oldPassword && (
              <span className="text-red-500 text-sm">
                Old password is required
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <Input
              type="password"
              placeholder="Enter new password"
              {...register("newPassword", { required: true, minLength: 6 })}
            />
            {errors.newPassword && (
              <span className="text-red-500 text-sm">
                {errors.newPassword.type === "minLength"
                  ? "Password must be at least 6 characters"
                  : "New password is required"}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <Input
              type="password"
              placeholder="Confirm new password"
              {...register("confirmPassword", {
                required: true,
                validate: (value) =>
                  value === watch("newPassword") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          
          <div className="flex gap-3 items-center justify-end">
            <Button type="button" onClick={() => setOpen(false)} variant="ghost">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderIcon className="animate-spin" /> : "Change"}
            </Button>
          </div>
        </form>
      </DialogDescription>
    </DialogContent>
  </Dialog>
      {user ? (
        <div className="bg-white shadow-md rounded-md p-6 space-y-6">
          {/* Avatar and basic information */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex justify-center items-center text-xl font-bold text-gray-600">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-sm font-medium text-indigo-500">Role: {role}</p>
            </div>
          </div>

          {/* Role-based information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700">Contact</h4>
              <p className="text-gray-600">{user.contact}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Gender</h4>
              <p className="text-gray-600">{user.gender}</p>
            </div>

            {/* Fields specific to Students */}
            {role === "student" && (
              <>
                <div>
                  <h4 className="font-medium text-gray-700">Semester</h4>
                  <p className="text-gray-600">{user.semester}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Student ID</h4>
                  <p className="text-gray-600">{user.id}</p>
                </div>
              </>
            )}

            {/* Fields specific to Teachers */}
            {role === "teacher" && (
              <div>
                <h4 className="font-medium text-gray-700">Department</h4>
                <p className="text-gray-600">{user.department}</p>
              </div>
            )}

            {/* Fields specific to Admins */}
            {role === "admin" && (
              <div>
                <h4 className="font-medium text-gray-700">Admin ID</h4>
                <p className="text-gray-600">{user.id}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No user information available.</p>
      )}
    </div>
  );
};

export default Profile;
