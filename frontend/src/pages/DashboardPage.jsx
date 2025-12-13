import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStoryStore } from '../store/storyStore';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiPlus, FiBook, FiTrash2 } from 'react-icons/fi';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { stories, loading, fetchStories, deleteStory } = useStoryStore();

  useEffect(() => {
    fetchStories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      await deleteStory(id);
    }
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold mb-2">
          Welcome back, <span className="gradient-text">{user?.name}</span>!
        </h1>
        <p className="text-gray-600 text-lg">
          Continue creating amazing storybooks from your memories
        </p>
      </div>

      <div className="mb-8">
        <Link to="/create" className="btn-primary inline-flex items-center gap-2">
          <FiPlus className="w-5 h-5" />
          Create New Story
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" text="Loading your stories..." />
        </div>
      ) : stories.length === 0 ? (
        <div className="card-glass text-center py-16">
          <FiBook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No stories yet</h2>
          <p className="text-gray-500 mb-6">
            Start creating your first storybook from your memories
          </p>
          <Link to="/create" className="btn-primary inline-flex items-center gap-2">
            <FiPlus className="w-5 h-5" />
            Create Your First Story
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div key={story._id} className="card group">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-800 flex-1">
                  {story.title}
                </h3>
                <button
                  onClick={() => handleDelete(story._id)}
                  className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex gap-2 mb-3">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium capitalize">
                  {story.theme}
                </span>
                <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium capitalize">
                  {story.visualStyle}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {story.userInput}
              </p>

              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  story.status === 'completed' ? 'text-green-600' :
                  story.status === 'generating' ? 'text-yellow-600' :
                  story.status === 'failed' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
                </span>
                <Link
                  to={`/story/${story._id}`}
                  className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
