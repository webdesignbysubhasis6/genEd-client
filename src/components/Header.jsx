import React from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Show success message
    toast.success('Logged out successfully!');

    // Redirect to the landing page
    navigate('/');
  };

  return (
    <div className='p-4 shadow-sm border flex justify-between'>
      <div>
        {/* You can add any branding or additional elements here */}
      </div>
      <div>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
};

export default Header;
