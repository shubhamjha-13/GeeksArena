import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.string().min(1, "Tag is required"),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1),
      output: z.string().min(1),
      explanation: z.string().min(1),
    })
  ),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1),
      output: z.string().min(1),
    })
  ),
  startCode: z
    .array(
      z.object({
        language: z.enum(["C++", "Java", "JavaScript"]),
        initialCode: z.string().min(1),
      })
    )
    .length(3),
  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["C++", "Java", "JavaScript"]),
        completeCode: z.string().min(1),
      })
    )
    .length(3),
});

const UpdateProblem = () => {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    tags: "",
    visibleTestCases: [],
    hiddenTestCases: [],
    startCode: [
      { language: "C++", initialCode: "" },
      { language: "Java", initialCode: "" },
      { language: "JavaScript", initialCode: "" },
    ],
    referenceSolution: [
      { language: "C++", completeCode: "" },
      { language: "Java", completeCode: "" },
      { language: "JavaScript", completeCode: "" },
    ],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const { data } = await axiosClient.get("/problem/getAllProblem");
      setProblems(data.problems);
    } catch (err) {
      console.error("Error fetching problems:", err);
    }
  };

  const handleSelectChange = async (e) => {
    const id = e.target.value;
    setSelectedProblem(id);
    try {
      const { data } = await axiosClient.get(`/problem/problemById/${id}`);
      setFormData({
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        tags: data.tags,
        visibleTestCases: data.visibleTestCases || [],
        hiddenTestCases: data.hiddenTestCases || [],
        startCode: data.startCode || [],
        referenceSolution: data.referenceSolution || [],
      });
      setErrors({});
    } catch (err) {
      console.error("Error fetching problem by ID:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestCaseChange = (type, index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev[type]];
      updated[index][field] = value;
      return { ...prev, [type]: updated };
    });
  };

  const handleAddTestCase = (type) => {
    const newTestCase =
      type === "visibleTestCases"
        ? { input: "", output: "", explanation: "" }
        : { input: "", output: "" };
    setFormData((prev) => ({ ...prev, [type]: [...prev[type], newTestCase] }));
  };

  const handleRemoveTestCase = (type, index) => {
    setFormData((prev) => {
      const updated = [...prev[type]];
      updated.splice(index, 1);
      return { ...prev, [type]: updated };
    });
  };

  const handleCodeChange = (type, index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev[type]];
      updated[index][field] = value;
      return { ...prev, [type]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = schema.safeParse(formData);
    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      setErrors(formattedErrors);
      return;
    }
    try {
      await axiosClient.post(`/problem/update/${selectedProblem}`, formData);
      alert("Problem updated successfully");
      setSelectedProblem(null);
      setFormData({
        title: "",
        description: "",
        difficulty: "easy",
        tags: "",
        visibleTestCases: [],
        hiddenTestCases: [],
        startCode: [
          { language: "C++", initialCode: "" },
          { language: "Java", initialCode: "" },
          { language: "JavaScript", initialCode: "" },
        ],
        referenceSolution: [
          { language: "C++", completeCode: "" },
          { language: "Java", completeCode: "" },
          { language: "JavaScript", completeCode: "" },
        ],
      });
      fetchProblems();
    } catch (err) {
      console.error("Error updating problem:", err);
      alert("Failed to update problem");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Update Problem</h1>

      <select
        onChange={handleSelectChange}
        className="select select-bordered mb-6 w-full max-w-md"
        value={selectedProblem || ""}
      >
        <option value="" disabled>
          Select a problem to update
        </option>
        {problems.map((problem) => (
          <option key={problem._id} value={problem._id}>
            {problem.title}
          </option>
        ))}
      </select>

      {selectedProblem && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />
            {errors.title && <p className="text-error">{errors.title[0]}</p>}
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="textarea textarea-bordered w-full"
              rows={4}
            />
            {errors.description && (
              <p className="text-error">{errors.description[0]}</p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="label">Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="select select-bordered w-full"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="label">Tags</label>
              <input
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
              {errors.tags && <p className="text-error">{errors.tags[0]}</p>}
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Visible Test Cases</h3>
            {formData.visibleTestCases.map((test, index) => (
              <div key={index} className="space-y-2">
                <input
                  value={test.input}
                  onChange={(e) =>
                    handleTestCaseChange(
                      "visibleTestCases",
                      index,
                      "input",
                      e.target.value
                    )
                  }
                  placeholder="Input"
                  className="input input-bordered w-full"
                />
                <input
                  value={test.output}
                  onChange={(e) =>
                    handleTestCaseChange(
                      "visibleTestCases",
                      index,
                      "output",
                      e.target.value
                    )
                  }
                  placeholder="Output"
                  className="input input-bordered w-full"
                />
                <input
                  value={test.explanation}
                  onChange={(e) =>
                    handleTestCaseChange(
                      "visibleTestCases",
                      index,
                      "explanation",
                      e.target.value
                    )
                  }
                  placeholder="Explanation"
                  className="input input-bordered w-full"
                />
                <button
                  type="button"
                  className="btn btn-sm btn-error"
                  onClick={() =>
                    handleRemoveTestCase("visibleTestCases", index)
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddTestCase("visibleTestCases")}
              className="btn btn-primary mt-2"
            >
              Add Visible
            </button>
          </div>

          <div>
            <h3 className="font-semibold">Hidden Test Cases</h3>
            {formData.hiddenTestCases.map((test, index) => (
              <div key={index} className="space-y-2">
                <input
                  value={test.input}
                  onChange={(e) =>
                    handleTestCaseChange(
                      "hiddenTestCases",
                      index,
                      "input",
                      e.target.value
                    )
                  }
                  placeholder="Input"
                  className="input input-bordered w-full"
                />
                <input
                  value={test.output}
                  onChange={(e) =>
                    handleTestCaseChange(
                      "hiddenTestCases",
                      index,
                      "output",
                      e.target.value
                    )
                  }
                  placeholder="Output"
                  className="input input-bordered w-full"
                />
                <button
                  type="button"
                  className="btn btn-sm btn-error"
                  onClick={() => handleRemoveTestCase("hiddenTestCases", index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddTestCase("hiddenTestCases")}
              className="btn btn-primary mt-2"
            >
              Add Hidden
            </button>
          </div>

          <div>
            <h3 className="font-semibold">Start Code</h3>
            {formData.startCode.map((code, index) => (
              <div key={index} className="space-y-2">
                <label>{code.language}</label>
                <textarea
                  value={code.initialCode}
                  onChange={(e) =>
                    handleCodeChange(
                      "startCode",
                      index,
                      "initialCode",
                      e.target.value
                    )
                  }
                  className="textarea textarea-bordered w-full"
                />
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-semibold">Reference Solution</h3>
            {formData.referenceSolution.map((code, index) => (
              <div key={index} className="space-y-2">
                <label>{code.language}</label>
                <textarea
                  value={code.completeCode}
                  onChange={(e) =>
                    handleCodeChange(
                      "referenceSolution",
                      index,
                      "completeCode",
                      e.target.value
                    )
                  }
                  className="textarea textarea-bordered w-full"
                />
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn-success w-full">
            Update Problem
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateProblem;
