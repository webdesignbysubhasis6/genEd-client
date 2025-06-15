import React, { useEffect, useState } from "react";
import { Activity, LayoutIcon, LogOut, MessageCircle, Microscope, Notebook, Route, School, TrendingUpDown, User, UserPen } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { toast } from "sonner";
import ProfileDialog from "./ProfileDialog";

const SideNav = () => {
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

  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    // Retrieve and parse user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.data); // Extract user data
      setRole(parsedUser.role); // Extract role
    }
  }, []); // Run only once on component mount
  

  // Menu items
  const menuList = [
    // {
    //   id: 1,
    //   name: "Profile",
    //   icon: UserPen,
    //   path: "/home/profile",
    //   roles: ["student", "teacher", "admin"], // Accessible by all
    // },
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutIcon,
      path: "/home/dashboard",
      roles: ["teacher", "admin"], 
    },
    {
      id: 2,
      name: "Track Attendance",
      icon: Activity,
      path: "/home/track",
      roles: ["student"], 
    },
    {
      id: 3,
      name: "Take Attendance",
      icon: Notebook,
      path: "/home/attendance",
      roles: ["teacher"], // Accessible by teachers only
    },
    {
      id: 4,
      name: "Manage Students",
      icon: School,
      path: "/home/student",
      roles: ["admin"], // Accessible by admins only
    },
    {
      id: 5,
      name: "Manage Teachers",
      icon: Microscope,
      path: "/home/teacher",
      roles: ["admin"], // Accessible by admins only
    },
    {
      id: 6,
      name: "Predict CGPA",
      icon: TrendingUpDown,
      path: "/home/predict",
      roles: ["student"], // Accessible by admins only
    },
    {
      id: 7,
      name: "Track By Student",
      icon: Activity,
      path: "/home/trackbystudent",
      roles: ["teacher"], 
    },
    {
      id: 8,
      name: "Feedback",
      icon: MessageCircle,
      path: "/home/feedback",
      roles: ["student","teacher"], 
    },
    {
      id: 9,
      name: "Feedbacks",
      icon: MessageCircle,
      path: "/home/feedbacks",
      roles: ["admin"], 
    },
    {
      id: 10,
      name: "Recommendation",
      icon: Route,
      path: "/home/recommendation",
      roles: ["student"], 
    },
  ];

  // Filter menu items based on user role
  const accessibleMenuList = menuList.filter((menu) => menu.roles.includes(role));

  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="border shadow-md h-screen p-5">
      <div className="flex justify-center item-center gap-3">
      <img className="border-2 border-white rounded-full" src={"/logo-main.jpg"} alt="Logo" width={55}  />
      <div className="text-4xl font-bold text-white mt-1">GenEd</div>
      </div>
      
      <hr className="my-5" />

      {/* Render filtered menu items */}
      {accessibleMenuList.map((menu, index) => (
        <Link key={index} to={menu.path}>
          <h2
            className={`flex items-center gap-3 text-md p-4
            text-white
            hover:bg-primary
            hover:text-white
            cursor-pointer
            rounded-lg
            my-2
            ${path === menu.path && "bg-primary text-white"}
            `}
          >
            <menu.icon />
            {menu.name}
          </h2>
        </Link>
      ))}

      {/* Display user info */}
      {user && (
        <div className="fixed bottom-5 bg-white rounded-xl shadow-md p-2 flex items-center justify-between gap-3 z-10">
          <div className="border-2 border-[#1A3A6E] flex rounded-lg">
            <Button
              className="flex items-center gap-3 text-md text-black bg-white hover:bg-[#1A3A6E] hover:text-white px-4 py-2"
              onClick={() => setOpenProfile(true)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
                {user?.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <span>{user?.name}</span>
            </Button>

            <Button variant="ghost" onClick={handleLogout} className="text-red-500 hover:bg-red-100">
              <LogOut size={20} />
            </Button>

            <ProfileDialog open={openProfile} setOpen={setOpenProfile} />
            </div>
        </div>
      )}
    </div>
  );
};

export default SideNav;
