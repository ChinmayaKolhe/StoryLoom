import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStoryStore } from '../store/storyStore';
import LoadingSpinner from '../components/LoadingSpinner';
import PanelCard from '../components/PanelCard';
import { FiDownload, FiImage, FiBook } from 'react-icons/fi';

const StoryViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentStory, loading, fetchStory, generateAllPanels, buildStorybook } = useStoryStore();
  const [generatingPanels, setGeneratingPanels] = useState(false);
  const [buildingPDF, setBuildingPDF] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(null);

  useEffect(() => {
    if (id) {
      fetchStory(id);
    }
  }, [id]);

  // Poll for generation progress
  useEffect(() => {
    if (!generatingPanels) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/panel/status/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const progress = await response.json();
        setGenerationProgress(progress);

        // Refresh story to show new images
        fetchStory(id);

        // Stop polling when complete
        if (progress.completed === progress.total) {
          setGeneratingPanels(false);
          setGenerationProgress(null);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [generatingPanels, id]);

  const handleGeneratePanels = async () => {
    setGeneratingPanels(true);
    await generateAllPanels(id);
  };

  const handleBuildPDF = async () => {
    setBuildingPDF(true);
    const updatedStory = await buildStorybook(id);
    setBuildingPDF(false);
    
    if (updatedStory?.pdfUrl) {
      window.open(updatedStory.pdfUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="page-container flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading your story..." />
      </div>
    );
  }

  if (!currentStory) {
    return (
      <div className="page-container text-center py-20">
        <p className="text-gray-600 text-lg">Story not found</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const hasPanels = currentStory.pages.some(p => p.panelImageUrl);
  const allPanelsGenerated = currentStory.pages.every(p => p.panelImageUrl);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-primary-600 hover:text-primary-700 font-medium mb-4"
        >
          ← Back to Dashboard
        </button>
        
        <h1 className="text-4xl font-display font-bold mb-2">
          {currentStory.title}
        </h1>
        
        <div className="flex gap-2 mb-4">
          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium capitalize">
            {currentStory.theme}
          </span>
          <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium capitalize">
            {currentStory.visualStyle}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentStory.status === 'completed' ? 'bg-green-100 text-green-700' :
            currentStory.status === 'generating' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {currentStory.status}
          </span>
        </div>

        <p className="text-gray-600 mb-6">
          {currentStory.userInput}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {!hasPanels && (
            <button
              onClick={handleGeneratePanels}
              disabled={generatingPanels}
              className="btn-primary inline-flex items-center gap-2"
            >
              {generatingPanels ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <FiImage className="w-5 h-5" />
                  Generate Illustrations
                </>
              )}
            </button>
          )}

          {allPanelsGenerated && !currentStory.pdfUrl && (
            <button
              onClick={handleBuildPDF}
              disabled={buildingPDF}
              className="btn-primary inline-flex items-center gap-2"
            >
              {buildingPDF ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <FiBook className="w-5 h-5" />
                  Build Storybook PDF
                </>
              )}
            </button>
          )}

          {currentStory.pdfUrl && (
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = `http://localhost:5000${currentStory.pdfUrl}`;
                link.download = `${currentStory.title}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="btn-primary inline-flex items-center gap-2"
            >
              <FiDownload className="w-5 h-5" />
              Download PDF
            </button>
          )}
        </div>
      </div>

      {/* Story Pages */}
      <div className="space-y-6">
        <h2 className="text-2xl font-display font-bold">Story Pages</h2>
        {currentStory.pages.map((page, index) => (
          <PanelCard key={index} page={page} index={index} />
        ))}
      </div>
    </div>
  );
};

export default StoryViewPage;
