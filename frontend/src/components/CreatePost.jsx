import React from 'react';
import axiosClient from '../utils/axiosClient'; // Add missing import
import { useNavigate } from 'react-router'; // Add missing import

const CreatePost = ({ isOpen, onClose, onCreatePost }) => {
  const [formData, setFormData] = React.useState({
    title: "",
    content: "",
    tags: ""
  });
  const navigate = useNavigate(); // Initialize navigate

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fixed handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior
    
    try {

      // Make API request
      await axiosClient.post('/discuss/create', formData);
      
      // Notify parent component and reset form
      if (onCreatePost) onCreatePost();
      onClose();
      navigate('/discuss'); // Navigate to home
    } catch (error) {
      console.error('Error creating post:', error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-t-[17px] rounded-b-[27px] shadow-[0_0_0_rgba(0,0,0,0.1),0_12px_26px_rgba(0,0,0,0.1),0_47px_47px_rgba(0,0,0,0.09),0_105px_63px_rgba(0,0,0,0.05),0_187px_75px_rgba(0,0,0,0.01)] w-full max-w-[450px] max-h-[90vh] overflow-y-auto">
        <div className="w-full h-[50px] relative flex items-center pl-5 border-b border-gray-100">
          <span className="font-bold text-[13px] text-[#47484b]">Create New Post</span>
          <div className="absolute bottom-0 left-5 w-[8ch] h-px bg-[#47484b]"></div>
          <button 
            onClick={onClose}
            className="ml-auto mr-4 text-gray-500 hover:text-gray-700"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>

        <div className="p-5">
          <form onSubmit={handleSubmit}> {/* Use form onSubmit */}
            <div className="mb-4">
              <label className="block text-[#47484b] text-[13px] font-semibold mb-2" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border text-sm text-gray-800 rounded-md outline-none caret-blue-500"
                placeholder="Post title"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-[#47484b] text-[13px] font-semibold mb-2" htmlFor="content">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border text-sm text-gray-800 rounded-md min-h-[150px] outline-none caret-blue-500"
                placeholder="Write your post content..."
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-[#47484b] text-[13px] font-semibold mb-2" htmlFor="tags">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border text-sm text-gray-800 rounded-md outline-none caret-blue-500"
                placeholder="e.g., javascript, react, nodejs"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit" // Make this a submit button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <span>Create Post</span>
                <svg 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  className="h-5 w-5 ml-2" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" stroke="#ffffff" d="M12 5L12 20" />
                  <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" stroke="#ffffff" d="M7 9L11.2929 4.70711C11.6262 4.37377 11.7929 4.20711 12 4.20711C12.2071 4.20711 12.3738 4.37377 12.7071 4.70711L17 9" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;