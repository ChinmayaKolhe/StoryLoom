import * as avatarService from '../services/avatarService.js';

/**
 * @desc    Generate avatar from photo
 * @route   POST /api/avatar/generate
 * @access  Private
 */
export const generateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const { style, characterName } = req.body;

    const avatar = await avatarService.generateAvatar(
      req.user._id,
      req.file.path,
      style || 'cartoon',
      characterName || 'Character'
    );

    res.status(201).json(avatar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get avatar by ID
 * @route   GET /api/avatar/:id
 * @access  Private
 */
export const getAvatar = async (req, res) => {
  try {
    const avatar = await avatarService.getAvatarById(req.params.id, req.user._id);
    res.json(avatar);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * @desc    Get all user avatars
 * @route   GET /api/avatar
 * @access  Private
 */
export const getUserAvatars = async (req, res) => {
  try {
    const avatars = await avatarService.getUserAvatars(req.user._id);
    res.json(avatars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete avatar
 * @route   DELETE /api/avatar/:id
 * @access  Private
 */
export const deleteAvatar = async (req, res) => {
  try {
    await avatarService.deleteAvatar(req.params.id, req.user._id);
    res.json({ message: 'Avatar deleted successfully' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
