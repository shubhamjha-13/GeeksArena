// src/components/DiscussionComponent.jsx
import React, { useState, useEffect } from "react";
import discussionService from "../utils/discusssionService";
import CreatePost from "./CreatePost";

const DiscussionComponent = () => {
  const [posts, setPosts] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newComments, setNewComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [activeFilter, setActiveFilter] = useState("all");

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
  const handleCreatePost = async (postData) => {
    try {
      const response = await discussionService.createPost(postData);
      setPosts([response.data, ...posts]);
      setError(null);
      setIsCreateModalOpen(false);
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
          return response.data;
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

  // Handle comment input changes
  const handleCommentChange = (postId, value) => {
    setNewComments({ ...newComments, [postId]: value });
  };

  // Toggle post expansion
  const togglePostExpansion = (postId) => {
    setExpandedPosts({
      ...expandedPosts,
      [postId]: !expandedPosts[postId]
    });
  };

  // Filter posts by tag
  const filteredPosts = activeFilter === "all" 
    ? posts 
    : posts.filter(post => post.tags && post.tags.includes(activeFilter));

  // Extract unique tags
  const allTags = [...new Set(posts.flatMap(post => post.tags || []))];
  
  // Get user initials safely
  const getUserInitials = (user) => {
    if (!user) return 'U';
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    return (first + last) || 'U';
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto mt-[4rem]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Developer Discussions</h1>
            <p className="text-gray-600 mt-2">Share knowledge, ask questions, and connect with fellow developers</p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md"
          >
            Create New Post
          </button>
        </div>
        
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button 
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${activeFilter === "all" ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All Topics
          </button>
          {allTags.map(tag => (
            <button 
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${activeFilter === tag ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{posts.length}</p>
          <p className="text-gray-600 text-sm">Total Posts</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {posts.reduce((total, post) => total + (post.comments?.length || 0), 0)}
          </p>
          <p className="text-gray-600 text-sm">Total Comments</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{allTags.length}</p>
          <p className="text-gray-600 text-sm">Topics</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">
            {[...new Set(posts.map(post => post.user?._id))].filter(id => id).length}
          </p>
          <p className="text-gray-600 text-sm">Active Users</p>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No posts found</h3>
            <p className="mt-2 text-gray-500">Be the first to create a post in this category!</p>
            <div className="mt-6">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Create Post
              </button>
            </div>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const userInitials = getUserInitials(post.user);
            return (
              <div key={post._id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
                {/* Post Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl w-12 h-12 flex items-center justify-center text-white font-bold text-lg">
                      {userInitials}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {post.user?.firstName || 'Unknown'} {post.user?.lastName || ''}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {new Date(post.createdAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <button 
                          onClick={() => togglePostExpansion(post._id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {expandedPosts[post._id] ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      </div>
                      
                      <h2 className="text-xl font-bold text-gray-900 mt-3">{post.title}</h2>
                      
                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                              onClick={() => setActiveFilter(tag)}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Post Content - Collapsible */}
                <div className={`overflow-hidden transition-all duration-300 ${expandedPosts[post._id] ? 'max-h-[1000px]' : 'max-h-0'}`}>
                  <div className="p-6 pt-4">
                    <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
                    
                    {/* Engagement Metrics */}
                    <div className="flex items-center mt-6 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-gray-500 mr-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>42 Likes</span>
                      </div>
                      <div className="flex items-center text-gray-500 mr-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{post.comments?.length || 0} Comments</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span>Share</span>
                      </div>
                    </div>
                    
                    {/* Comments Section */}
                    <div className="mt-6">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Comments ({post.comments?.length || 0})
                      </h3>

                      {/* Add Comment Form */}
                      <form
                        onSubmit={(e) => handleAddComment(post._id, e)}
                        className="mb-6"
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0">
                            <div className="bg-gradient-to-r from-green-400 to-teal-500 rounded-xl w-10 h-10 flex items-center justify-center text-white font-bold">
                              Y
                            </div>
                          </div>
                          <div className="flex-1 flex">
                            <input
                              type="text"
                              value={newComments[post._id] || ""}
                              onChange={(e) =>
                                handleCommentChange(post._id, e.target.value)
                              }
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Add a comment..."
                            />
                            <button
                              type="submit"
                              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 font-medium rounded-r-lg hover:from-blue-700 hover:to-indigo-800 transition-all"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      </form>

                      {/* Comments List */}
                      <div className="space-y-4">
                        {post.comments?.map((comment, index) => (
                          <div key={index} className="flex items-start">
                            <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl w-10 h-10 flex items-center justify-center text-white font-bold flex-shrink-0">
                              {comment.name?.[0] || 'U'}
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between">
                                  <span className="font-bold text-gray-900">{comment.name || "Anonymous"}</span>
                                  <span className="text-gray-500 text-sm">
                                    {new Date(comment.createdAt).toLocaleString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <p className="mt-2 text-gray-700">{comment.text}</p>
                                
                                {/* Comment Actions */}
                                <div className="flex items-center mt-3">
                                  <button className="text-gray-500 hover:text-blue-600 flex items-center text-sm mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                    Like
                                  </button>
                                  <button className="text-gray-500 hover:text-blue-600 flex items-center text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                    </svg>
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Post Footer - Always visible */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
                  <button 
                    onClick={() => togglePostExpansion(post._id)}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    {expandedPosts[post._id] ? 'Show less' : 'Read more'}
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ml-1 transition-transform ${expandedPosts[post._id] ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="flex items-center space-x-4">
                    <button className="text-gray-500 hover:text-blue-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="ml-1">Like</span>
                    </button>
                    <button className="text-gray-500 hover:text-blue-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="ml-1">Comment</span>
                    </button>
                    <button className="text-gray-500 hover:text-blue-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span className="ml-1">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Create Post Modal */}
      <CreatePost 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreatePost={handleCreatePost}
      />
    </div>
  );
};

export default DiscussionComponent;