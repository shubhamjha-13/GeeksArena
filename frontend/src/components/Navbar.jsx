import { useEffect, useState } from "react";
import { NavLink } from "react-router";  // Fixed import
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";
import Button1 from "../components/button1";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();  // Correctly placed useDispatch hook

  const handleLogout = () => {
    dispatch(logoutUser());  // Fixed dispatch call
  };

  return (
    <nav className="navbar fixed top-0 z-50 bg-transparent backdrop-blur-lg shadow-lg px-4 flex justify-between">
      <div className="flex-1">
        <Button1>
        <NavLink to="/" className="text-xl">
          GeeksArena
        </NavLink>
        </Button1>
      </div>

      {/* Centered navigation section */}
      <div className="flex justify-center flex-4">
        <ul className="menu menu-horizontal gap-1 md:gap-2 px-1">
          <li>
            <Button1>
            <NavLink
              to="/problems"
              className={"flex"}
            >
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Problems
            </NavLink>
           
            </Button1>
            
          </li>
          <li>
            <Button1>
            <NavLink
              to="/resources"
              className={({isActive}) => `flex `}
            >
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
            <NavLink
              to="/discuss"
              className={"flex"}
            >
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
            <NavLink
              to="/sheets"
              className={"flex"}
            >
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
          <div tabIndex={0} className="flex items-center gap-2 cursor-pointer">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
            <span className="font-medium hidden md:inline">{user?.firstName}</span>
          </div>
          <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 z-50">
            <li>
              <NavLink to="/profile">Profile</NavLink>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
            {user?.role === "admin" && (
              <li>
                <NavLink to="/admin">Admin</NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}