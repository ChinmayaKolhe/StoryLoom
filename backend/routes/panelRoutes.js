import express from 'express';
import { protect } from '../middleware/auth.js';
import { generatePanel, generateAllPanels, getPanelStatus } from '../services/panelService.js';

const router = express.Router();

// Generate single panel
router.post('/generate', protect, async (req, res, next) => {
  try {
    const { storyId, pageNumber } = req.body;
    
    if (!storyId || !pageNumber) {
      return res.status(400).json({ message: 'Story ID and page number are required' });
    }

    const story = await generatePanel(storyId, pageNumber);
    res.status(200).json(story);
  } catch (error) {
    next(error);
  }
});

// Generate all panels for a story
router.post('/generate-all', protect, async (req, res, next) => {
  try {
    const { storyId } = req.body;
    
    if (!storyId) {
      return res.status(400).json({ message: 'Story ID is required' });
    }

    // Start generation process (async)
    generateAllPanels(storyId).catch(error => {
      console.error('Background panel generation error:', error);
    });

    res.status(200).json({ 
      message: 'Panel generation started',
      storyId 
    });
  } catch (error) {
    next(error);
  }
});

// Get panel generation status
router.get('/status/:storyId', protect, async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const status = await getPanelStatus(storyId);
    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
});

export default router;
