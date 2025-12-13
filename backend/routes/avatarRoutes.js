import express from 'express';
import {
  generateAvatar,
  getAvatar,
  getUserAvatars,
  deleteAvatar
} from '../controllers/avatarController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/generate', protect, upload.single('photo'), generateAvatar);
router.get('/', protect, getUserAvatars);
router.get('/:id', protect, getAvatar);
router.delete('/:id', protect, deleteAvatar);

export default router;
