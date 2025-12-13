import * as bookService from '../services/bookService.js';

/**
 * @desc    Build storybook PDF
 * @route   POST /api/book/build
 * @access  Private
 */
export const buildStorybook = async (req, res) => {
  try {
    const { storyId } = req.body;

    if (!storyId) {
      return res.status(400).json({ message: 'Please provide storyId' });
    }

    const story = await bookService.buildStorybook(storyId);
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get storybook preview
 * @route   GET /api/book/preview/:storyId
 * @access  Private
 */
export const getStorybookPreview = async (req, res) => {
  try {
    const preview = await bookService.getStorybookPreview(req.params.storyId);
    res.json(preview);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
