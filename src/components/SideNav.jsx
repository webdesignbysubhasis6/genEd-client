import React, { useEffect, useState } from "react";
import { Activity, LayoutIcon, Microscope, Notebook, School, TrendingUpDown, UserPen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const SideNav = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");

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
    {
      id: 1,
      name: "Profile",
      icon: UserPen,
      path: "/home/profile",
      roles: ["student", "teacher", "admin"], // Accessible by all
    },
    {
      id: 2,
      name: "Dashboard",
      icon: LayoutIcon,
      path: "/home/dashboard",
      roles: ["teacher", "admin"], 
    },
    {
      id: 3,
      name: "Track Attendance",
      icon: Activity,
      path: "/home/track",
      roles: ["student"], 
    },
    {
      id: 4,
      name: "Take Attendance",
      icon: Notebook,
      path: "/home/attendance",
      roles: ["teacher"], // Accessible by teachers only
    },
    {
      id: 5,
      name: "Manage Students",
      icon: School,
      path: "/home/student",
      roles: ["admin"], // Accessible by admins only
    },
    {
      id: 6,
      name: "Manage Teachers",
      icon: Microscope,
      path: "/home/teacher",
      roles: ["admin"], // Accessible by admins only
    },
    {
      id: 7,
      name: "Predict CGPA",
      icon: TrendingUpDown,
      path: "/home/predict",
      roles: ["student"], // Accessible by admins only
    },
  ];

  // Filter menu items based on user role
  const accessibleMenuList = menuList.filter((menu) => menu.roles.includes(role));

  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="border shadow-md h-screen p-5">
      <img src={"/logo.svg"} alt="Logo" width={180} height={50} />

      <hr className="my-5" />

      {/* Render filtered menu items */}
      {accessibleMenuList.map((menu, index) => (
        <Link key={index} to={menu.path}>
          <h2
            className={`flex items-center gap-3 text-md p-4
            text-slate-500
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
        <div className="flex gap-2 items-center fixed bottom-5">
          <div>
            <h2 className="text-sm font-bold">{user.name}</h2>
            <h2 className="text-xs text-slate-400">{user.email}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideNav;
