import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { buildStoryPrompt, buildTitlePrompt } from '../utils/promptBuilder.js';
import Story from '../models/Story.js';

// Initialize Gemini (Primary)
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// Initialize Groq (Fallback)
let groq = null;
if (process.env.GROQ_API_KEY) {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });
}

// Initialize OpenAI (Fallback)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

/**
 * Generate story using selected AI provider
 */
const generateWithAI = async (prompt, maxTokens = 2000, isJson = false) => {
  const provider = process.env.AI_PROVIDER || 'gemini';
  
  if (provider === 'gemini' && genAI) {
    try {
      console.log(`🤖 Generating with Gemini (gemini-2.5-flash) [JSON: ${isJson}]...`);
      
      const config = {
        temperature: 0.7,
        maxOutputTokens: maxTokens,
      };
      
      if (isJson) {
        config.responseMimeType = "application/json";
      }

      const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: config
      });
      
      // Extract text from response
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('Empty response from Gemini');
      }
      return text;
    } catch (geminiError) {
      console.error('❌ Gemini error:', geminiError.message);
      
      // Fallback to Groq if available
      if (groq) {
        console.log('⚡ Falling back to Groq...');
        return await generateWithGroq(prompt, maxTokens, isJson);
      }
      throw new Error('Gemini API error: ' + geminiError.message);
    }
  } else if (provider === 'groq' && groq) {
    return await generateWithGroq(prompt, maxTokens, isJson);
  } else if (openai) {
    return await generateWithOpenAI(prompt, maxTokens, isJson);
  } else {
    throw new Error('No AI provider configured. Please set GEMINI_API_KEY in .env');
  }
};

/**
 * Generate with Groq (fallback)
 */
const generateWithGroq = async (prompt, maxTokens, isJson = false) => {
  try {
    const config = {
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: maxTokens
    };
    if (isJson) {
      config.response_format = { type: 'json_object' };
    }
    const response = await groq.chat.completions.create(config);
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Groq error:', error.message);
    throw new Error('Groq API error: ' + error.message);
  }
};

/**
 * Generate with OpenAI (fallback)
 */
const generateWithOpenAI = async (prompt, maxTokens, isJson = false) => {
  try {
    const config = {
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: maxTokens
    };
    if (isJson) {
      config.response_format = { type: 'json_object' };
    }
    const response = await openai.chat.completions.create(config);
    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI error:', error.message);
    throw new Error('OpenAI API error: ' + error.message);
  }
};

/**
 * Robust JSON extraction from AI response
 */
const extractJSON = (text) => {
  // Try 1: Direct parse
  try {
    return JSON.parse(text);
  } catch (e) { /* continue */ }
  
  // Try 2: Extract from markdown code blocks
  let jsonText = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
  
  // Try 3: Find JSON array pattern
  const arrayMatch = jsonText.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    jsonText = arrayMatch[0];
  }
  
  // Clean common JSON issues
  jsonText = jsonText
    .replace(/,(\s*[}\]])/g, '$1')   // Remove trailing commas
    .replace(/\n/g, ' ')              // Remove newlines
    .replace(/\r/g, '')               // Remove carriage returns
    .replace(/\t/g, ' ')              // Replace tabs
    .replace(/  +/g, ' ')             // Collapse multiple spaces
    .replace(/\\'/g, "'")             // Fix escaped single quotes
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim();
  
  // Try 4: Parse cleaned JSON
  try {
    return JSON.parse(jsonText);
  } catch (e) {
    // Try 5: More aggressive extraction — find first { and last } (for object) or [ and ] (for array)
    const firstBrace = jsonText.indexOf('{');
    const lastBrace = jsonText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(jsonText.substring(firstBrace, lastBrace + 1));
      } catch (e2) { /* continue */ }
    }
    
    const firstBracket = jsonText.indexOf('[');
    const lastBracket = jsonText.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      try {
        return JSON.parse(jsonText.substring(firstBracket, lastBracket + 1));
      } catch (e2) { /* give up */ }
    }
  }
  
  throw new Error('Failed to extract valid JSON from AI response');
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
    console.log('📖 Starting story generation...');
    console.log(`   Theme: ${theme}, Style: ${visualStyle}`);
    
    // Generate title
    const titlePrompt = buildTitlePrompt(userInput);
    const titleText = await generateWithAI(titlePrompt, 50, false);
    const title = titleText.trim().replace(/['"]/g, '').substring(0, 60);
    console.log(`   📌 Title: ${title}`);

    // Generate story structure
    const storyPrompt = buildStoryPrompt(userInput, theme, visualStyle);
    const storyContent = await generateWithAI(storyPrompt, 3000, true);
    
    // Parse JSON response with robust extraction
    let pages;
    try {
      let parsed = extractJSON(storyContent);
      
      // If it's an object with a 'pages' array, extract it
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && Array.isArray(parsed.pages)) {
        pages = parsed.pages;
      } else {
        pages = parsed;
      }
      
      // Validate pages array
      if (!Array.isArray(pages) || pages.length === 0) {
        throw new Error('Invalid pages array — expected non-empty array');
      }
      
      // Validate each page structure
      pages = pages.map((page, index) => ({
        pageNumber: page.pageNumber || index + 1,
        sceneDescription: page.sceneDescription || page.scene || `Scene ${index + 1}`,
        dialogue: page.dialogue || '',
        narration: page.narration || page.text || ''
      }));
      
      console.log(`   ✅ Generated ${pages.length} pages successfully`);
      
    } catch (parseError) {
      console.error('❌ Failed to parse story JSON:', parseError.message);
      console.log('📝 Raw AI response (first 500 chars):', storyContent.substring(0, 500));
      
      // Fallback: create a simple story structure from user input
      pages = [
        {
          pageNumber: 1,
          sceneDescription: userInput,
          dialogue: '',
          narration: userInput
        }
      ];
      console.log('   ⚠️ Using fallback single-page story');
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

    console.log(`   💾 Story saved: ${story._id}`);
    return story;
  } catch (error) {
    console.error('❌ Story generation error:', error);
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
