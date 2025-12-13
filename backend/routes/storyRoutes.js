import express from 'express';
import {
  generateStory,
  getStory,
  getUserStories,
  updateStoryStatus,
  deleteStory
} from '../controllers/storyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', protect, generateStory);
router.get('/', protect, getUserStories);
router.get('/:id', protect, getStory);
router.put('/:id/status', protect, updateStoryStatus);
router.delete('/:id', protect, deleteStory);

export default router;
