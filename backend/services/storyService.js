import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import { buildStoryPrompt, buildTitlePrompt } from '../utils/promptBuilder.js';
import Story from '../models/Story.js';

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Gemini
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Initialize Groq (FREE!)
let groq = null;
if (process.env.GROQ_API_KEY) {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });
}

/**
 * Generate story using selected AI provider
 */
const generateWithAI = async (prompt, maxTokens = 2000) => {
  const provider = process.env.AI_PROVIDER || 'groq';
  
  if (provider === 'groq' && groq) {
    try {
      // Use Groq (FREE and FAST!)
      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: maxTokens
      });
      return response.choices[0].message.content;
    } catch (groqError) {
      console.error('Groq error:', groqError.message);
      throw new Error('Groq API error. Please check your API key at https://console.groq.com/');
    }
  } else if (provider === 'gemini' && genAI) {
    try {
      // Use Google Gemini
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash-latest'
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (geminiError) {
      console.error('Gemini error:', geminiError.message);
      throw new Error('Gemini API error. Please check your API key at https://aistudio.google.com/app/apikey');
    }
  } else {
    // Use OpenAI (default)
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: maxTokens
    });
    return response.choices[0].message.content;
  }
};

/**
 * Generate story structure from user input using AI
 * @param {string} userId - User ID
 * @param {string} userInput - User's memory/story description
 * @param {string} theme - Story theme
 * @param {string} visualStyle - Visual style
 * @returns {Promise<Object>} - Created story object
 */
export const generateStory = async (userId, userInput, theme, visualStyle) => {
  try {
    // Generate title
    const titlePrompt = buildTitlePrompt(userInput);
    const titleText = await generateWithAI(titlePrompt, 20);
    const title = titleText.trim().replace(/['"]/g, '');

    // Generate story structure
    const storyPrompt = buildStoryPrompt(userInput, theme, visualStyle);
    const storyContent = await generateWithAI(storyPrompt, 2000);
    
    // Parse JSON response
    let pages;
    try {
      // Extract JSON from markdown code blocks if present
      let jsonText = storyContent;
      
      // Remove markdown code blocks
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Find JSON array
      const arrayMatch = jsonText.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        jsonText = arrayMatch[0];
      }
      
      // Clean up common JSON issues
      jsonText = jsonText
        .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas
        .replace(/\n/g, ' ')             // Remove newlines
        .replace(/\r/g, '')              // Remove carriage returns
        .replace(/\t/g, ' ')             // Replace tabs with spaces
        .replace(/  +/g, ' ');           // Replace multiple spaces with single space
      
      pages = JSON.parse(jsonText);
      
      // Validate pages array
      if (!Array.isArray(pages) || pages.length === 0) {
        throw new Error('Invalid pages array');
      }
      
    } catch (parseError) {
      console.error('Failed to parse story JSON:', parseError);
      console.log('Raw AI response:', storyContent);
      
      // Fallback: create a simple story structure from user input
      pages = [
        {
          pageNumber: 1,
          sceneDescription: userInput,
          dialogue: '',
          narration: userInput
        }
      ];
    }

    // Create story in database
    const story = await Story.create({
      userId,
      title,
      userInput,
      theme,
      visualStyle,
      pages,
      status: 'draft'
    });

    return story;
  } catch (error) {
    console.error('Story generation error:', error);
    throw new Error('Failed to generate story: ' + error.message);
  }
};

/**
 * Get story by ID
 */
export const getStoryById = async (storyId, userId) => {
  const story = await Story.findOne({ _id: storyId, userId }).populate('avatars');
  if (!story) {
    throw new Error('Story not found');
  }
  return story;
};

/**
 * Get all stories for a user
 */
export const getUserStories = async (userId) => {
  const stories = await Story.find({ userId }).sort({ createdAt: -1 });
  return stories;
};

/**
 * Update story status
 */
export const updateStoryStatus = async (storyId, status) => {
  const story = await Story.findByIdAndUpdate(
    storyId,
    { status },
    { new: true }
  );
  return story;
};

/**
 * Delete story
 */
export const deleteStory = async (storyId, userId) => {
  const story = await Story.findOneAndDelete({ _id: storyId, userId });
  if (!story) {
    throw new Error('Story not found');
  }
  return story;
};
