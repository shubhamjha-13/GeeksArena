const mongoose = require("mongoose");
const Sheet = require("../models/sheet");
const Problem = require("../models/problem");

const createSheet = async (req, res) => {
  const { title, description, problems, isPublic, difficulty } = req.body;
  const userId = req.result._id; // From adminMiddleware

  try {
    // Basic validation
    if (!title || !Array.isArray(problems) || problems.length === 0) {
      return res
        .status(400)
        .json({ message: "Title and problems are required." });
    }

    // Validate each problem ID
    const areAllIdsValid = problems.every((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    if (!areAllIdsValid) {
      return res
        .status(400)
        .json({ message: "One or more problem IDs are invalid." });
    }

    // Verify problems exist
    const existingProblems = await Problem.find({ _id: { $in: problems } });
    if (existingProblems.length !== problems.length) {
      return res
        .status(404)
        .json({ message: "Some problems not found in the database." });
    }

    // Create new sheet
    const newSheet = new Sheet({
      title,
      description,
      problems,
      createdBy: userId,
      isPublic: isPublic || false,
      difficulty: difficulty || "beginner",
    });

    await newSheet.save();

    res.status(201).json({
      message: "Sheet created successfully",
      sheet: newSheet,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

// const addToSheet = async (req,res)=>{

// }
module.exports = {
  createSheet,
};
