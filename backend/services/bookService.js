import path from 'path';
import Story from '../models/Story.js';
import { generateStoryPDF, ensureUploadsDir } from '../utils/pdfGenerator.js';

/**
 * Build complete storybook PDF
 * @param {string} storyId - Story ID
 * @returns {Promise<Object>} - Updated story with PDF URL
 */
export const buildStorybook = async (storyId) => {
  try {
    const story = await Story.findById(storyId).populate('avatars');
    if (!story) {
      throw new Error('Story not found');
    }

    // Ensure all panels are generated
    const missingPanels = story.pages.filter(p => !p.panelImageUrl);
    if (missingPanels.length > 0) {
      throw new Error('Not all panels have been generated. Please generate panels first.');
    }

    // Ensure PDF directory exists
    const pdfsDir = ensureUploadsDir();
    const pdfFileName = `storybook-${storyId}-${Date.now()}.pdf`;
    const pdfPath = path.join(pdfsDir, pdfFileName);

    // Generate PDF
    await generateStoryPDF(story, pdfPath);

    // Save PDF URL as local path
    const pdfUrl = `/uploads/pdfs/${pdfFileName}`;

    // Update story with PDF URL
    story.pdfUrl = pdfUrl;
    story.status = 'completed';
    await story.save();

    return story;
  } catch (error) {
    console.error('Storybook building error:', error);
    throw new Error('Failed to build storybook: ' + error.message);
  }
};

/**
 * Get storybook preview data
 * @param {string} storyId - Story ID
 * @returns {Promise<Object>} - Story preview data
 */
export const getStorybookPreview = async (storyId) => {
  try {
    const story = await Story.findById(storyId).populate('avatars');
    if (!story) {
      throw new Error('Story not found');
    }

    return {
      title: story.title,
      theme: story.theme,
      visualStyle: story.visualStyle,
      pages: story.pages,
      avatars: story.avatars,
      status: story.status,
      pdfUrl: story.pdfUrl
    };
  } catch (error) {
    console.error('Preview error:', error);
    throw new Error('Failed to get storybook preview: ' + error.message);
  }
};
