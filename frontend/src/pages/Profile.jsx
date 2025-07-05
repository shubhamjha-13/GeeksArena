// src/pages/Profile.js
import React, { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUserProfile] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    emailId: "",
    role: "user",
    problemSolved: 0,
    problems: [],
    joinDate: "",
    posts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [problemStats, setProblemStats] = useState({
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/user/getProfile");
        setUserProfile({
          _id: response.data._id || "",
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          emailId: response.data.emailId || "",
          role: response.data.role || "user",
          problemSolved: response.data.problemSolvedCount,
          problems: response.data.problems || [],
          joinDate: response.data.joinDate || new Date().toISOString(),
          posts: response.data.posts || [],
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Calculate problem statistics
  useEffect(() => {
    if (user.problems && user.problems.length > 0) {
      const stats = {
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
      };

      user.problems.forEach((problem) => {
        const difficulty = problem.difficulty?.toLowerCase();
        if (difficulty === "easy") stats.easySolved++;
        else if (difficulty === "medium") stats.mediumSolved++;
        else if (difficulty === "hard") stats.hardSolved++;
      });

      setProblemStats(stats);
    }
  }, [user.problems]);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    const diff = difficulty?.toLowerCase();
    if (diff === "easy") return "bg-green-100 text-green-800";
    if (diff === "medium") return "bg-yellow-100 text-yellow-800";
    if (diff === "hard") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  // Calculate progress percentage
  const calculateProgress = (count) => {
    const total = user.problemSolved || 1;
    return Math.min(100, (count / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-12 bg-gradient-to-br from-gray-900 to-gray-950">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-12 bg-gradient-to-br from-gray-900 to-gray-950">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 bg-gradient-to-br from-gray-900 to-gray-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="bg-gray-800 border-2 border-gray-700 rounded-xl w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
              <span className="text-4xl text-white">
                {user.firstName.charAt(0)}
              </span>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-300 mt-1">{user.emailId}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/user/update/${user._id}`)}
                  className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition"
                >
                  Edit Profile
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center bg-gray-800/50 p-3 rounded-xl">
                  <p className="text-sm text-gray-300">Solved</p>
                  <p className="text-xl font-bold text-green-400">
                    {user.problemSolved}
                  </p>
                </div>
                <div className="text-center bg-gray-800/50 p-3 rounded-xl">
                  <p className="text-sm text-gray-300">Easy</p>
                  <p className="text-xl font-bold text-green-400">
                    {problemStats.easySolved}
                  </p>
                </div>
                <div className="text-center bg-gray-800/50 p-3 rounded-xl">
                  <p className="text-sm text-gray-300">Medium</p>
                  <p className="text-xl font-bold text-yellow-400">
                    {problemStats.mediumSolved}
                  </p>
                </div>
                <div className="text-center bg-gray-800/50 p-3 rounded-xl">
                  <p className="text-sm text-gray-300">Hard</p>
                  <p className="text-xl font-bold text-red-400">
                    {problemStats.hardSolved}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-gray-300 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 inline mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Member since {user.joinDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Problems Solved Card */}
            <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Problem Statistics
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-green-400">
                      Easy
                    </span>
                    <span className="text-sm font-medium text-gray-300">
                      {problemStats.easySolved} solved
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{
                        width: `${calculateProgress(problemStats.easySolved)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-yellow-400">
                      Medium
                    </span>
                    <span className="text-sm font-medium text-gray-300">
                      {problemStats.mediumSolved} solved
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-yellow-500 h-2.5 rounded-full"
                      style={{
                        width: `${calculateProgress(
                          problemStats.mediumSolved
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-red-400">
                      Hard
                    </span>
                    <span className="text-sm font-medium text-gray-300">
                      {problemStats.hardSolved} solved
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-red-500 h-2.5 rounded-full"
                      style={{
                        width: `${calculateProgress(problemStats.hardSolved)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* POSTS LIST */}
            <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Your Posts</h2>
                <span className="text-sm font-medium text-indigo-400">
                  {user.posts.length} posts
                </span>
              </div>

              {user.posts.length === 0 ? (
                <div className="text-center py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-500"
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
                  <p className="text-gray-400 mt-4">
                    You haven't created any posts yet
                  </p>
                  <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                    Create Your First Post
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {user.posts.map((post) => (
                    <div key={post._id} className="py-4">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-white">
                          {post.title}
                        </h3>
                        <span className="text-sm text-gray-400">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-300 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {post.tags &&
                          post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300"
                            >
                              #{tag}
                            </span>
                          ))}
                      </div>
                      <div className="mt-3 flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-400">
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
                              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                            />
                          </svg>
                          {Math.floor(Math.random() * 20) + 1}
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
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
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          {Math.floor(Math.random() * 10) + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 text-center">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors">
                  View All Posts
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Solved Problems Card */}
            <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Solved Problems
              </h2>

              {user.problems.length === 0 ? (
                <div className="text-center py-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <p className="text-gray-400 mt-4">No problems solved yet</p>
                  <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                    Start Solving
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.problems.map((problem, index) => (
                    <div
                      key={index}
                      className="bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-white">
                          {problem.title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(
                            problem.difficulty
                          )}`}
                        >
                          {problem.difficulty?.charAt(0).toUpperCase() +
                            problem.difficulty?.slice(1)}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {problem.tags && (
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-600 text-gray-300">
                            {problem.tags}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activity Stats Card */}
            <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Activity Stats
              </h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-900/50 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-indigo-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-300">
                      Problems Solved
                    </p>
                    <p className="text-lg font-bold text-white">
                      {user.problemSolved}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-900/50 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-indigo-400"
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
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-300">
                      Posts Created
                    </p>
                    <p className="text-lg font-bold text-white">
                      {user.posts.length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-900/50 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-indigo-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-300">
                      Comments
                    </p>
                    <p className="text-lg font-bold text-white">
                      {Math.floor(Math.random() * 50) + 10}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
