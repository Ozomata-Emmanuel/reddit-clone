import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiUsers, FiLogOut } from "react-icons/fi";
import { PiRedditLogoFill } from "react-icons/pi";
import { toast } from "react-toastify";

const DashboardSideBar = () => {
  const location = useLocation();
  const navigate = useNavigate()
  
  const navItems = [
    { path: "/dashboard/overview", name: "Overview", icon: <FiHome className="h-5 w-5" /> },
    { path: "/dashboard/users", name: "Users", icon: <FiUsers className="h-5 w-5" /> },
  ];

  function handleLogout (){
    localStorage.removeItem("reddit_user_id")
    toast.info("Logged out successfully", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    navigate("/")
  }

  return (
    <div className="hidden lg:fixed z-10 lg:inset-y-0 lg:flex lg:w-72 lg:flex-col lg:bg-gradient-to-b lg:from-orange-600 lg:to-orange-700  lg:pb-6 shadow-xl border-r border-orange-800">
      <div className="py-5 border-b-2 border-orange-500 mb-10">
        <div className="w-3/5 mx-auto justify-between  text-3xl text-white flex items-center ">
          <h1 className=" font-semibold">Reddit</h1>
          <div className="text-4xl">
            <PiRedditLogoFill className=""/>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path 
              ? 'bg-orange-800 text-white shadow-md' 
              : 'text-orange-100 hover:bg-orange-500 hover:bg-opacity-50'}`}
          >
            <span className="mr-3">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
      
      <div className="px-4 mt-auto">
        <div className="border-t border-orange-500 ">
          <div onClick={handleLogout} className="flex pt-4 hover:animate-pulse pb-2 items-center text-orange-100 hover:text-white cursor-pointer">
            <FiLogOut className="h-5 w-5 mr-3" />
            <span className="font-medium">Sign Out</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSideBar;