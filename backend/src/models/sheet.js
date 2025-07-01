// models/sheet.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sheetSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 100,
    },
    description: {
      type: String,
      maxLength: 500,
    },
    problems: [
      {
        type: Schema.Types.ObjectId,
        ref: "problem",
        required: true,
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
  },
  { timestamps: true }
);

sheetSchema.index({ title: "text", description: "text" });

const Sheet = mongoose.model("sheet", sheetSchema);

module.exports = Sheet;
