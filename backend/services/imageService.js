import { GoogleGenAI } from '@google/genai';
import { HfInference } from '@huggingface/inference';
import OpenAI from 'openai';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { ensureUploadsDir } from '../utils/cloudinary.js';

// Initialize Gemini (Primary)
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// Initialize HuggingFace (Fallback)
const hf = process.env.HUGGINGFACE_API_KEY 
  ? new HfInference(process.env.HUGGINGFACE_API_KEY)
  : null;

// Initialize OpenAI (Fallback)
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * Build comic-style image prompt optimized for Gemini
 */
const buildComicPrompt = (sceneDescription, visualStyle, characterDescriptions = []) => {
  const styleMap = {
    cartoon: 'vibrant cartoon illustration style, bold outlines, bright saturated colors, clean shapes, Disney/Pixar quality',
    anime: 'anime manga art style, expressive characters, dynamic composition, cel-shaded, vibrant colors',
    comic: 'professional comic book art style, dramatic shading, bold ink lines, vivid colors, halftone dots',
    realistic: 'photorealistic digital art, detailed textures, natural cinematic lighting, hyper-detailed',
    watercolor: 'beautiful watercolor painting style, soft blended colors, artistic wet-on-wet brushstrokes, dreamy atmosphere',
    sketch: 'detailed pencil sketch style, hand-drawn crosshatch shading, artistic graphite textures'
  };

  const stylePrompt = styleMap[visualStyle] || styleMap.cartoon;
  const characterPrompt = characterDescriptions.length > 0 
    ? `Characters present: ${characterDescriptions.join(', ')}. ` 
    : '';

  return `Create a high-quality storybook illustration: ${characterPrompt}${sceneDescription}. 

Art style: ${stylePrompt}. 

Requirements: Professional storybook panel, detailed background environment, cinematic composition, expressive characters, vibrant color palette. No text, no speech bubbles, no watermarks.`;
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
 * Generate image using Gemini native image generation
 */
const generateWithGemini = async (prompt) => {
  if (!genAI) {
    throw new Error('Gemini API not configured');
  }

  console.log('🎨 Generating image with Gemini (gemini-2.5-flash-image)...');
  
  const response = await genAI.models.generateContent({
    model: 'gemini-2.5-flash-preview-image-generation',
    contents: prompt,
    config: {
      responseModalities: ['IMAGE', 'TEXT'],
    }
  });

  // Extract image data from response
  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts || parts.length === 0) {
    throw new Error('No image data in Gemini response');
  }

  // Find the image part
  const imagePart = parts.find(part => part.inlineData && part.inlineData.mimeType?.startsWith('image/'));
  if (!imagePart) {
    throw new Error('No image part found in Gemini response');
  }

  // Decode base64 image data
  const base64Data = imagePart.inlineData.data;
  const mimeType = imagePart.inlineData.mimeType || 'image/png';
  const extension = mimeType.includes('jpeg') || mimeType.includes('jpg') ? 'jpg' : 'png';
  const buffer = Buffer.from(base64Data, 'base64');

  // Save to local storage
  const filename = `panel-${Date.now()}.${extension}`;
  const { panelsDir } = ensureUploadsDir();
  const filepath = path.join(panelsDir, filename);
  fs.writeFileSync(filepath, buffer);

  console.log(`✅ Image generated successfully! (${(buffer.length / 1024).toFixed(1)} KB)`);
  return `/uploads/panels/${filename}`;
};

/**
 * Generate image using HuggingFace (fallback)
 */
const generateWithHuggingFace = async (prompt, style) => {
  if (!hf) throw new Error('HuggingFace API not configured');
  
  console.log('🎨 Generating image with HuggingFace...');
  
  const blob = await hf.textToImage({
    model: 'stabilityai/stable-diffusion-xl-base-1.0',
    inputs: prompt,
    parameters: {
      num_inference_steps: 25,
      guidance_scale: 7.5
    }
  });
  
  const buffer = Buffer.from(await blob.arrayBuffer());
  const filename = `panel-${Date.now()}.png`;
  const { panelsDir } = ensureUploadsDir();
  const filepath = path.join(panelsDir, filename);
  fs.writeFileSync(filepath, buffer);
  
  console.log('✅ Image generated with HuggingFace!');
  return `/uploads/panels/${filename}`;
};

/**
 * Generate image using selected provider
 */
export const generateImage = async (prompt, style = 'comic') => {
  const provider = process.env.IMAGE_PROVIDER || 'gemini';
  
  try {
    if (provider === 'gemini' && genAI) {
      try {
        return await generateWithGemini(prompt);
      } catch (geminiError) {
        console.error('❌ Gemini image generation failed:', geminiError.message);
        
        // Fallback to HuggingFace
        if (hf) {
          console.log('⚡ Falling back to HuggingFace...');
          return await generateWithHuggingFace(prompt, style);
        }
        throw geminiError;
      }
      
    } else if (provider === 'huggingface' && hf) {
      return await generateWithHuggingFace(prompt, style);
      
    } else if (provider === 'openai' && openai) {
      console.log('🎨 Generating image with DALL-E...');
      
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
      throw new Error('No image generation provider configured. Please set GEMINI_API_KEY in .env');
    }
  } catch (error) {
    console.error('❌ Image generation error:', error.message);
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
  const prompt = `Portrait of ${characterName}, ${style} style, character design sheet, consistent appearance, professional illustration, clean white background, full body view, expressive face, high quality`;
  return await generateImage(prompt, style);
};
