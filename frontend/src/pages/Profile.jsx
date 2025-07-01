// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import axiosClient from "../utils/axiosClient";
import Navbar from "../components/Navbar";

export default function Profile() {
  const [user, setUserProfile] = useState({
    _id: '',
    firstName: '',
    lastName: '',
    emailId: '',
    role: 'user',
    problemSolved: 0,
    problems: [],
    joinDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosClient.get('/user/getProfile');
        setUserProfile({
          _id: response.data._id || '',
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          emailId: response.data.emailId || '',
          role: response.data.role || 'user',
          problemSolved: response.data.problemSolved?.length || 0,
          problems: response.data.problemSolved || [],
          joinDate: response.data.joinDate || new Date().toISOString()
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || 'Failed to load profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // User data (would normally come from API)
  const userData = {
    username: "code_master",
    name: "Alex Johnson",
    joinDate: "January 2023",
    rank: "Guardian",
    problemsSolved: 347,
    acceptanceRate: "78.9%",
    easySolved: 124,
    mediumSolved: 176,
    hardSolved: 47,
    contests: 26,
    contestRating: 1843,
    contestRank: "Top 5%",
    languages: ["JavaScript", "Python", "C++", "Java"],
    skills: ["Data Structures", "Algorithms", "Dynamic Programming", "Graph Theory"],
    recentSubmissions: [
      { id: 1, problem: "Two Sum", difficulty: "Easy", time: "2 days ago", status: "Accepted" },
      { id: 2, problem: "Reverse Linked List", difficulty: "Medium", time: "3 days ago", status: "Accepted" },
      { id: 3, problem: "Merge Intervals", difficulty: "Medium", time: "4 days ago", status: "Accepted" },
      { id: 4, problem: "Trapping Rain Water", difficulty: "Hard", time: "1 week ago", status: "Accepted" },
    ]
  };

  // Contest history data
  const contestHistory = [
    { id: 1, name: "Weekly Contest 385", date: "Mar 17, 2024", rank: 124, rating: "+25" },
    { id: 2, name: "Biweekly Contest 126", date: "Mar 10, 2024", rank: 215, rating: "+18" },
    { id: 3, name: "Weekly Contest 384", date: "Mar 3, 2024", rank: 189, rating: "+22" },
    { id: 4, name: "Biweekly Contest 125", date: "Feb 25, 2024", rank: 301, rating: "+15" },
  ];



  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user.firstName}</h1>
                  <p className="text-gray-600 mt-1">{user.emailId}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Rank: {userData.rank}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Solved</p>
                  <p className="text-xl font-bold text-indigo-600">{userData.problemsSolved}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Acceptance</p>
                  <p className="text-xl font-bold text-green-600">{userData.acceptanceRate}</p>
                </div>
                {/* <div className="text-center">
                  <p className="text-sm text-gray-500">Contests</p>
                  <p className="text-xl font-bold text-purple-600">{userData.contests}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="text-xl font-bold text-blue-600">{userData.contestRating}</p>
                </div> */}
              </div>
              
              <div className="mt-4">
                <p className="text-gray-600 text-sm">Member since {user.joinDate}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Problems Solved Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Problems Solved</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-green-600">Easy</span>
                    <span className="text-sm font-medium text-gray-900">{userData.easySolved} solved</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${(userData.easySolved / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-yellow-600">Medium</span>
                    <span className="text-sm font-medium text-gray-900">{userData.mediumSolved} solved</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-yellow-500 h-2.5 rounded-full" 
                      style={{ width: `${(userData.mediumSolved / 2) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-red-600">Hard</span>
                    <span className="text-sm font-medium text-gray-900">{userData.hardSolved} solved</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-red-600 h-2.5 rounded-full" 
                      style={{ width: `${(userData.hardSolved / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contest History Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Contest History</h2>
                <span className="text-sm font-medium text-indigo-600">{userData.contestRank}</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contest</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contestHistory.map((contest) => (
                      <tr key={contest.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{contest.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{contest.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{contest.rank}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {contest.rating}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-center">
                <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                  View All Contests
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Languages Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Languages</h2>
              
              <div className="space-y-3">
                {userData.languages.map((language, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-indigo-500 mr-2"></div>
                    <span className="text-gray-700">{language}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Skills Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
              
              <div className="flex flex-wrap gap-2">
                {userData.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Recent Submissions Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Submissions</h2>
              
              <div className="space-y-4">
                {userData.recentSubmissions.map((submission) => (
                  <div key={submission.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-gray-900">{submission.problem}</p>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                          submission.difficulty === "Easy" 
                            ? "bg-green-100 text-green-800" 
                            : submission.difficulty === "Medium" 
                              ? "bg-yellow-100 text-yellow-800" 
                              : "bg-red-100 text-red-800"
                        }`}>
                          {submission.difficulty}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">{submission.time}</span>
                      </div>
                    </div>
                    <span className="text-green-600 font-medium">{submission.status}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                  View All Submissions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}