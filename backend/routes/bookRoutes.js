import express from 'express';
import {
  buildStorybook,
  getStorybookPreview
} from '../controllers/bookController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/build', protect, buildStorybook);
router.get('/preview/:storyId', protect, getStorybookPreview);

export default router;
