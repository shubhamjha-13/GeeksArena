// src/services/discussionService.js
import axiosClient from "./axiosClient";

const DISCUSSION_BASE = "/discuss";

const discussionService = {
  // Get all posts
  fetchPosts: () => {
    return axiosClient.get(DISCUSSION_BASE);
  },

  // Get single post by ID
  fetchPostById: (postId) => {
    return axiosClient.get(`${DISCUSSION_BASE}/${postId}`);
  },

  // Create new post
  createPost: (postData) => {
    return axiosClient.post(DISCUSSION_BASE, postData);
  },

  // Add comment to post
  addComment: (postId, commentText) => {
    return axiosClient.post(`${DISCUSSION_BASE}/${postId}/comments`, {
      text: commentText,
    });
  },
};

export default discussionService;
