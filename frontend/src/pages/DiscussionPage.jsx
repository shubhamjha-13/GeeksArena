// src/pages/DiscussionPage.jsx
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
import DiscussionComponent from "../components/DiscussionComponent";

const DiscussionPage = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Set page title
    document.title = "Community Discussions | YourApp";
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900">
      <Navbar />

      <main className="flex-grow py-8">
        <div className="container mx-auto mt-12 px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Community Discussions
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Ask questions, share knowledge, and connect with other developers
            </p>
          </div>

          <DiscussionComponent />
        </div>
      </main>
    </div>
  );
};

export default DiscussionPage;
