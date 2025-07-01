const Post = require("../models/blogPost");
const User = require("../models/user"); // Assuming you have a User model

// @desc    Get all posts
// @route   GET /api/discuss/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      // Fix population: use correct model name and fields
      .populate("user", "firstName lastName");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single post by ID
// @route   GET /api/discuss/posts/:id
// @access  Public
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "user",
      "firstName lastName"
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new post
// @route   POST /api/discuss/posts
// @access  Private
// const createPost = async (req, res) => {
//   const { title, content, tags } = req.body;
//   //   console.log(req.result.id);
//   if (!title || !content) {
//     return res.status(400).json({ message: "Title and content are required" });
//   }

//   try {
//     const post = new Post({
//       title,
//       content,
//       tags: tags.split(",").map((tag) => tag.trim()), // Assuming tags are a comma-separated string
//       user: req.result.id,
//     });

//     const createdPost = await post.save();
//     res.status(201).json(createdPost);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const createPost = async (req, res) => {
  const { title, content, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const post = new Post({
      title,
      content,
      tags: tags.split(",").map((tag) => tag.trim()),
      user: req.result.id,
    });

    const createdPost = await post.save();

    // Add the post to the user's posts array
    await User.findByIdAndUpdate(req.result.id, {
      $push: { posts: createdPost._id },
    });

    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/discuss/posts/:id/comments
// @access  Private
const addComment = async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (post) {
      const fullName = req.result.lastName
        ? `${req.result.firstName} ${req.result.lastName}`
        : req.result.firstName;
      const comment = {
        text,
        user: req.result.id,
        name: fullName, // or username, from your User model
      };

      post.comments.push(comment);
      await post.save();
      res
        .status(201)
        .json({ message: "Comment added", comments: post.comments });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  addComment,
};
