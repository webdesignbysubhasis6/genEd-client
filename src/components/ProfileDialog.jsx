// components/ProfileDialog.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { teacherApi, utilsApi, studentApi } from "@/utils/api";

const ProfileDialog = ({ open, setOpen }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false); // NEW

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
    try {
      const updatedData = { ...data, ...user };
      const response = await utilsApi.post("/change-password", updatedData);
      if (response.status === 200) {
        toast.success("Password Changed Successfully!");
        reset();
        setShowPasswordForm(false);
      } else {
        toast.error(response.data.message || "Failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error changing password");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage || !user?.id) return toast.error("No image selected.");

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("id", user.id);

    try {
      setLoadingUpload(true); // Start spinner
      let res;
      if (role === "teacher") {
        res = await teacherApi.post("/update-profile-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await studentApi.post("/update-profile-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const updatedUser = { ...user, image: res.data.imageUrl };
      setUser(updatedUser);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...JSON.parse(localStorage.getItem("user")), data: updatedUser })
      );
      toast.success("Profile image updated!");
      setImageModalOpen(false);
      setSelectedImage(null);
      setPreviewUrl("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload error");
    } finally {
      setLoadingUpload(false); // Stop spinner
    }
  };

  return (
    <>
      {/* Profile Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
          </DialogHeader>
          {user ? (
            <div className="space-y-6">
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
                  <p className="text-sm font-medium text-indigo-500">Role: {role}</p>
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
              </div>

              {/* Toggle Change Password Button */}
              <div className="mt-4">
                <Button variant="outline" onClick={() => setShowPasswordForm(!showPasswordForm)}>
                  {showPasswordForm ? "Cancel Password Change" : "Change Password"}
                </Button>
              </div>

              {/* Password Form */}
              {showPasswordForm && (
                <div className="mt-6 border-t pt-4">
                  <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Old Password"
                        type="password"
                        {...register("oldPassword", { required: true })}
                      />
                      {errors.oldPassword && (
                        <p className="text-red-500 text-sm">Old password is required</p>
                      )}
                    </div>
                    <div>
                      <Input
                        placeholder="New Password"
                        type="password"
                        {...register("newPassword", { required: true, minLength: 6 })}
                      />
                      {errors.newPassword && (
                        <p className="text-red-500 text-sm">
                          {errors.newPassword.type === "minLength"
                            ? "Minimum 6 characters required"
                            : "Required"}
                        </p>
                      )}
                    </div>
                    <div>
                      <Input
                        placeholder="Confirm Password"
                        type="password"
                        {...register("confirmPassword", {
                          required: true,
                          validate: (val) =>
                            val === watch("newPassword") || "Passwords do not match",
                        })}
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                      )}
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="submit" disabled={loading}>
                        {loading ? <LoaderIcon className="animate-spin" /> : "Change"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {previewUrl || user?.image ? (
              <img
                src={previewUrl || user.image}
                className="w-40 h-40 rounded-full object-cover"
                alt="Preview"
              />
            ) : (
              <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center text-5xl text-gray-700 font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
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
            <Button onClick={handleImageUpload} disabled={!selectedImage || loadingUpload}>
              {loadingUpload ? (
                <>
                  <LoaderIcon className="animate-spin mr-2 w-4 h-4" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileDialog;
