import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Editor from "@monaco-editor/react";
import { useParams, useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from "../components/ChatAi";
import Editorial from "../components/Editorial";
import { FaRegPauseCircle } from "react-icons/fa";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Maximize2,
  AlarmClock,
  Square,
} from "lucide-react";
import Navbar from "../components/Navbar";

const ProblemPage = () => {
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
  const [isTimerRunning, setIsTimerRunning] = useState(false); // New state for timer on/off
  const editorRef = useRef(null);
  const navigate = useNavigate();
  let { problemId } = useParams();
  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(
          `/problem/problemById/${problemId}`
        );
        setProblem(response.data);
        const initialCodes = {
          javascript:
            response.data.startCode.find((sc) => sc.language === "JavaScript")
              ?.initialCode || "",
          java:
            response.data.startCode.find((sc) => sc.language === "Java")
              ?.initialCode || "",
          cpp:
            response.data.startCode.find((sc) => sc.language === "C++")
              ?.initialCode || "",
        };
        setCodeByLanguage(initialCodes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching problem:", error);
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

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

  const handleNavigation = (direction) => {
    const id = parseInt(problemId);
    if (!isNaN(id)) {
      const newId = direction === "prev" ? id - 1 : id + 1;
      navigate(`/problem/${newId}`);
    }
  };

  const handleEditorChange = (value) => {
    setCodeByLanguage((prev) => ({ ...prev, [selectedLanguage]: value || "" }));
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
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
      setActiveRightTab("testcase");
    } catch (error) {
      setRunResult({ success: false, error: "Internal server error" });
      setActiveRightTab("testcase");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading("submit");
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(
        `/submission/submit/${problemId}`,
        {
          code: codeByLanguage[selectedLanguage],
          language: selectedLanguage,
        }
      );
      setSubmitResult(response.data);
      setActiveRightTab("result");
    } catch (error) {
      setSubmitResult(null);
      setActiveRightTab("result");
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
        return "border-green-500 text-green-500";
      case "medium":
        return "border-yellow-500 text-yellow-500";
      case "hard":
        return "border-red-500 text-red-500";
      default:
        return "border-gray-500 text-gray-500";
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-100">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-base-100 text-gray-300">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-gray-900 border-b border-gray-800 px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleNavigation("prev")}
            className="text-gray-400 hover:text-gray-200"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => handleNavigation("next")}
            className="text-gray-400 hover:text-gray-200"
          >
            <ArrowRight size={18} />
          </button>
          {problem && (
            <h1 className="text-xl font-semibold text-gray-100">
              {problem.title}
            </h1>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-5 h-5" />
          <span>{formatTime(timer)}</span>
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="ml-2 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold hover:from-yellow-600 hover:to-orange-600 transition duration-300 shadow-md hover:shadow-lg"
          >
            {isTimerRunning ? (
              <FaRegPauseCircle size={18} />
            ) : (
              <AlarmClock size={18} />
            )}
            {/* <span className="ml-1">{isTimerRunning ? "Stop" : "Start"}</span> */}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <Maximize2 className="w-5 h-5 text-gray-400 cursor-pointer" />
          <button className="btn btn-sm btn-outline text-gray-400 border-gray-600 hover:bg-gray-700">
            Upgrade to Pro
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 flex flex-col border-r border-gray-800 bg-gray-900">
          <div className="flex border-b border-gray-800 bg-gray-900 px-6 py-3 gap-4">
            {[
              "description",
              "editorial",
              "solutions",
              "submissions",
              "chatAI",
            ].map((tab) => (
              <button
                key={tab}
                className={`pb-2 border-b-2 font-medium ${
                  activeLeftTab === tab
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setActiveLeftTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 text-gray-300">
            {problem && (
              <>
                {activeLeftTab === "description" && (
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <h1 className="text-2xl font-bold">{problem.title}</h1>
                      <span
                        className={`px-3 py-1 border rounded-full text-sm font-semibold ${getDifficultyColor(
                          problem.difficulty
                        )}`}
                      >
                        {problem.difficulty.toUpperCase()}
                      </span>
                      <div className="flex gap-2 flex-wrap">
                        {problem.tags.split(",").map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-800 text-blue-400 rounded-full text-xs font-semibold"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {problem.description}
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Examples:</h3>
                      <div className="space-y-4">
                        {problem.visibleTestCases.map((example, index) => (
                          <div
                            key={index}
                            className="bg-gray-800 p-4 rounded-md border border-gray-700"
                          >
                            <p>
                              <strong>Input:</strong> {example.input}
                            </p>
                            <p>
                              <strong>Output:</strong> {example.output}
                            </p>
                            <p>
                              <strong>Explanation:</strong>{" "}
                              {example.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeLeftTab === "editorial" && <Editorial {...problem} />}
                {activeLeftTab === "solutions" && (
                  <div>
                    <h2 className="text-lg font-bold mb-4">Solutions</h2>
                    {problem.referenceSolution?.length > 0 ? (
                      problem.referenceSolution.map((solution, index) => (
                        <div
                          key={index}
                          className="border border-gray-700 rounded-lg mb-4"
                        >
                          <div className="bg-gray-800 px-4 py-2 rounded-t-lg font-semibold text-gray-200">
                            {solution.language}
                          </div>
                          <pre className="p-4 text-sm overflow-x-auto bg-gray-900 rounded-b-lg">
                            <code>{solution.completeCode}</code>
                          </pre>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        Solutions will appear once the problem is solved.
                      </p>
                    )}
                  </div>
                )}
                {activeLeftTab === "submissions" && (
                  <SubmissionHistory problemId={problemId} />
                )}
                {activeLeftTab === "chatAI" &&
                  (problem ? (
                    <ChatAi problem={problem} />
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <span className="loading loading-spinner loading-lg"></span>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex flex-col bg-gray-900">
          <div className="flex border-b border-gray-800 bg-gray-900 px-6 py-3 gap-4">
            {["code", "testcase", "result"].map((tab) => (
              <button
                key={tab}
                className={`pb-2 border-b-2 font-medium ${
                  activeRightTab === tab
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setActiveRightTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col">
            {activeRightTab === "code" && (
              <div className="flex-1 flex flex-col">
                <div className="flex gap-2 p-3 border-b border-gray-800">
                  <select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    className="select select-bordered w-25 text-sm bg-gray-800 border-gray-700 hover:bg-gray-700 py-1 px-2 h-8"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>

                <div className="flex-1">
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
                    }}
                  />
                </div>

                <div className="p-3 border-t border-gray-800 flex justify-between">
                  <button
                    onClick={() => setActiveRightTab("testcase")}
                    className="btn btn-sm btn-neutral text-gray-400"
                  >
                    Console
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={handleRun}
                      disabled={loading}
                      className="btn btn-sm btn-outline text-gray-400 border-gray-600 hover:bg-gray-700"
                    >
                      {loading === "run" ? "Running..." : "Run"}
                    </button>
                    <button
                      onClick={handleSubmitCode}
                      disabled={loading}
                      className="btn btn-sm btn-primary text-white"
                    >
                      {loading === "submit" ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeRightTab === "testcase" && (
              <div className="p-4 overflow-y-auto text-sm text-gray-300">
                <h3 className="font-semibold mb-4">Test Results</h3>
                {runResult ? (
                  <div
                    className={`p-4 rounded-md ${
                      runResult.success ? "bg-green-900" : "bg-red-900"
                    }`}
                  >
                    {runResult.testCases.map((tc, i) => (
                      <div key={i} className="mb-3 bg-gray-800 p-3 rounded">
                        <div>
                          <strong>Input:</strong> {tc.stdin}
                        </div>
                        <div>
                          <strong>Expected:</strong> {tc.expected_output}
                        </div>
                        <div>
                          <strong>Output:</strong> {tc.stdout}
                        </div>
                        <div
                          className={
                            tc.status_id === 3
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {tc.status_id === 3 ? "✓ Passed" : "✗ Failed"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Click Run to execute test cases.
                  </p>
                )}
              </div>
            )}

            {activeRightTab === "result" && (
              <div className="p-4 text-sm text-gray-300">
                <h3 className="font-semibold mb-4">Submission Result</h3>
                {submitResult ? (
                  <div
                    className={`p-4 rounded-md ${
                      submitResult.accepted ? "bg-green-900" : "bg-red-900"
                    }`}
                  >
                    <h4 className="font-bold text-lg">
                      {submitResult.accepted
                        ? "🎉 Accepted"
                        : "❌ " + submitResult.error}
                    </h4>
                    <p>
                      Passed: {submitResult.passedTestCases}/
                      {submitResult.totalTestCases}
                    </p>
                    <p>Runtime: {submitResult.runtime} sec</p>
                    <p>Memory: {submitResult.memory} KB</p>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Click Submit to evaluate your solution.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
