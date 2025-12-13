import * as storyService from '../services/storyService.js';

/**
 * @desc    Generate new story
 * @route   POST /api/story/generate
 * @access  Private
 */
export const generateStory = async (req, res) => {
  try {
    const { userInput, theme, visualStyle } = req.body;

    if (!userInput) {
      return res.status(400).json({ message: 'Please provide story input' });
    }

    const story = await storyService.generateStory(
      req.user._id,
      userInput,
      theme || 'adventure',
      visualStyle || 'cartoon'
    );

    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get story by ID
 * @route   GET /api/story/:id
 * @access  Private
 */
export const getStory = async (req, res) => {
  try {
    const story = await storyService.getStoryById(req.params.id, req.user._id);
    res.json(story);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * @desc    Get all user stories
 * @route   GET /api/story
 * @access  Private
 */
export const getUserStories = async (req, res) => {
  try {
    const stories = await storyService.getUserStories(req.user._id);
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update story status
 * @route   PUT /api/story/:id/status
 * @access  Private
 */
export const updateStoryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const story = await storyService.updateStoryStatus(req.params.id, status);
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete story
 * @route   DELETE /api/story/:id
 * @access  Private
 */
export const deleteStory = async (req, res) => {
  try {
    await storyService.deleteStory(req.params.id, req.user._id);
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
