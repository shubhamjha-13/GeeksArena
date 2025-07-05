const express = require("express");

const authRouter = express.Router();
const {
  register,
  login,
  logout,
  adminRegister,
  deleteProfile,
  getProfile,
  updateProfile,
} = require("../controllers/userAuthent");
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const rateLimiter = require("../middleware/ratelimiter");
// Register
authRouter.post("/register", register);
authRouter.post("/login", rateLimiter, login);
authRouter.post("/logout", userMiddleware, logout);
authRouter.post("/admin/register", adminMiddleware, adminRegister);
authRouter.delete("/deleteProfile", userMiddleware, deleteProfile);
authRouter.get("/check", userMiddleware, (req, res) => {
  const reply = {
    firstName: req.result.firstName,
    emailId: req.result.emailId,
    _id: req.result._id,
    role: req.result.role,
  };

  res.status(200).json({
    user: reply,
    message: "Valid User",
  });
});
authRouter.get("/getProfile", userMiddleware, getProfile);
authRouter.put("/update/:id", userMiddleware, updateProfile);
module.exports = authRouter;

// login
// logout
// GetProfile
