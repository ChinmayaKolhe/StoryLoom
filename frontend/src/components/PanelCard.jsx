import React from 'react';
import { FaImage, FaSpinner } from 'react-icons/fa';

const PanelCard = ({ page, storyStyle }) => {
  const hasImage = page.panelImageUrl && page.panelImageUrl.trim() !== '';
  const isGenerating = page.panelGenerationStatus === 'generating';
  const isFailed = page.panelGenerationStatus === 'failed';

  return (
    <div className="card overflow-hidden">
      {/* Page Number Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
          Page {page.pageNumber}
        </div>
      </div>

      {/* Panel Image or Placeholder */}
      <div className="relative w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
        {hasImage ? (
          <img
            src={`http://localhost:5000${page.panelImageUrl}`}
            alt={`Panel ${page.pageNumber}`}
            className="w-full h-full object-cover comic-panel"
          />
        ) : isGenerating ? (
          <div className="flex flex-col items-center gap-4">
            <FaSpinner className="text-6xl text-purple-600 animate-spin" />
            <p className="text-gray-600 font-medium">Generating illustration...</p>
          </div>
        ) : isFailed ? (
          <div className="flex flex-col items-center gap-4 text-red-500">
            <FaImage className="text-6xl" />
            <p className="font-medium">Generation failed</p>
            <button className="btn-primary text-sm">Retry</button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-gray-400">
            <FaImage className="text-6xl" />
            <p className="font-medium">Panel not generated yet</p>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Scene Description */}
        {page.sceneDescription && (
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
            <p className="text-sm text-gray-500 font-semibold mb-1">Scene</p>
            <p className="text-gray-700">{page.sceneDescription}</p>
          </div>
        )}

        {/* Dialogue */}
        {page.dialogue && (
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-blue-600 font-semibold mb-1">💬 Dialogue</p>
            <p className="text-gray-800 italic">"{page.dialogue}"</p>
          </div>
        )}

        {/* Narration */}
        {page.narration && (
          <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
            <p className="text-sm text-amber-600 font-semibold mb-1">📖 Narration</p>
            <p className="text-gray-700">{page.narration}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelCard;
