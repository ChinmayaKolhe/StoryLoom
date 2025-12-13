import { HfInference } from '@huggingface/inference';
import OpenAI from 'openai';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { ensureUploadsDir } from '../utils/cloudinary.js';

// Initialize AI clients
const hf = process.env.HUGGINGFACE_API_KEY 
  ? new HfInference(process.env.HUGGINGFACE_API_KEY)
  : null;

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * Build comic-style image prompt
 */
const buildComicPrompt = (sceneDescription, visualStyle, characterDescriptions = []) => {
  const styleMap = {
    cartoon: 'vibrant cartoon style, bold outlines, bright colors',
    anime: 'anime manga style, expressive characters, dynamic composition',
    comic: 'comic book style, dramatic shading, action lines, halftone dots',
    realistic: 'photorealistic style, detailed textures, natural lighting',
    watercolor: 'watercolor painting style, soft colors, artistic brushstrokes',
    sketch: 'pencil sketch style, hand-drawn lines, artistic shading'
  };

  const stylePrompt = styleMap[visualStyle] || styleMap.comic;
  const characterPrompt = characterDescriptions.length > 0 
    ? `Characters: ${characterDescriptions.join(', ')}. ` 
    : '';

  return `${characterPrompt}${sceneDescription}. ${stylePrompt}. Comic panel illustration, professional quality, detailed background, cinematic composition.`;
};

/**
 * Download image from URL to local storage
 */
const downloadImage = async (url, folder, filename) => {
  const { uploadsDir } = ensureUploadsDir();
  const destFolder = path.join(uploadsDir, folder);
  
  if (!fs.existsSync(destFolder)) {
    fs.mkdirSync(destFolder, { recursive: true });
  }
  
  const filepath = path.join(destFolder, filename);
  
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFileSync(filepath, response.data);
  
  return `/uploads/${folder}/${filename}`;
};

/**
 * Generate image using selected provider
 */
export const generateImage = async (prompt, style = 'comic') => {
  const provider = process.env.IMAGE_PROVIDER || 'huggingface';
  
  try {
    if (provider === 'huggingface' && hf) {
      console.log('Generating image with Hugging Face...');
      
      // Select model based on style
      let modelToUse = 'stabilityai/stable-diffusion-xl-base-1.0'; // Default
      
      if (style === 'comic' || style === 'cartoon') {
        modelToUse = 'RealCartoonXL'; // Perfect for comics!
      } else if (style === 'anime') {
        modelToUse = 'Juggernaut XL'; // Better artistic style
      }
      
      console.log(`Using model: ${modelToUse}`);
      
      try {
        const blob = await hf.textToImage({
          model: modelToUse,
          inputs: prompt,
          parameters: {
            num_inference_steps: 25,
            guidance_scale: 7.5
          }
        });
        
        // Convert blob to buffer
        const buffer = Buffer.from(await blob.arrayBuffer());
        
        // Save to local storage
        const filename = `panel-${Date.now()}.png`;
        const { panelsDir } = ensureUploadsDir();
        const filepath = path.join(panelsDir, filename);
        fs.writeFileSync(filepath, buffer);
        
        console.log(`✅ Image generated successfully with ${modelToUse}!`);
        return `/uploads/panels/${filename}`;
        
      } catch (primaryError) {
        console.log(`${modelToUse} failed, trying SDXL base...`);
        
        // Fallback to SDXL base
        const blob = await hf.textToImage({
          model: 'stabilityai/stable-diffusion-xl-base-1.0',
          inputs: prompt,
          parameters: {
            num_inference_steps: 20
          }
        });
        
        const buffer = Buffer.from(await blob.arrayBuffer());
        const filename = `panel-${Date.now()}.png`;
        const { panelsDir } = ensureUploadsDir();
        const filepath = path.join(panelsDir, filename);
        fs.writeFileSync(filepath, buffer);
        
        console.log('✅ Image generated with SDXL base!');
        return `/uploads/panels/${filename}`;
      }
      
    } else if (provider === 'openai' && openai) {
      console.log('Generating image with DALL-E...');
      
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1792x1024',
        quality: 'standard'
      });
      
      const dalleUrl = response.data[0].url;
      const filename = `panel-${Date.now()}.png`;
      return await downloadImage(dalleUrl, 'panels', filename);
      
    } else {
      throw new Error('No image generation provider configured. Please set HUGGINGFACE_API_KEY or OPENAI_API_KEY');
    }
  } catch (error) {
    console.error('Image generation error:', error);
    throw new Error('Failed to generate image: ' + error.message);
  }
};

/**
 * Generate comic panel with character consistency
 */
export const generateComicPanel = async (sceneDescription, visualStyle, characterDescriptions = []) => {
  const prompt = buildComicPrompt(sceneDescription, visualStyle, characterDescriptions);
  return await generateImage(prompt, visualStyle);
};

/**
 * Generate avatar image
 */
export const generateAvatarImage = async (characterName, style = 'cartoon') => {
  const prompt = `Portrait of ${characterName}, ${style} style, character design, consistent appearance, professional illustration, white background`;
  return await generateImage(prompt, style);
};
