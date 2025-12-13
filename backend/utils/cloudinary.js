import fs from 'fs';
import path from 'path';

/**
 * Ensure uploads directory exists
 */
export const ensureUploadsDir = () => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const avatarsDir = path.join(uploadsDir, 'avatars');
  const panelsDir = path.join(uploadsDir, 'panels');
  const pdfsDir = path.join(uploadsDir, 'pdfs');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
  
  if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir);
  }
  
  if (!fs.existsSync(panelsDir)) {
    fs.mkdirSync(panelsDir);
  }
  
  if (!fs.existsSync(pdfsDir)) {
    fs.mkdirSync(pdfsDir);
  }
  
  return { uploadsDir, avatarsDir, panelsDir, pdfsDir };
};

/**
 * Save file to local storage
 * @param {string} sourcePath - Source file path
 * @param {string} destinationFolder - Destination folder (avatars, panels, pdfs)
 * @param {string} filename - Optional custom filename
 * @returns {string} - Public URL to access the file
 */
export const saveToLocal = (sourcePath, destinationFolder, filename = null) => {
  try {
    const { uploadsDir } = ensureUploadsDir();
    const destFolder = path.join(uploadsDir, destinationFolder);
    
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }
    
    const finalFilename = filename || path.basename(sourcePath);
    const destPath = path.join(destFolder, finalFilename);
    
    // Copy file to destination
    fs.copyFileSync(sourcePath, destPath);
    
    // Return public URL (relative to server)
    return `/uploads/${destinationFolder}/${finalFilename}`;
  } catch (error) {
    console.error('Local storage error:', error);
    throw new Error('Failed to save file to local storage');
  }
};

/**
 * Delete file from local storage
 * @param {string} fileUrl - File URL (e.g., /uploads/avatars/image.jpg)
 */
export const deleteFromLocal = (fileUrl) => {
  try {
    const filePath = path.join(process.cwd(), fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Local delete error:', error);
    throw new Error('Failed to delete file from local storage');
  }
};

/**
 * Save base64 image to local storage
 * @param {string} base64Data - Base64 encoded image data
 * @param {string} destinationFolder - Destination folder
 * @param {string} filename - Filename
 * @returns {string} - Public URL
 */
export const saveBase64ToLocal = (base64Data, destinationFolder, filename) => {
  try {
    const { uploadsDir } = ensureUploadsDir();
    const destFolder = path.join(uploadsDir, destinationFolder);
    
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }
    
    const destPath = path.join(destFolder, filename);
    
    // Remove data URL prefix if present
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Image, 'base64');
    
    fs.writeFileSync(destPath, buffer);
    
    return `/uploads/${destinationFolder}/${filename}`;
  } catch (error) {
    console.error('Base64 save error:', error);
    throw new Error('Failed to save base64 image');
  }
};
