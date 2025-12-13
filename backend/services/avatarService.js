import OpenAI from 'openai';
import Avatar from '../models/Avatar.js';
import { saveToLocal, ensureUploadsDir } from '../utils/cloudinary.js';
import { buildAvatarPrompt } from '../utils/promptBuilder.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Download image from URL to local storage
 */
const downloadImage = async (url, filename) => {
  const { avatarsDir } = ensureUploadsDir();
  const filepath = path.join(avatarsDir, filename);
  
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFileSync(filepath, response.data);
  
  return `/uploads/avatars/${filename}`;
};

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

    // For now, we'll use DALL-E to generate avatar
    const prompt = buildAvatarPrompt(characterName, style);
    
    let generatedImageUrl = originalImageUrl; // Fallback to original

    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard"
      });

      // Download DALL-E image to local storage
      const dalleUrl = response.data[0].url;
      generatedImageUrl = await downloadImage(dalleUrl, `avatar-${Date.now()}.png`);
    } catch (aiError) {
      console.error('AI avatar generation failed, using original:', aiError.message);
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
    console.error('Avatar generation error:', error);
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
