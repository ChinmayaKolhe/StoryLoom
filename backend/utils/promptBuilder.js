/**
 * Build prompts for different AI generation tasks
 */

export const buildStoryPrompt = (userInput, theme, visualStyle) => {
  return `You are a creative storytelling AI. Convert the following real-life memory into an engaging illustrated storybook.

User's Memory: ${userInput}

Theme: ${theme}
Visual Style: ${visualStyle}

IMPORTANT: Carefully identify ALL characters mentioned in the user's memory (their names, genders, ages, relationships, physical descriptions). Maintain these exact characters throughout the story.

Please create a story breakdown with 6-8 pages. For each page, provide:
1. Page number
2. Scene description (MUST include specific details about the characters: their genders, approximate ages, clothing, and any distinguishing features mentioned in the memory)
3. Dialogue (character speech)
4. Narration (story text)

Format your response as a JSON array with this structure:
[
  {
    "pageNumber": 1,
    "sceneDescription": "Detailed visual description including ALL characters with their specific characteristics (gender, age, appearance)",
    "dialogue": "Character dialogue if any",
    "narration": "Story narration text"
  }
]

CRITICAL: If the user mentions "4 girls and 1 boy", EVERY scene must show 4 female characters and 1 male character. If they mention "college friends", show young adults (18-22 years old), NOT children or babies.

Make the story engaging, emotional, and TRUE to the user's memory with ACCURATE character representation.`;
};

export const buildPanelPrompt = (sceneDescription, visualStyle, userInput = '') => {
  const styleGuide = {
    cartoon: 'vibrant cartoon style with bold outlines and bright colors',
    anime: 'anime/manga style with expressive eyes and dynamic poses',
    comic: 'comic book style with dramatic shading and action lines',
    realistic: 'realistic illustration with detailed textures',
    watercolor: 'soft watercolor painting style with gentle colors',
    sketch: 'hand-drawn sketch style with pencil textures'
  };

  let prompt = `Create a ${styleGuide[visualStyle] || styleGuide.cartoon} illustration for a storybook panel.

Scene: ${sceneDescription}`;

  // Add original story context for character consistency
  if (userInput) {
    prompt += `\n\nOriginal story context (for character accuracy): ${userInput.substring(0, 200)}`;
  }

  prompt += `\n\nStyle requirements:
- MAINTAIN EXACT character details from scene description (genders, ages, number of people)
- If scene mentions "4 girls and 1 boy", show exactly 4 female and 1 male character
- If scene mentions "college friends", show young adults (18-22 years), NOT children
- Consistent character design across all panels
- Clear composition and professional quality
- Appropriate for storybook illustration
- No text or speech bubbles in the image
- High detail and vibrant colors`;

  return prompt;
};

export const buildAvatarPrompt = (characterName, style) => {
  return `Create a character avatar in ${style} style for a storybook character named ${characterName}. 
  
The avatar should be:
- Consistent and recognizable
- Suitable for children's storybook
- Expressive and friendly
- Full body or portrait view
- High quality illustration`;
};

export const buildTitlePrompt = (userInput) => {
  return `Based on this memory/story, suggest a creative and engaging title (max 6 words):

${userInput}

Respond with ONLY the title, nothing else.`;
};
