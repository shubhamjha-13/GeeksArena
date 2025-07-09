import { useState, useEffect } from "react";
import { X } from "lucide-react";
import axiosClient from "../utils/axiosClient";

const SubmissionHistory = ({ problemId, submitResult }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [componentError, setComponentError] = useState(null);

  // Safe fetch function with comprehensive error handling
  const fetchSubmissions = async () => {
    if (!problemId) {
      setError("Problem ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setComponentError(null);

      let response = null;
      let lastError = null;

      // Try multiple endpoints with proper error handling
      const endpoints = [
        `/problem/submittedProblem/${problemId}`,
        `/submission/submissions/${problemId}`,
        `/submission/user/${problemId}`,
        `/submission/history/${problemId}`,
        `/submissions/${problemId}`,
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          response = await axiosClient.get(endpoint);

          if (response && response.data !== undefined) {
            console.log(`Success with endpoint: ${endpoint}`, response.data);
            break;
          }
        } catch (err) {
          console.log(`Failed endpoint ${endpoint}:`, err.message);
          lastError = err;
          continue;
        }
      }

      // Handle response data safely
      if (response && response.data !== undefined) {
        const data = response.data;

        // Ensure data is an array
        let submissionsArray = [];
        if (Array.isArray(data)) {
          submissionsArray = data;
        } else if (data && typeof data === "object") {
          // Check if data has submissions property
          if (Array.isArray(data.submissions)) {
            submissionsArray = data.submissions;
          } else if (Array.isArray(data.data)) {
            submissionsArray = data.data;
          } else if (Array.isArray(data.results)) {
            submissionsArray = data.results;
          } else {
            // Single submission object
            submissionsArray = [data];
          }
        }

        // Validate and sanitize each submission
        const validSubmissions = submissionsArray
          .filter((sub) => sub && typeof sub === "object")
          .map((sub) => ({
            ...sub,
            id: sub.id || sub._id || `temp-${Date.now()}-${Math.random()}`,
            status: sub.status || "unknown",
            language: sub.language || "N/A",
            createdAt:
              sub.createdAt ||
              sub.submittedAt ||
              sub.timestamp ||
              new Date().toISOString(),
            code: sub.code || "",
            runtime: sub.runtime || sub.executionTime || null,
            memory: sub.memory || sub.memoryUsage || null,
            testCasesPassed: sub.testCasesPassed || sub.passedTestCases || 0,
            testCasesTotal: sub.testCasesTotal || sub.totalTestCases || 0,
            errorMessage: sub.errorMessage || sub.error || null,
          }));

        setSubmissions(validSubmissions);
      } else {
        throw new Error("No valid response from any endpoint");
      }
    } catch (err) {
      console.error("All endpoints failed:", err);

      // Set appropriate error message
      if (err.response?.status === 404) {
        setError("No submissions found for this problem");
      } else if (err.response?.status === 403) {
        setError("Access denied to submissions");
      } else if (err.response?.status >= 500) {
        setError("Server error - please try again later");
      } else if (err.code === "NETWORK_ERROR" || !navigator.onLine) {
        setError("Network error - please check your connection");
      } else {
        setError("Failed to load submissions");
      }

      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  // Safe useEffect with error boundary
  useEffect(() => {
    try {
      fetchSubmissions();
    } catch (error) {
      console.error("Error in fetchSubmissions effect:", error);
      setComponentError("Failed to initialize submissions");
      setLoading(false);
    }
  }, [problemId, refreshKey]);

  // Auto-refresh after submission with error handling
  useEffect(() => {
    if (submitResult) {
      try {
        const timer = setTimeout(() => {
          fetchSubmissions();
        }, 1500);
        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Error in auto-refresh effect:", error);
      }
    }
  }, [submitResult]);

  // Safe refresh handler
  const handleRefresh = () => {
    try {
      setRefreshKey((prev) => prev + 1);
      setError(null);
      setComponentError(null);
    } catch (error) {
      console.error("Error in refresh handler:", error);
      setComponentError("Failed to refresh");
    }
  };

  // Safe status color function
  const getStatusColor = (status) => {
    try {
      const statusLower = String(status || "").toLowerCase();
      switch (statusLower) {
        case "accepted":
        case "correct":
        case "pass":
          return "text-green-400 bg-green-500/20 border-green-500/30";
        case "wrong answer":
        case "wrong":
        case "incorrect":
        case "fail":
          return "text-red-400 bg-red-500/20 border-red-500/30";
        case "time limit exceeded":
        case "tle":
          return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
        case "runtime error":
        case "error":
          return "text-orange-400 bg-orange-500/20 border-orange-500/30";
        case "compilation error":
          return "text-purple-400 bg-purple-500/20 border-purple-500/30";
        case "pending":
          return "text-blue-400 bg-blue-500/20 border-blue-500/30";
        default:
          return "text-gray-400 bg-gray-500/20 border-gray-500/30";
      }
    } catch (error) {
      console.error("Error in getStatusColor:", error);
      return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  // Safe date formatter
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Unknown date";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Safe memory formatter
  const formatMemory = (memory) => {
    try {
      if (!memory && memory !== 0) return "N/A";
      const memValue = parseFloat(memory);
      if (isNaN(memValue)) return "N/A";
      if (memValue < 1024) return `${memValue} KB`;
      return `${(memValue / 1024).toFixed(2)} MB`;
    } catch (error) {
      console.error("Error formatting memory:", error);
      return "N/A";
    }
  };

  // Safe submission selection handler
  const handleViewCode = (submission) => {
    try {
      if (submission && typeof submission === "object") {
        setSelectedSubmission(submission);
      }
    } catch (error) {
      console.error("Error viewing code:", error);
      setComponentError("Failed to view submission code");
    }
  };

  // Show component error if there's a React error
  if (componentError) {
    return (
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 shadow-xl">
        <div className="text-center py-8">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <div className="text-red-400 text-lg mb-3">Component Error</div>
          <div className="text-gray-300 text-sm mb-4">{componentError}</div>
          <button
            onClick={() => {
              setComponentError(null);
              handleRefresh();
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 shadow-xl">
        <div className="text-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-3"></div>
          <div className="text-gray-400 text-sm">Loading submissions...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 shadow-xl">
        <div className="text-center py-8">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <div className="text-red-400 text-lg mb-3">{error}</div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors duration-200"
            >
              Try Again
            </button>
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors duration-200"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!submissions || submissions.length === 0) {
    return (
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 shadow-xl">
        <div className="text-center py-16">
          <div className="text-6xl mb-6">📝</div>
          <div className="text-gray-300 text-xl font-semibold mb-3">
            No submissions yet
          </div>
          <p className="text-gray-500 text-base mb-6 max-w-md mx-auto">
            You haven't submitted any solutions for this problem yet. Start
            coding and submit your solution to see your progress here!
          </p>

          {submitResult && (
            <div className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border border-yellow-500/20 rounded-lg p-4 max-w-sm mx-auto mb-4">
              <div className="text-yellow-400 text-sm font-medium mb-2">
                ⏳ Just Submitted?
              </div>
              <div className="text-gray-400 text-xs">
                Your submission may take a moment to appear. Try refreshing.
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-center">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors duration-200"
            >
              Refresh Submissions
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main component render
  try {
    return (
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-400 text-sm">
            {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
          </div>
          <button
            onClick={handleRefresh}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md text-xs transition-colors duration-200"
          >
            Refresh
          </button>
        </div>

        <div className="space-y-4">
          {submissions.map((submission, index) => {
            try {
              const submissionId =
                submission?.id || submission?._id || `fallback-${index}`;
              const status = submission?.status || "unknown";
              const language = submission?.language || "N/A";
              const createdAt =
                submission?.createdAt ||
                submission?.submittedAt ||
                submission?.timestamp;

              return (
                <div
                  key={submissionId}
                  className="bg-gradient-to-r from-gray-900/70 to-gray-800/70 p-5 rounded-xl border border-gray-600/50 hover:border-gray-500/50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded-md text-xs font-semibold">
                        #{index + 1}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </div>
                    <span className="text-gray-400 text-xs">
                      {formatDate(createdAt)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500 text-xs mb-1 font-semibold uppercase tracking-wider">
                        Language
                      </div>
                      <div className="text-gray-300 font-medium font-mono">
                        {language}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1 font-semibold uppercase tracking-wider">
                        Runtime
                      </div>
                      <div className="text-gray-300 font-medium font-mono">
                        {submission?.runtime ||
                          submission?.executionTime ||
                          "N/A"}
                        {(submission?.runtime || submission?.executionTime) &&
                        !String(
                          submission.runtime || submission.executionTime
                        ).includes("s")
                          ? " sec"
                          : ""}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1 font-semibold uppercase tracking-wider">
                        Memory
                      </div>
                      <div className="text-gray-300 font-medium font-mono">
                        {formatMemory(
                          submission?.memory || submission?.memoryUsage
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1 font-semibold uppercase tracking-wider">
                        Test Cases
                      </div>
                      <div className="text-gray-300 font-medium font-mono">
                        {submission?.testCasesPassed ||
                          submission?.passedTestCases ||
                          0}
                        /
                        {submission?.testCasesTotal ||
                          submission?.totalTestCases ||
                          0}
                      </div>
                    </div>
                    <div className="flex items-end">
                      <button
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors duration-200 font-medium w-full"
                        onClick={() => handleViewCode(submission)}
                      >
                        View Code
                      </button>
                    </div>
                  </div>

                  {submission?.errorMessage && (
                    <div className="mt-4 bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-lg">
                      <div className="font-semibold text-xs mb-1 uppercase tracking-wider">
                        Error Message:
                      </div>
                      <div className="font-mono text-sm">
                        {submission.errorMessage}
                      </div>
                    </div>
                  )}
                </div>
              );
            } catch (renderError) {
              console.error(
                "Error rendering submission:",
                renderError,
                submission
              );
              return (
                <div
                  key={`error-${index}`}
                  className="bg-red-900/30 border border-red-500/50 text-red-400 p-4 rounded-lg"
                >
                  <div className="font-semibold mb-2">
                    Error rendering submission #{index + 1}
                  </div>
                  <div className="text-sm">
                    Unable to display this submission
                  </div>
                </div>
              );
            }
          })}
        </div>

        {/* Code View Modal with error handling */}
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-600/50 rounded-2xl shadow-2xl w-11/12 max-w-5xl max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex justify-between items-center">
                <h3 className="font-bold text-xl text-white">
                  Submission Details:{" "}
                  {selectedSubmission?.language || "Unknown"}
                </h3>
                <button
                  className="text-white hover:text-gray-300 transition-colors duration-200"
                  onClick={() => setSelectedSubmission(null)}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6 flex flex-wrap gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                      selectedSubmission?.status
                    )}`}
                  >
                    {selectedSubmission?.status || "Unknown"}
                  </span>
                  <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm border border-gray-600/50">
                    Runtime: {selectedSubmission?.runtime || "N/A"}
                    {selectedSubmission?.runtime &&
                    !selectedSubmission.runtime.includes("s")
                      ? " sec"
                      : ""}
                  </span>
                  <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm border border-gray-600/50">
                    Memory: {formatMemory(selectedSubmission?.memory)}
                  </span>
                  <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm border border-gray-600/50">
                    Test Cases: {selectedSubmission?.testCasesPassed || 0}/
                    {selectedSubmission?.testCasesTotal || 0}
                  </span>
                  <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm border border-gray-600/50">
                    Submitted: {formatDate(selectedSubmission?.createdAt)}
                  </span>
                </div>

                {selectedSubmission?.errorMessage && (
                  <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6">
                    <div className="font-semibold mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      Error Details:
                    </div>
                    <div className="font-mono text-sm">
                      {selectedSubmission.errorMessage}
                    </div>
                  </div>
                )}

                <div className="bg-gray-900/50 rounded-xl border border-gray-600/50 overflow-hidden">
                  <div className="bg-gray-800/50 px-4 py-3 border-b border-gray-600/50 flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300 font-medium ml-3">
                      {selectedSubmission?.language || "Code"}
                    </span>
                  </div>
                  <pre className="p-6 overflow-x-auto max-h-96 text-gray-100 font-mono text-sm leading-relaxed bg-gray-950/50">
                    <code>
                      {selectedSubmission?.code || "No code available"}
                    </code>
                  </pre>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors duration-200 font-medium"
                    onClick={() => setSelectedSubmission(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } catch (renderError) {
    console.error("Critical render error:", renderError);
    return (
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 shadow-xl">
        <div className="text-center py-8">
          <div className="text-red-400 text-4xl mb-4">💥</div>
          <div className="text-red-400 text-lg mb-3">Render Error</div>
          <div className="text-gray-300 text-sm mb-4">
            Failed to render submissions component
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors duration-200"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
};

export default SubmissionHistory;
