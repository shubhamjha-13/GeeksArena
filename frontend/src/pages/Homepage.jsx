import { useEffect, useState } from "react";
import { NavLink } from "react-router"; // corrected
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";
import Navbar from "../components/Navbar";
import Button2 from "../components/button2";

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/problemSolvedByUser");
        setSolvedProblems(data);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === "all" || problem.tags === filters.tag;
    const statusMatch =
      filters.status === "all" ||
      (filters.status === "solved" &&
        solvedProblems.some((sp) => sp._id === problem._id));
    return difficultyMatch && tagMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="flex flex-col md:flex-row p-6 gap-6">
        {/* Left Sidebar - Filters */}
        <aside className="w-full md:w-64 bg-base-100 p-4 rounded-xl shadow-md h-fit sticky top-24">
          <h3 className="font-semibold text-lg mb-4">Filters</h3>

          <div className="flex flex-col gap-3">
            <label className="font-medium">Status</label>
            <select
              className="select select-bordered select-sm"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="all">All</option>
              <option value="solved">Solved</option>
            </select>

            <label className="font-medium">Difficulty</label>
            <select
              className="select select-bordered select-sm"
              value={filters.difficulty}
              onChange={(e) =>
                setFilters({ ...filters, difficulty: e.target.value })
              }
            >
              <option value="all">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <label className="font-medium">Tags</label>
            <select
              className="select select-bordered select-sm"
              value={filters.tag}
              onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
            >
              <option value="all">All</option>
              <option value="array">Array</option>
              <option value="linkedList">Linked List</option>
              <option value="graph">Graph</option>
              <option value="dp">DP</option>
            </select>
          </div>
        </aside>

        {/* Main Content - Problems List */}
        <main className="flex-1">
          <div className="overflow-x-auto bg-base-100 shadow-lg rounded-xl">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Problem</th>
                  <th>Difficulty</th>
                  <th>Tags</th>
                  <th>Companies</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Add to Sheets</th>
                  <th>Solve</th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.map((problem) => (
                  <tr key={problem._id}>
                    <td>
                      <NavLink
                        to={`/problem/${problem._id}`}
                        className="hover:text-primary font-medium"
                      >
                        {problem.title}
                      </NavLink>
                    </td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
    ${getDifficultyBadgeStyle(problem.difficulty)}`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>

                    <td>
                    <div className="flex flex-wrap gap-1">
  {Array.isArray(problem.tags)
    ? problem.tags.map((tag, idx) => (
        <span
          key={idx}
          className="bg-sky-100 text-sky-700 px-2 py-0.5 text-xs font-medium rounded-full"
        >
          {tag}
        </span>
      ))
    : (
        <span className="bg-sky-100 text-sky-700 px-2 py-0.5 text-xs font-medium rounded-full">
          {problem.tags}
        </span>
      )}
</div>

                    </td>

                    <td>
                      <div className="flex flex-wrap gap-1">
                        {problem.companies?.slice(0, 2).map((comp, idx) => (
                          <span
                            key={idx}
                            className="badge badge-neutral badge-sm"
                          >
                            {comp}
                          </span>
                        ))}
                        {problem.companies?.length > 2 && (
                          <span className="badge badge-ghost badge-sm">
                            +{problem.companies.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      {solvedProblems.some((sp) => sp._id === problem._id) ? (
                        <span className="badge badge-success">Solved</span>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      <button
                        className="btn btn-xs btn-outline"
                        title="Add Note"
                        onClick={() => alert("Open note modal (to implement)")}
                      >
                        +
                      </button>
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-square"
                        title="Add to Sheets"
                        onClick={() =>
                          alert("Add to sheet logic (to implement)")
                        }
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                    </td>

                    <td className="m-auto">
                      <NavLink to={`/problem/${problem._id}`}>
                        <Button2 />
                      </NavLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProblems.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-400">
                No problems found with selected filters.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

const getDifficultyBadgeStyle = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "hard":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};


export default Homepage;
