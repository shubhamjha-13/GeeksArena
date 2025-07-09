import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Editor from "@monaco-editor/react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from "../components/ChatAi";
import Editorial from "../components/Editorial";
import { FaRegPauseCircle } from "react-icons/fa";
import { Clock, AlarmClock, Square, X, User } from "lucide-react";
import Navbar from "../components/Navbar";

const ProblemPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [codeByLanguage, setCodeByLanguage] = useState({
    javascript: "",
    java: "",
    cpp: "",
  });
  const [loading, setLoading] = useState("");
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const [activeRightTab, setActiveRightTab] = useState("code");
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [codeEditorHeight, setCodeEditorHeight] = useState(70);
  const [isVerticalDragging, setIsVerticalDragging] = useState(false);
  const [componentError, setComponentError] = useState(null);
  const editorRef = useRef(null);
  const navigate = useNavigate();
  let { problemId } = useParams();
  const { handleSubmit } = useForm();

  // Error boundary function
  const handleComponentError = (error, errorInfo) => {
    console.error("Component error:", error, errorInfo);
    setComponentError(error.message);
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(
          `/problem/problemById/${problemId}`
        );

        if (response.data) {
          setProblem(response.data);

          // Safely handle startCode array
          const startCode = response.data.startCode || [];
          const initialCodes = {
            javascript:
              startCode.find((sc) => sc.language === "JavaScript")
                ?.initialCode || "",
            java:
              startCode.find((sc) => sc.language === "Java")?.initialCode || "",
            cpp:
              startCode.find((sc) => sc.language === "C++")?.initialCode || "",
          };
          setCodeByLanguage(initialCodes);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching problem:", error);
        setLoading(false);
        setComponentError("Failed to load problem");
      }
    };

    if (problemId) {
      fetchProblem();
    }
  }, [problemId]);

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

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  // Use userProfile if available, otherwise fallback to user from Redux
  const currentUser = userProfile || user;

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const container = document.querySelector(".flex.flex-1.overflow-hidden");
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;

    if (newLeftWidth >= 20 && newLeftWidth <= 80) {
      setLeftPanelWidth(newLeftWidth);
    }
  };

  const handleVerticalMouseDown = (e) => {
    setIsVerticalDragging(true);
    e.preventDefault();
  };

  const handleVerticalMouseUp = () => {
    setIsVerticalDragging(false);
  };

  const handleVerticalMouseMove = (e) => {
    if (!isVerticalDragging) return;

    const codeContainer = document.querySelector(".code-editor-container");
    if (!codeContainer) return;

    const rect = codeContainer.getBoundingClientRect();
    const headerOffset = 80;
    const footerOffset = 80;
    const contentHeight = rect.height - headerOffset - footerOffset;

    const mousePosition = e.clientY - rect.top - headerOffset;
    const newCodeHeight = Math.max(
      30,
      Math.min(85, (mousePosition / contentHeight) * 100)
    );

    setCodeEditorHeight(newCodeHeight);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      if (!isVerticalDragging) {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      if (!isVerticalDragging) {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };
  }, [isDragging]);

  useEffect(() => {
    if (isVerticalDragging) {
      document.addEventListener("mousemove", handleVerticalMouseMove);
      document.addEventListener("mouseup", handleVerticalMouseUp);
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleVerticalMouseMove);
      document.removeEventListener("mouseup", handleVerticalMouseUp);
      if (!isDragging) {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    }

    return () => {
      document.removeEventListener("mousemove", handleVerticalMouseMove);
      document.removeEventListener("mouseup", handleVerticalMouseUp);
      if (!isDragging) {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };
  }, [isVerticalDragging]);

  const handleEditorChange = (value) => {
    try {
      setCodeByLanguage((prev) => ({
        ...prev,
        [selectedLanguage]: value || "",
      }));
    } catch (error) {
      console.error("Error updating code:", error);
    }
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (e) => {
    try {
      setSelectedLanguage(e.target.value);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const handleRun = async () => {
    setLoading("run");
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code: codeByLanguage[selectedLanguage],
        language: selectedLanguage,
      });
      setRunResult(response.data);
      if (codeEditorHeight === 100) {
        setCodeEditorHeight(70);
      }
    } catch (error) {
      console.error("Error running code:", error);
      setRunResult({ success: false, error: "Internal server error" });
      if (codeEditorHeight === 100) {
        setCodeEditorHeight(70);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading("submit");
    setSubmitResult(null);
    setActiveRightTab("result");
    try {
      const response = await axiosClient.post(
        `/submission/submit/${problemId}`,
        {
          code: codeByLanguage[selectedLanguage],
          language: selectedLanguage,
        }
      );
      setSubmitResult(response.data);

      if (response.data && response.data.accepted) {
        setShowCelebration(true);
        setTimeout(() => {
          setShowCelebration(false);
        }, 4000);
      }
    } catch (error) {
      console.error("Error submitting code:", error);
      setSubmitResult({ success: false, error: "Submission failed" });
    } finally {
      setLoading(false);
    }
  };

  const getLanguageForMonaco = (lang) => {
    return lang;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "border-green-500/50 text-green-400 bg-green-500/10 shadow-green-500/25";
      case "medium":
        return "border-yellow-500/50 text-yellow-400 bg-yellow-500/10 shadow-yellow-500/25";
      case "hard":
        return "border-red-500/50 text-red-400 bg-red-500/10 shadow-red-500/25";
      default:
        return "border-gray-500/50 text-gray-400 bg-gray-500/10 shadow-gray-500/25";
    }
  };

  const getTagColor = (index) => {
    const colors = [
      "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:border-cyan-400 hover:shadow-cyan-500/30",
      "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-300 border-pink-500/40 hover:border-pink-400 hover:shadow-pink-500/30",
      "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:border-emerald-400 hover:shadow-emerald-500/30",
      "bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-amber-300 border-amber-500/40 hover:border-amber-400 hover:shadow-amber-500/30",
      "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-rose-300 border-rose-500/40 hover:border-rose-400 hover:shadow-rose-500/30",
      "bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-violet-300 border-violet-500/40 hover:border-violet-400 hover:shadow-violet-500/30",
      "bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-300 border-teal-500/40 hover:border-teal-400 hover:shadow-teal-500/30",
      "bg-gradient-to-r from-lime-500/20 to-green-500/20 text-lime-300 border-lime-500/40 hover:border-lime-400 hover:shadow-lime-500/30",
    ];
    return colors[index % colors.length];
  };

  // Show error state if there's a component error
  if (componentError) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-300 mb-6">{componentError}</p>
            <button
              onClick={() => {
                setComponentError(null);
                window.location.reload();
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-gray-300">Loading problem...</div>
        </div>
      </div>
    );
  }

  // Celebration Component
  const CelebrationOverlay = () => {
    if (!showCelebration) return null;

    const matrixChars = [
      "0",
      "1",
      "ACCEPTED",
      "SUCCESS",
      "01010101",
      "SOLVED",
      "11001100",
      "PASS",
      "10101010",
      "TRUE",
      "00110011",
    ];
    const binaryChars = ["0", "1"];

    return (
      <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-green-400 animate-pulse opacity-30"
              style={{
                top: `${i * 2}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {[...Array(20)].map((_, colIndex) => (
          <div
            key={colIndex}
            className="absolute top-0 text-green-400 font-mono text-sm opacity-70"
            style={{
              left: `${colIndex * 5}%`,
              animationDelay: `${colIndex * 0.2}s`,
            }}
          >
            {[...Array(30)].map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="animate-pulse"
                style={{
                  animationDelay: `${rowIndex * 0.1}s`,
                  animationDuration: "2s",
                  opacity: Math.random() > 0.5 ? 1 : 0.3,
                }}
              >
                {Math.random() > 0.8
                  ? matrixChars[Math.floor(Math.random() * matrixChars.length)]
                  : binaryChars[Math.floor(Math.random() * binaryChars.length)]}
              </div>
            ))}
          </div>
        ))}

        {[...Array(15)].map((_, i) => (
          <div
            key={`stream-${i}`}
            className="absolute text-green-300 font-mono text-xs whitespace-nowrap animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: "-10%",
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {
              [
                "01010101",
                "11001100",
                "ACCEPTED",
                "00110011",
                "SUCCESS",
                "10101010",
              ][Math.floor(Math.random() * 6)]
            }
          </div>
        ))}

        <div className="relative z-10 text-center bg-black/60 border border-green-400 rounded-lg p-8 font-mono shadow-2xl shadow-green-500/25">
          <div className="mb-4 text-green-400 text-sm">
            <div className="flex items-center justify-center mb-2">
              <span className="animate-pulse mr-2">{">"}</span>
              <span className="typing-animation">
                SYSTEM STATUS: CHECKING...
              </span>
            </div>
            <div className="flex items-center justify-center mb-2">
              <span className="animate-pulse mr-2">{">"}</span>
              <span>ANALYZING SOLUTION...</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="animate-pulse mr-2">{">"}</span>
              <span>VERIFICATION COMPLETE</span>
            </div>
          </div>

          <div className="border-t border-green-400 pt-4">
            <div className="text-4xl font-bold text-green-400 mb-2 animate-pulse">
              [[ ACCEPTED ]]
            </div>
            <div className="text-green-300 text-lg animate-bounce">
              SOLUTION MATRIX: VALIDATED
            </div>
            <div className="text-green-500 text-sm mt-2">
              ACCESS GRANTED • STATUS: SUCCESS
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <span className="text-green-400 animate-pulse text-lg">█</span>
          </div>
        </div>

        {[
          "function()",
          "return true;",
          "if(solved)",
          'console.log("PASS")',
          "exit(0)",
          "SUCCESS",
        ].map((code, i) => (
          <div
            key={i}
            className="absolute text-green-400 font-mono text-xs opacity-60 animate-bounce"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + Math.sin(i) * 20}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: "3s",
            }}
          >
            {code}
          </div>
        ))}

        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-green-500/10 to-transparent animate-pulse" />
        </div>

        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />
      </div>
    );
  };

  // Safe tab click handler
  const handleTabClick = (tab) => {
    try {
      setActiveLeftTab(tab);
      setComponentError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error switching tab:", error);
      setComponentError("Failed to switch tab");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-gray-100">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-gray-900/95 via-slate-900/95 to-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 px-6 py-2 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/problems")}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Problem Set
          </button>
        </div>
        <div className="flex items-center gap-3 text-sm bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700/50">
          <Clock className="w-5 h-5 text-blue-400" />
          <span className="font-mono text-gray-200">{formatTime(timer)}</span>
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="ml-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold transition-all duration-300 shadow-md shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105"
          >
            {isTimerRunning ? (
              <FaRegPauseCircle size={16} />
            ) : (
              <AlarmClock size={16} />
            )}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div
            onClick={handleProfileClick}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-all duration-300 bg-gray-800/50 px-3 py-2 rounded-xl border border-gray-700/50 hover:border-blue-500/50"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-gray-600/50 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              {currentUser?.profileImage ? (
                <img
                  src={currentUser.profileImage}
                  alt={`${currentUser?.firstName} ${currentUser?.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-sm">
                  {currentUser?.firstName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>

            <span className="font-medium hidden lg:inline text-gray-200 text-sm">
              {currentUser?.firstName}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div
          className="flex flex-col bg-gradient-to-b from-slate-900/50 to-gray-900/50 backdrop-blur-sm border-r border-gray-700/50"
          style={{ width: `${leftPanelWidth}%` }}
        >
          <div className="flex border-b border-gray-700/50 bg-gray-900/30 backdrop-blur-sm px-6 py-2 gap-6">
            {[
              "description",
              "editorial",
              "solutions",
              "submissions",
              "chatAI",
            ].map((tab) => (
              <button
                key={tab}
                className={`pb-2 border-b-2 font-medium transition-all duration-300 ${
                  activeLeftTab === tab
                    ? "border-blue-500 text-blue-400 bg-blue-500/10 px-3 py-1 rounded-t-lg"
                    : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500 px-3 py-1 rounded-t-lg hover:bg-gray-800/30"
                }`}
                onClick={() => handleTabClick(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 text-gray-200">
            {problem && (
              <>
                {activeLeftTab === "description" && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 shadow-xl">
                      <div className="mb-6">
                        <div className="flex items-center gap-4 mb-4">
                          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            {problem.title || "Untitled Problem"}
                          </h1>
                          <span
                            className={`px-4 py-2 border-2 rounded-full text-sm font-bold shadow-lg ${getDifficultyColor(
                              problem.difficulty
                            )}`}
                          >
                            {(problem.difficulty || "unknown").toUpperCase()}
                          </span>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          {(problem.tags || "")
                            .split(",")
                            .filter((tag) => tag.trim())
                            .map((tag, idx) => (
                              <span
                                key={idx}
                                className={`px-3 py-1.5 rounded-full text-sm font-semibold border shadow-md transition-all duration-200 hover:scale-105 ${getTagColor(
                                  idx
                                )}`}
                              >
                                {tag.trim()}
                              </span>
                            ))}
                        </div>
                      </div>

                      <div className="text-base leading-relaxed text-gray-300 whitespace-pre-wrap">
                        {problem.description || "No description available"}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 shadow-xl">
                      <h3 className="text-xl font-bold mb-4 text-gray-100 flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
                        Examples
                      </h3>
                      <div className="space-y-4">
                        {(problem.visibleTestCases || []).map(
                          (example, index) => (
                            <div
                              key={index}
                              className="bg-gradient-to-r from-gray-900/70 to-gray-800/70 p-5 rounded-xl border border-gray-600/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-500/30"
                            >
                              <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                  <span className="bg-green-600/20 text-green-300 px-2 py-1 rounded-md text-xs font-semibold border border-green-500/30">
                                    Input:
                                  </span>
                                  <code className="bg-gray-800/50 px-3 py-1 rounded-md text-green-400 font-mono text-sm">
                                    {example.input || "N/A"}
                                  </code>
                                </div>
                                <div className="flex items-start gap-3">
                                  <span className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded-md text-xs font-semibold border border-blue-500/30">
                                    Output:
                                  </span>
                                  <code className="bg-gray-800/50 px-3 py-1 rounded-md text-blue-400 font-mono text-sm">
                                    {example.output || "N/A"}
                                  </code>
                                </div>
                                <div className="flex items-start gap-3">
                                  <span className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded-md text-xs font-semibold border border-purple-500/30">
                                    Explanation:
                                  </span>
                                  <span className="text-gray-300 text-sm">
                                    {example.explanation ||
                                      "No explanation provided"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeLeftTab === "editorial" && <Editorial {...problem} />}
                {activeLeftTab === "solutions" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-6 text-gray-100 flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
                      Solutions
                    </h2>
                    {problem.referenceSolution?.length > 0 ? (
                      problem.referenceSolution.map((solution, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden"
                        >
                          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white">
                            {solution.language || "Unknown Language"}
                          </div>
                          <pre className="p-6 text-sm overflow-x-auto bg-gray-900/50 text-gray-300 font-mono">
                            <code>
                              {solution.completeCode || "No code available"}
                            </code>
                          </pre>
                        </div>
                      ))
                    ) : (
                      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 text-center">
                        <div className="text-gray-400 text-lg">
                          Solutions will appear once the problem is solved.
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {activeLeftTab === "submissions" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-6 text-gray-100 flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                      Submissions
                    </h2>
                    <SubmissionHistory
                      problemId={problemId}
                      submitResult={submitResult}
                    />
                  </div>
                )}
                {activeLeftTab === "chatAI" &&
                  (problem ? (
                    <ChatAi problem={problem} />
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>

        {/* Resizable Divider */}
        <div
          className="w-1.5 bg-gradient-to-b from-gray-700 via-blue-500 to-gray-700 hover:bg-gradient-to-b hover:from-blue-400 hover:via-blue-500 hover:to-blue-400 cursor-col-resize flex-shrink-0 transition-all duration-300 relative group shadow-lg"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 -left-2 -right-2 group-hover:bg-blue-500/10 transition-colors duration-300" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-1.5 h-12 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-lg shadow-blue-500/50" />
          </div>
        </div>

        {/* Right Panel */}
        <div
          className="flex flex-col bg-gradient-to-b from-slate-900/50 to-gray-900/50 backdrop-blur-sm relative"
          style={{ width: `${100 - leftPanelWidth}%` }}
          data-right-panel
        >
          <div className="flex border-b border-gray-700/50 bg-gray-900/30 backdrop-blur-sm px-6 py-2 gap-6">
            {["code", "result"].map((tab) => (
              <button
                key={tab}
                className={`pb-2 border-b-2 font-medium transition-all duration-300 ${
                  activeRightTab === tab
                    ? "border-blue-500 text-blue-400 bg-blue-500/10 px-3 py-1 rounded-t-lg"
                    : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500 px-3 py-1 rounded-t-lg hover:bg-gray-800/30"
                }`}
                onClick={() => {
                  setActiveRightTab(tab);
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col">
            {activeRightTab === "code" && (
              <div className="flex-1 flex flex-col code-editor-container">
                {/* Language Selector */}
                <div className="flex gap-3 p-4 border-b border-gray-700/50 bg-gray-800/30">
                  <select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    className="select select-bordered bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600/50 hover:border-blue-500/50 text-gray-200 font-medium rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>

                {/* Code Editor Section */}
                <div className="flex-1 bg-gray-900/50 relative">
                  <div
                    className="absolute inset-0"
                    style={{
                      height:
                        runResult || loading === "run"
                          ? `${codeEditorHeight}%`
                          : "100%",
                    }}
                  >
                    <Editor
                      height="100%"
                      language={getLanguageForMonaco(selectedLanguage)}
                      value={codeByLanguage[selectedLanguage]}
                      onChange={handleEditorChange}
                      onMount={handleEditorDidMount}
                      theme="vs-dark"
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        wordWrap: "on",
                        scrollBeyondLastLine: false,
                        fontFamily:
                          "JetBrains Mono, Fira Code, Monaco, monospace",
                        lineHeight: 1.6,
                        padding: { top: 16, bottom: 16 },
                        smoothScrolling: true,
                        cursorBlinking: "smooth",
                        renderLineHighlight: "gutter",
                        selectOnLineNumbers: true,
                      }}
                    />
                  </div>

                  {/* Horizontal Resizable Divider */}
                  {(runResult || loading === "run") && (
                    <div
                      className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-gray-700 via-blue-500 to-gray-700 hover:bg-gradient-to-r hover:from-blue-400 hover:via-blue-500 hover:to-blue-400 cursor-row-resize transition-all duration-300 relative group shadow-lg z-10"
                      style={{ top: `${codeEditorHeight}%` }}
                      onMouseDown={handleVerticalMouseDown}
                    >
                      <div className="absolute inset-x-0 -top-2 -bottom-2 group-hover:bg-blue-500/10 transition-colors duration-300" />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="w-12 h-1.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-lg shadow-blue-500/50" />
                      </div>
                    </div>
                  )}

                  {/* Test Results Section */}
                  {(runResult || loading === "run") && (
                    <div
                      className="absolute left-0 right-0 bottom-0 bg-gradient-to-b from-gray-800/95 to-gray-900/95 backdrop-blur-lg border-t border-gray-600/50 shadow-2xl flex flex-col"
                      style={{
                        top: `${codeEditorHeight + 0.2}%`,
                        height: `${100 - codeEditorHeight - 0.2}%`,
                      }}
                    >
                      <div className="flex justify-between items-center p-4 border-b border-gray-600/50">
                        <h3 className="font-semibold text-gray-100 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          Test Results
                        </h3>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setRunResult(null);
                              setCodeEditorHeight(100);
                            }}
                            className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-1 rounded-md hover:bg-gray-700/50"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 text-sm">
                        {runResult ? (
                          <div className="space-y-4">
                            {(runResult.testCases || []).map((tc, i) => (
                              <div
                                key={i}
                                className="bg-gradient-to-r from-gray-900/70 to-gray-800/70 p-4 rounded-xl border border-gray-600/50 shadow-lg"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                      Input
                                    </div>
                                    <div className="bg-gray-800/50 p-2 rounded-lg font-mono text-green-400 text-sm">
                                      {tc.stdin || "N/A"}
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                      Expected
                                    </div>
                                    <div className="bg-gray-800/50 p-2 rounded-lg font-mono text-blue-400 text-sm">
                                      {tc.expected_output || "N/A"}
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                      Output
                                    </div>
                                    <div className="bg-gray-800/50 p-2 rounded-lg font-mono text-yellow-400 text-sm">
                                      {tc.stdout || "N/A"}
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={`mt-3 font-semibold flex items-center gap-2 ${
                                    tc.status_id === 3
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      tc.status_id === 3
                                        ? "bg-green-400"
                                        : "bg-red-400"
                                    }`}
                                  ></div>
                                  {tc.status_id === 3 ? "✓ Passed" : "✗ Failed"}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            {loading === "run" ? (
                              <div className="flex items-center gap-3 text-blue-400">
                                <div className="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                                <span className="font-medium">
                                  Running test cases...
                                </span>
                              </div>
                            ) : (
                              <p className="text-gray-500 text-center">
                                Click Run to execute test cases
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t border-gray-700/50 bg-gray-800/30 flex justify-end">
                  <div className="flex gap-3">
                    <button
                      onClick={handleRun}
                      disabled={loading}
                      className={`btn btn-sm px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                        runResult
                          ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg shadow-green-600/25"
                          : "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-300 border border-gray-600/50"
                      } disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105`}
                    >
                      {loading === "run" ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Running...
                        </span>
                      ) : (
                        "Run"
                      )}
                    </button>
                    <button
                      onClick={handleSubmitCode}
                      disabled={loading}
                      className="btn btn-sm px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                    >
                      {loading === "submit" ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Submitting...
                        </span>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeRightTab === "result" && (
              <div className="p-6 text-gray-200">
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 shadow-xl">
                  <h3 className="font-bold text-xl mb-6 text-gray-100 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                    Submission Result
                  </h3>
                  {submitResult ? (
                    <div
                      className={`p-6 rounded-xl border-2 ${
                        submitResult.accepted
                          ? "bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/50 shadow-green-500/20"
                          : "bg-gradient-to-r from-red-900/30 to-rose-900/30 border-red-500/50 shadow-red-500/20"
                      } shadow-xl`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            submitResult.accepted
                              ? "bg-green-400"
                              : "bg-red-400"
                          }`}
                        ></div>
                        <h4 className="font-bold text-2xl">
                          {submitResult.accepted
                            ? "🎉 Accepted"
                            : "❌ " + (submitResult.error || "Failed")}
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-gray-800/50 p-3 rounded-lg">
                          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                            Test Cases
                          </div>
                          <div className="text-lg font-bold">
                            {submitResult.passedTestCases || 0}/
                            {submitResult.totalTestCases || 0}
                          </div>
                        </div>
                        <div className="bg-gray-800/50 p-3 rounded-lg">
                          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                            Runtime
                          </div>
                          <div className="text-lg font-bold">
                            {submitResult.runtime || "N/A"}{" "}
                            {submitResult.runtime ? "sec" : ""}
                          </div>
                        </div>
                        <div className="bg-gray-800/50 p-3 rounded-lg">
                          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                            Memory
                          </div>
                          <div className="text-lg font-bold">
                            {submitResult.memory || "N/A"}{" "}
                            {submitResult.memory ? "KB" : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-lg mb-2">
                        Ready to submit?
                      </div>
                      <p className="text-gray-500">
                        Click Submit to evaluate your solution.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Celebration Overlay */}
      <CelebrationOverlay />
    </div>
  );
};

export default ProblemPage;
