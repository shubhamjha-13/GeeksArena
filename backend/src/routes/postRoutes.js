const express = require("express");
const postRouter = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  addComment,
} = require("../controllers/postController");
const userMiddleware = require("../middleware/userMiddleware");

// Public routes
postRouter.get("/", getPosts);
postRouter.get("/:id", getPostById);

// Private routes (require authentication)
postRouter.post("/create", userMiddleware, createPost);
postRouter.post("/:id/comments", userMiddleware, addComment);

module.exports = postRouter;
