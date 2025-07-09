const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../utils/problemUtility");
const Problem = require("../models/problem");
const User = require("../models/user");
const Submission = require("../models/submission");
const SolutionVideo = require("../models/solutionVideo");

const createProblem = async (req, res) => {
  // API request to authenticate user:
  const {
    title,
    description,
    difficulty,
    constraints,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
    problemCreator,
  } = req.body;

  try {
    for (const { language, completeCode } of referenceSolution) {
      // source_code:
      // language_id:
      // stdin:
      // expectedOutput:

      const languageId = getLanguageById(language);

      // I am creating Batch submission
      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));

      const submitResult = await submitBatch(submissions);
      // console.log(submitResult);

      const resultToken = submitResult.map((value) => value.token);

      // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

      const testResult = await submitToken(resultToken);

      console.log(testResult);

      for (const test of testResult) {
        if (test.status_id != 3) {
          return res.status(400).send("Error Occured");
        }
      }
    }

    // We can store it in our DB

    const userProblem = await Problem.create({
      ...req.body,
      problemCreator: req.result._id,
    });

    res.status(201).send("Problem Saved Successfully");
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

const updateProblem = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    constraints,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
    problemCreator,
  } = req.body;

  try {
    if (!id) {
      return res.status(400).send("Missing ID Field");
    }

    const DsaProblem = await Problem.findById(id);
    if (!DsaProblem) {
      return res.status(404).send("ID is not persent in server");
    }

    for (const { language, completeCode } of referenceSolution) {
      // source_code:
      // language_id:
      // stdin:
      // expectedOutput:

      const languageId = getLanguageById(language);

      // I am creating Batch submission
      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));

      const submitResult = await submitBatch(submissions);
      // console.log(submitResult);

      const resultToken = submitResult.map((value) => value.token);

      // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

      const testResult = await submitToken(resultToken);

      //  console.log(testResult);

      for (const test of testResult) {
        if (test.status_id != 3) {
          return res.status(400).send("Error Occured");
        }
      }
    }

    const newProblem = await Problem.findByIdAndUpdate(
      id,
      { ...req.body },
      { runValidators: true, new: true }
    );

    res.status(200).send(newProblem);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).send("ID is Missing");

    const deletedProblem = await Problem.findByIdAndDelete(id);

    if (!deletedProblem) return res.status(404).send("Problem is Missing");

    res.status(200).send("Successfully Deleted");
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).send("ID is Missing");

    const getProblem = await Problem.findById(id).select(
      "_id title description difficulty constraints tags visibleTestCases startCode referenceSolution "
    );

    // video ka jo bhi url wagera le aao

    if (!getProblem) return res.status(404).send("Problem is Missing");

    const videos = await SolutionVideo.findOne({ problemId: id });

    if (videos) {
      const responseData = {
        ...getProblem.toObject(),
        secureUrl: videos.secureUrl,
        thumbnailUrl: videos.thumbnailUrl,
        duration: videos.duration,
      };

      return res.status(200).send(responseData);
    }

    res.status(200).send(getProblem);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

// const getAllProblem = async (req, res) => {
//   try {
//     const getProblem = await Problem.find({}).select(
//       "_id title difficulty tags"
//     );

//     if (getProblem.length == 0)
//       return res.status(404).send("Problem is Missing");

//     res.status(200).send(getProblem);
//   } catch (err) {
//     res.status(500).send("Error: " + err);
//   }
// };

const getAllProblem = async (req, res) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;

    let getProblem;
    let total;

    if (!page && !limit) {
      // No pagination — return all problems
      getProblem = await Problem.find({}).select("_id title difficulty tags");
      total = getProblem.length;
    } else {
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const skip = (pageNum - 1) * limitNum;

      getProblem = await Problem.find({})
        .select("_id title difficulty tags")
        .skip(skip)
        .limit(limitNum);

      total = await Problem.countDocuments();
    }

    if (getProblem.length === 0) {
      return res.status(404).send("No problems found");
    }

    res.status(200).json({
      total,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      totalPages: limit ? Math.ceil(total / parseInt(limit)) : undefined,
      problems: getProblem,
    });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

const solvedAllProblembyUser = async (req, res) => {
  try {
    const userId = req.result._id;

    const user = await User.findById(userId).populate({
      path: "problemSolved",
      select: "_id title difficulty tags",
    });

    res.status(200).send(user.problemSolved);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const submittedProblem = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.pid;
    const submissions = await Submission.find({ userId, problemId }).sort({ createdAt: -1 });

    // Always return JSON array - either empty or with submissions
    return res.status(200).json(submissions); // ✅ Single response with return
  } catch (err) {
    console.error("Error in submittedProblem:", err);
    
    if (res.headersSent) return; // Safety check
    
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblem,
  solvedAllProblembyUser,
  submittedProblem,
};
