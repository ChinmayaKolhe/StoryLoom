import Story from '../models/Story.js';
import { generateImage } from './imageService.js';
import { buildPanelPrompt } from '../utils/promptBuilder.js';

/**
 * Generate comic panel image for a story page
 * @param {string} storyId - Story ID
 * @param {number} pageNumber - Page number
 * @returns {Promise<Object>} - Updated story with panel image
 */
export const generatePanel = async (storyId, pageNumber) => {
  try {
    const story = await Story.findById(storyId).populate('avatars');
    if (!story) {
      throw new Error('Story not found');
    }

    const page = story.pages.find(p => p.pageNumber === pageNumber);
    if (!page) {
      throw new Error('Page not found');
    }

    // Build prompt with original user input for character consistency
    const prompt = buildPanelPrompt(page.sceneDescription, story.visualStyle, story.userInput);

    // Generate comic panel
    console.log(`Generating panel ${pageNumber} for story ${storyId}...`);
    const imageUrl = await generateImage(prompt, story.visualStyle);

    // Update page with image URL
    page.panelImageUrl = imageUrl;
    page.panelGenerationStatus = 'completed';
    await story.save();

    console.log(`Panel ${pageNumber} generated successfully!`);
    return story;
  } catch (error) {
    console.error('Panel generation error:', error);
    
    // Update status to failed
    const story = await Story.findById(storyId);
    if (story) {
      const page = story.pages.find(p => p.pageNumber === pageNumber);
      if (page) {
        page.panelGenerationStatus = 'failed';
        await story.save();
      }
    }
    
    throw new Error('Failed to generate panel: ' + error.message);
  }
};

/**
 * Generate all panels for a story (async batch processing)
 * @param {string} storyId - Story ID
 * @returns {Promise<Object>} - Story with generation started
 */
export const generateAllPanels = async (storyId) => {
  try {
    const story = await Story.findById(storyId);
    if (!story) {
      throw new Error('Story not found');
    }

    // Update status to generating
    story.status = 'generating';
    
    // Mark all pages as pending
    story.pages.forEach(page => {
      if (!page.panelImageUrl) {
        page.panelGenerationStatus = 'pending';
      }
    });
    
    await story.save();

    // Generate panels sequentially (to avoid rate limits)
    for (let i = 0; i < story.pages.length; i++) {
      const page = story.pages[i];
      if (!page.panelImageUrl) {
        try {
          page.panelGenerationStatus = 'generating';
          await story.save();
          
          await generatePanel(storyId, page.pageNumber);
          
          // Small delay between generations to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`Failed to generate panel ${page.pageNumber}:`, error);
          page.panelGenerationStatus = 'failed';
          await story.save();
        }
      }
    }

    // Update story status to completed
    const updatedStory = await Story.findById(storyId);
    const allGenerated = updatedStory.pages.every(p => p.panelImageUrl);
    updatedStory.status = allGenerated ? 'completed' : 'draft';
    await updatedStory.save();

    return updatedStory;
  } catch (error) {
    console.error('Batch panel generation error:', error);
    throw new Error('Failed to generate panels: ' + error.message);
  }
};

/**
 * Get panel generation status for a story
 */
export const getPanelStatus = async (storyId) => {
  const story = await Story.findById(storyId);
  if (!story) {
    throw new Error('Story not found');
  }

  const total = story.pages.length;
  const completed = story.pages.filter(p => p.panelImageUrl).length;
  const generating = story.pages.filter(p => p.panelGenerationStatus === 'generating').length;
  const failed = story.pages.filter(p => p.panelGenerationStatus === 'failed').length;

  return {
    total,
    completed,
    generating,
    failed,
    pending: total - completed - generating - failed,
    progress: Math.round((completed / total) * 100)
  };
};
