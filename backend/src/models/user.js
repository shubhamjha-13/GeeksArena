const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 20,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
    },
    age: {
      type: Number,
      min: 6,
      max: 80,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    problemSolved: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "problem",
          unique: true,
        },
      ],
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String, // Will store Cloudinary URL
      default: "", // Optional
    },

    bio: {
      type: String,
      maxLength: 300, // Limit to a few sentences
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      maxLength: 100,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.post("findOneAndDelete", async function (userInfo) {
  if (userInfo) {
    await mongoose.model("submission").deleteMany({ userId: userInfo._id });
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
