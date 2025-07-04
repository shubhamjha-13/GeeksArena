const redisClient = require("../config/redis");
const User = require("../models/user");
const validate = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Submission = require("../models/submission");

const register = async (req, res) => {
  try {
    // validate the data;

    validate(req.body);
    const { firstName, emailId, password } = req.body;

    req.body.password = await bcrypt.hash(password, 10);
    req.body.role = "user";
    //

    const user = await User.create(req.body);
    const token = jwt.sign(
      { _id: user._id, emailId: emailId, role: "user" },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 }
    );
    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).json({
      user: reply,
      message: "Loggin Successfully",
    });
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId) throw new Error("Invalid Credentials");
    if (!password) throw new Error("Invalid Credentials");

    const user = await User.findOne({ emailId });

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw new Error("Invalid Credentials");

    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };

    const token = jwt.sign(
      { _id: user._id, emailId: emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 }
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).json({
      user: reply,
      message: "Loggin Successfully",
    });
  } catch (err) {
    res.status(401).send("Error: " + err);
  }
};

// logOut feature

const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    const payload = jwt.decode(token);

    await redisClient.set(`token:${token}`, "Blocked");
    await redisClient.expireAt(`token:${token}`, payload.exp);
    //    Token add kar dung Redis ke blockList
    //    Cookies ko clear kar dena.....

    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logged Out Succesfully");
  } catch (err) {
    res.status(503).send("Error: " + err);
  }
};

const adminRegister = async (req, res) => {
  try {
    // validate the data;
    //   if(req.result.role!='admin')
    //     throw new Error("Invalid Credentials");
    validate(req.body);
    const { firstName, emailId, password } = req.body;

    req.body.password = await bcrypt.hash(password, 10);
    //

    const user = await User.create(req.body);
    const token = jwt.sign(
      { _id: user._id, emailId: emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 }
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).send("User Registered Successfully");
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

const deleteProfile = async (req, res) => {
  try {
    const userId = req.result._id;

    // userSchema delete
    await User.findByIdAndDelete(userId);

    // Submission se bhi delete karo...

    // await Submission.deleteMany({userId});

    res.status(200).send("Deleted Successfully");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

// const getProfile = async (req, res) => {
//   try {
//     const user = req.result;

//     // Calculate account creation date
//     const joinDate = user.createdAt
//       ? new Date(user.createdAt).toLocaleDateString("en-US", {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//         })
//       : "Unknown";

//     // Build safe response object
//     const userProfile = {
//       _id: user._id,
//       firstName: user.firstName || "",
//       lastName: user.lastName || "",
//       emailId: user.emailId || "",
//       role: user.role || "user",
//       problemSolved: user.problemSolved?.length || 0,
//       problems: user.problemSolved,
//       joinDate, // Computed creation date
//     };

//     // Add optional fields only if they exist
//     if (user.age !== undefined && user.age !== null) {
//       userProfile.age = user.age;
//     }

//     res.status(200).json(userProfile);
//   } catch (err) {
//     res.status(500).json({
//       message: err.message || "Internal server error",
//     });
//   }
// };

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.result._id)
      .populate({
        path: "problemSolved", // Change 'problem' to 'problemSolved'
        select: "_id title difficulty tags",
      })
      .populate({
        path: "posts",
        select: "_id title content tags createdAt",
        options: { sort: { createdAt: -1 } },
      });

    // Calculate account creation date
    const joinDate = user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unknown";

    // console.log(JSON.stringify(user, null, 2)); // Pretty-print the entire user object
    // Build safe response object
    const userProfile = {
      _id: user._id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      emailId: user.emailId || "",
      role: user.role || "user",
      problemSolvedCount: user.problemSolved?.length || 0,
      problemsSolved: user.problemSolved || [],
      postCount: user.posts?.length || 0, // Add count of posts
      posts: user.posts || [], // Include the posts array
      joinDate,
    };

    // Add optional fields only if they exist
    if (user.age !== undefined && user.age !== null) {
      userProfile.age = user.age;
    }

    res.status(200).json(userProfile);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
};
module.exports = {
  register,
  login,
  logout,
  adminRegister,
  deleteProfile,
  getProfile,
};
