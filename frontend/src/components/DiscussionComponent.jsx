// src/components/DiscussionComponent.jsx
import React, { useState, useEffect } from "react";
import discussionService from "../utils/discusssionService";

const DiscussionComponent = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [newComments, setNewComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts on mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const response = await discussionService.fetchPosts();
        setPosts(response.data);

        // Initialize comment states
        const commentsState = {};
        response.data.forEach((post) => {
          commentsState[post._id] = "";
        });
        setNewComments(commentsState);
      } catch (error) {
        setError("Failed to load posts");
        console.error("Failed to load posts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Handle post creation
  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const response = await discussionService.createPost(newPost);
      setPosts([response.data, ...posts]);
      setNewPost({ title: "", content: "", tags: "" });
      setError(null);
    } catch (error) {
      setError("Failed to create post");
      console.error("Failed to create post:", error);
    }
  };

  // Handle comment submission
  const handleAddComment = async (postId, e) => {
    e.preventDefault();
    try {
      const text = newComments[postId];
      if (!text.trim()) return;

      const response = await discussionService.addComment(postId, text);

      // Update posts with new comment
      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          return response.data; // Updated post with new comment
        }
        return post;
      });

      setPosts(updatedPosts);
      setNewComments({ ...newComments, [postId]: "" });
      setError(null);
    } catch (error) {
      setError("Failed to add comment");
      console.error("Failed to add comment:", error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  // Handle comment input changes
  const handleCommentChange = (postId, value) => {
    setNewComments({ ...newComments, [postId]: value });
  };

  if (loading) return <div className="text-center py-10">Loading posts...</div>;
  if (error)
    return <div className="text-red-500 text-center py-5">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Create Post Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
        <form onSubmit={handleCreatePost}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newPost.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={newPost.content}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md min-h-[100px]"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="tags">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={newPost.tags}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="e.g., javascript, react, nodejs"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create Post
          </button>
        </form>
      </div>

      {/* Posts List */}
      <div className="space-y-8">
        {posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No posts found. Be the first to create one!
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-md p-6">
              {/* Post Header */}
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <h3 className="font-bold text-lg">
                    {post.user?.firstName} {post.user?.lastName}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Post Content */}
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-700 mb-4">{post.content}</p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-2 py-1 rounded text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Comments Section */}
              <div className="mt-6">
                <h3 className="font-bold mb-3">
                  Comments ({post.comments.length})
                </h3>

                {/* Add Comment Form */}
                <form
                  onSubmit={(e) => handleAddComment(post._id, e)}
                  className="mb-4"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComments[post._id] || ""}
                      onChange={(e) =>
                        handleCommentChange(post._id, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border rounded-md"
                      placeholder="Add a comment..."
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Post
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {post.comments.map((comment, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                      <div className="ml-3 flex-1">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex justify-between">
                            <span className="font-bold">{comment.name}</span>
                            <span className="text-gray-500 text-sm">
                              {new Date(comment.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="mt-1">{comment.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiscussionComponent;
