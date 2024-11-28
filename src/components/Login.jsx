import React, { useState } from 'react';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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
import { authApi } from '@/utils/api';

const Login = ({title}) => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authApi.post('/login', data);
      //console.log(response.data);
      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(response.data));
        toast.success('Login successful!');
        reset();
        setOpen(false);
        navigate('/home');
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred during login';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>{title}</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md mx-auto">
          {/* Added max-w-md for fixed width and mx-auto for centering */}
          <DialogHeader>
            <DialogTitle>
              <div className="flex flex-col items-center">
                <img src="/logo-main.jpg" alt="Website Logo" className="w-16 h-16 mb-4 rounded-full"/>
                <h2 className="text-xl font-semibold">Sign in to GenEd</h2>
              </div>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">User Id</label>
                <Input
                  placeholder="Enter your UserId"
                  {...register('id', { required: true })}
                />
                {errors.name && <span className="text-red-500 text-sm">UserId is required</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...register('password', { required: true })}
                />
                {errors.id && <span className="text-red-500 text-sm">Password is required</span>}
              </div>
              <div className="flex gap-3 items-center justify-end">
                <Button type="button" onClick={() => setOpen(false)} variant="ghost">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <LoaderIcon className="animate-spin" /> : 'Login'}
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
