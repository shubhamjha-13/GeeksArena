import { useEffect, useState } from "react";
import { NavLink } from "react-router"; // Fixed import
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";
import Button1 from "../components/button1";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); // Correctly placed useDispatch hook
  const [userProfile, setUserProfile] = useState(null);

  // Fetch complete user profile data including profile image
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const response = await axiosClient.get("/user/getProfile");
          setUserProfile(response.data);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // If API fails, use basic user data from Redux
          setUserProfile(user);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser()); // Fixed dispatch call
  };

  // Use userProfile if available, otherwise fallback to user from Redux
  const currentUser = userProfile || user;

  return (
    <nav className="navbar fixed top-0 z-50 bg-gradient-to-r from-gray-900 to-black backdrop-blur-lg shadow-lg px-4 flex justify-between">
      <div className="flex-1">
        <Button1>
          <NavLink to="/" className="flex items-center gap-2 text-xl">
            {/* Logo - SVG Version */}
            <div className="w-8 h-8 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Light C shape */}
                <path
                  d="M50 10 C25 10, 10 25, 10 50 C10 75, 25 90, 50 90 L50 75 C33 75, 25 67, 25 50 C25 33, 33 25, 50 25 L50 10 Z"
                  fill="#F8FAFC"
                />
                {/* Cyan G shape */}
                <path
                  d="M65 35 L85 35 L85 90 L70 90 L70 50 L60 50 L65 35 Z"
                  fill="#06B6D4"
                />
                <path
                  d="M45 35 L60 35 L50 50 L35 50 L45 35 Z"
                  fill="#06B6D4"
                />
              </svg>
            </div>
            {/* Brand Name */}
            <span style={{ textTransform: 'none' }}>GeeksArena</span>
          </NavLink>
        </Button1>
      </div>

      {/* Centered navigation section */}
      <div className="flex justify-center flex-4">
        <ul className="menu menu-horizontal gap-1 md:gap-2 px-1">
          <li>
            <Button1>
              <NavLink to="/problems" className={"flex"}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002 2H7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Problems
              </NavLink>
            </Button1>
          </li>
          <li>
            <Button1>
              <NavLink to="/resources" className={({ isActive }) => `flex `}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Resources
              </NavLink>
            </Button1>
          </li>
          <li>
            <Button1>
              <NavLink to="/discuss" className={"flex"}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
                Discussions
              </NavLink>
            </Button1>
          </li>
          <li>
            <Button1>
              <NavLink to="/sheets" className={"flex"}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Sheets
              </NavLink>
            </Button1>
          </li>
        </ul>
      </div>

      <div className="flex-none gap-4">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            {/* Profile Photo */}
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/20 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              {currentUser?.profileImage ? (
                <img
                  src={currentUser.profileImage}
                  alt={`${currentUser?.firstName} ${currentUser?.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-sm">
                  {currentUser?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            
            {/* User Name */}
            <span className="font-medium hidden md:inline text-white/90">
              {currentUser?.firstName}
            </span>
            
            {/* Dropdown Arrow */}
            <svg 
              className="w-4 h-4 text-white/70 hidden md:block" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 z-50">
            <li>
              <NavLink to="/profile" className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </NavLink>
            </li>
            <li>
              <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </li>
            {currentUser?.role === "admin" && (
              <li>
                <NavLink to="/admin" className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}