/**
 * Build prompts for different AI generation tasks
 * Optimized for Google Gemini models
 */

export const buildStoryPrompt = (userInput, theme, visualStyle) => {
  return `You are a professional creative storytelling AI. Convert the following real-life memory into an engaging illustrated storybook.

User's Memory: ${userInput}

Theme: ${theme}
Visual Style: ${visualStyle}

INSTRUCTIONS:
1. Carefully identify ALL characters mentioned in the user's memory — their names, genders, ages, relationships, and physical descriptions.
2. Maintain these exact characters consistently throughout ALL pages.
3. Create a story breakdown with exactly 6-8 pages.
4. Each scene description must be highly detailed and visual — imagine you are describing a painting to an artist.

For each page, provide:
- pageNumber: Sequential page number (1, 2, 3...)
- sceneDescription: Extremely detailed visual description including ALL characters with their specific characteristics (gender, age, appearance, clothing, body language, expressions, position in scene), environment details, lighting, mood, colors
- dialogue: Character speech/dialogue for that scene (use empty string if no dialogue)
- narration: Story narration text that advances the plot

CRITICAL RULES:
- If the user mentions specific numbers of people (e.g., "4 girls and 1 boy"), EVERY scene MUST show exactly that many characters with correct genders.
- If they mention "college friends", show young adults (18-22 years old), NOT children.
- Each scene description should be vivid enough to generate a standalone illustration.
- Keep narration engaging, emotional, and true to the user's memory.

OUTPUT FORMAT: Respond with ONLY a valid JSON object containing a "pages" array. No markdown, no code blocks, no extra text.

{
  "pages": [
    {
      "pageNumber": 1,
      "sceneDescription": "Detailed visual description...",
      "dialogue": "Character dialogue or empty string",
      "narration": "Story narration text"
    }
  ]
}`;
};

export const buildPanelPrompt = (sceneDescription, visualStyle, userInput = '') => {
  const styleGuide = {
    cartoon: 'vibrant cartoon illustration with bold outlines, bright saturated colors, clean shapes, Disney/Pixar quality animation style',
    anime: 'anime/manga art style with expressive large eyes, dynamic action poses, cel-shaded coloring, vibrant palette',
    comic: 'professional comic book art with dramatic ink shading, bold black outlines, vivid panel colors, halftone texture',
    realistic: 'photorealistic digital painting with detailed textures, natural cinematic lighting, hyper-detailed environment',
    watercolor: 'soft watercolor painting style with gentle blended colors, wet-on-wet brushstroke textures, dreamy ethereal atmosphere',
    sketch: 'detailed pencil sketch art with fine crosshatch shading, artistic graphite textures, hand-drawn quality'
  };

  let prompt = `Create a beautiful ${styleGuide[visualStyle] || styleGuide.cartoon} illustration for a storybook page.

SCENE TO ILLUSTRATE: ${sceneDescription}`;

  // Add original story context for character consistency
  if (userInput) {
    prompt += `

STORY CONTEXT (for character accuracy): ${userInput.substring(0, 300)}`;
  }

  prompt += `

STRICT REQUIREMENTS:
- MAINTAIN EXACT character details from scene description (genders, ages, number of people, clothing)
- If the scene mentions specific numbers of characters, show EXACTLY that many
- If scene mentions young adults/college friends, show people aged 18-22, NOT children
- Professional storybook illustration quality
- Rich detailed background environment
- Cinematic composition with clear focal point
- Expressive character faces and body language
- Vibrant, harmonious color palette
- NO text, NO speech bubbles, NO watermarks, NO borders
- Single cohesive scene, not multiple panels`;

  return prompt;
};

export const buildAvatarPrompt = (characterName, style) => {
  return `Create a character avatar illustration in ${style} style for a storybook character named "${characterName}". 
  
The avatar should be:
- Consistent and instantly recognizable
- Expressive, warm and friendly appearance
- Full body or 3/4 portrait view
- High quality professional illustration
- Clean, uncluttered composition
- Suitable for a storybook character
- Vibrant colors matching the ${style} art style
- Clean white or simple gradient background`;
};

export const buildTitlePrompt = (userInput) => {
  return `Based on this memory/story description, suggest a creative and emotionally engaging title (maximum 6 words).

Memory: ${userInput}

Respond with ONLY the title text. No quotes, no punctuation, no explanation.`;
};
