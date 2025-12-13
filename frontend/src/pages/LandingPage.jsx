import React from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiImage, FiDownload, FiZap, FiStar, FiHeart } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="page-container py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-display font-bold mb-6 animate-fade-in">
            Transform Your <span className="gradient-text">Memories</span>
            <br />
            Into Beautiful Storybooks
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Turn your real-life experiences into illustrated storybooks using AI.
            Upload photos, describe your memory, and watch as AI creates a magical storybook.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-4">
              Start Creating
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="page-container py-16">
        <h2 className="text-4xl font-display font-bold text-center mb-12">
          How It <span className="gradient-text">Works</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBook className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Share Your Story</h3>
            <p className="text-gray-600">
              Describe your memory or experience in your own words. Be as detailed as you like!
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiImage className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Upload Photos</h3>
            <p className="text-gray-600">
              Add photos to create personalized avatars and make your story truly unique.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiZap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Magic</h3>
            <p className="text-gray-600">
              Our AI generates beautiful illustrations and layouts your story into a professional storybook.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="page-container py-16">
        <div className="card-glass max-w-4xl mx-auto p-12">
          <h2 className="text-4xl font-display font-bold text-center mb-12">
            Why Choose <span className="gradient-text">Storyloom AI</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <FiStar className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Professional Quality</h3>
                <p className="text-gray-600">
                  AI-powered illustrations that look hand-crafted and professional.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <FiDownload className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Downloadable PDFs</h3>
                <p className="text-gray-600">
                  Get your storybook as a high-quality PDF ready to print or share.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <FiHeart className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Preserve Memories</h3>
                <p className="text-gray-600">
                  Turn fleeting moments into lasting keepsakes for you and your loved ones.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <FiZap className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Fast & Easy</h3>
                <p className="text-gray-600">
                  Create a complete storybook in minutes, not hours or days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="page-container py-20">
        <div className="text-center">
          <h2 className="text-4xl font-display font-bold mb-6">
            Ready to Create Your <span className="gradient-text">Story</span>?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users preserving their memories with AI
          </p>
          <Link to="/register" className="btn-primary text-lg px-8 py-4">
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
