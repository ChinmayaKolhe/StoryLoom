import Avatar from '../models/Avatar.js';
import { saveToLocal, ensureUploadsDir } from '../utils/cloudinary.js';
import { buildAvatarPrompt } from '../utils/promptBuilder.js';
import { generateAvatarImage } from './imageService.js';
import fs from 'fs';
import path from 'path';

/**
 * Generate avatar from uploaded photo using AI
 * @param {string} userId - User ID
 * @param {string} filePath - Path to uploaded image
 * @param {string} style - Avatar style
 * @param {string} characterName - Character name
 * @returns {Promise<Object>} - Created avatar object
 */
export const generateAvatar = async (userId, filePath, style = 'cartoon', characterName = 'Character') => {
  try {
    ensureUploadsDir();
    
    // Save original image to local storage
    const originalImageUrl = saveToLocal(filePath, 'avatars', `original-${Date.now()}-${path.basename(filePath)}`);
    
    // Delete temporary upload file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Generate avatar using the configured image provider (Gemini/HuggingFace/OpenAI)
    let generatedImageUrl = originalImageUrl; // Fallback to original

    try {
      console.log(`🎭 Generating avatar for "${characterName}" in ${style} style...`);
      generatedImageUrl = await generateAvatarImage(characterName, style);
      console.log(`✅ Avatar generated successfully!`);
    } catch (aiError) {
      console.error('⚠️ AI avatar generation failed, using original:', aiError.message);
    }

    // Create avatar in database
    const avatar = await Avatar.create({
      userId,
      originalImageUrl,
      generatedImageUrl,
      style,
      characterName
    });

    return avatar;
  } catch (error) {
    console.error('❌ Avatar generation error:', error);
    throw new Error('Failed to generate avatar: ' + error.message);
  }
};

/**
 * Get avatar by ID
 */
export const getAvatarById = async (avatarId, userId) => {
  const avatar = await Avatar.findOne({ _id: avatarId, userId });
  if (!avatar) {
    throw new Error('Avatar not found');
  }
  return avatar;
};

/**
 * Get all avatars for a user
 */
export const getUserAvatars = async (userId) => {
  const avatars = await Avatar.find({ userId }).sort({ createdAt: -1 });
  return avatars;
};

/**
 * Delete avatar
 */
export const deleteAvatar = async (avatarId, userId) => {
  const avatar = await Avatar.findOneAndDelete({ _id: avatarId, userId });
  if (!avatar) {
    throw new Error('Avatar not found');
  }
  return avatar;
};
