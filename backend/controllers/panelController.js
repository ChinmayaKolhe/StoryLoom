import * as panelService from '../services/panelService.js';

/**
 * @desc    Generate single panel
 * @route   POST /api/panel/generate
 * @access  Private
 */
export const generatePanel = async (req, res) => {
  try {
    const { storyId, pageNumber } = req.body;

    if (!storyId || !pageNumber) {
      return res.status(400).json({ message: 'Please provide storyId and pageNumber' });
    }

    const story = await panelService.generatePanel(storyId, parseInt(pageNumber));
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Generate all panels for a story
 * @route   POST /api/panel/generate-all
 * @access  Private
 */
export const generateAllPanels = async (req, res) => {
  try {
    const { storyId } = req.body;

    if (!storyId) {
      return res.status(400).json({ message: 'Please provide storyId' });
    }

    // Start generation in background
    panelService.generateAllPanels(storyId)
      .then(() => console.log(`All panels generated for story ${storyId}`))
      .catch(err => console.error(`Error generating panels: ${err.message}`));

    res.json({ 
      message: 'Panel generation started',
      storyId 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
