// components/ChangePasswordDialog.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { utilsApi } from "@/utils/api";
import { LoaderIcon } from "lucide-react";

const ChangePasswordDialog = ({ open, setOpen, user }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const handlePasswordChange = async (data) => {
    if (!user) return;
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

  return (
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
  );
};

export default ChangePasswordDialog;
