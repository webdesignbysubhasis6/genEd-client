import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { Button } from "./ui/button";
import { teacherApi, utilsApi } from "@/utils/api";
import { studentApi } from "@/utils/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // Add this new state at the top
  const [loadingUpload, setLoadingUpload] = useState(false);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

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

  const handlePasswordChange = async (data) => {
    setLoading(true);
    const updatedData = { ...data, ...user };
    try {
      const response = await utilsApi.post("/change-password", updatedData);
      if (response.status === 200) {
        toast.success("Password Changed Successfully!");
        reset();
        setOpen(false);
      } else {
        toast.error(response.data.message || "Failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error changing password";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage || !user?.id) {
      toast.error("No image selected.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("id", user.id);

    try {
      let res;
      // if(role=='admin')
      // {
      //     res = await .post("/update-profile-image", formData, {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   });
      // }
      if(role=='teacher')
      {
          res = await teacherApi.post("/update-profile-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      else{
          res = await studentApi.post("/update-profile-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      const data = res.data;
      toast.success("Profile image updated!");

      const updatedUser = { ...user, image: data.imageUrl };
      setUser(updatedUser);
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("user")),
          data: updatedUser,
        })
      );
      setImageModalOpen(false);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Error uploading image";
      toast.error(errMsg);
      console.error(error);
    }
  };

  return (
    <div className="p-7 ">
      <div className="flex justify-between">
        <h2 className="font-bold text-2xl mb-4">Profile</h2>
        <Button onClick={() => setOpen(true)}>Change Password</Button>
      </div>

      {/* Change Password Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              Change Password
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <form
              onSubmit={handleSubmit(handlePasswordChange)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Old Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter old password"
                  {...register("oldPassword", { required: true })}
                />
                {errors.oldPassword && (
                  <p className="text-red-500 text-sm">
                    Old password is required
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  {...register("newPassword", { required: true, minLength: 6 })}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.newPassword.type === "minLength"
                      ? "Minimum 6 characters required"
                      : "New password is required"}
                  </p>
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
                    validate: (val) =>
                      val === watch("newPassword") || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setOpen(false)}>
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

      {/* Image Upload Modal */}
      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
  <DialogContent className="w-full max-w-md h-[80vh] flex flex-col justify-between">
    <DialogHeader>
      <DialogTitle className="text-center text-xl mb-2">
        Edit Profile Picture
      </DialogTitle>
    </DialogHeader>

    {/* Top: Image Preview */}
    <div className="flex justify-center items-center flex-1">
      {previewUrl || user?.image ? (
        <img
          src={previewUrl || user.image}
          alt="Preview"
          className="w-60 h-60 object-cover rounded-full border shadow-md"
        />
      ) : (
        <div className="w-60 h-60 rounded-full bg-gray-300 flex items-center justify-center text-5xl font-semibold text-gray-700 border shadow-md">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      )}
    </div>

    {/* Bottom: Controls */}
    <div className="flex flex-col gap-3 mt-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
          }
        }}
      />
      <Button
        onClick={async () => {
          setLoadingUpload(true);
          await handleImageUpload();
          setLoadingUpload(false);
        }}
        disabled={!selectedImage || loadingUpload}
        className="w-full"
      >
        {loadingUpload ? (
          <LoaderIcon className="animate-spin mr-2" />
        ) : null}
        {loadingUpload ? "Uploading..." : "Upload Image"}
      </Button>
      <Button
        variant="ghost"
        onClick={() => setImageModalOpen(false)}
        className="w-full"
      >
        Cancel
      </Button>
    </div>
  </DialogContent>
</Dialog>


      {/* Profile Card */}
      {user ? (
        <div className="bg-white shadow-md rounded-md p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div
              className="relative group w-24 h-24 cursor-pointer"
              onClick={() => setImageModalOpen(true)}
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex justify-center items-center text-3xl font-bold text-gray-600">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536M9 11l3-3 6 6-3 3-6-6z"
                  />
                </svg>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-sm font-medium text-indigo-500">
                Role: {role}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700">Contact</h4>
              <p className="text-gray-600">{user.contact}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Gender</h4>
              <p className="text-gray-600">{user.gender}</p>
            </div>

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

            {role === "teacher" && (
              <div>
                <h4 className="font-medium text-gray-700">Department</h4>
                <p className="text-gray-600">{user.department}</p>
              </div>
            )}

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
