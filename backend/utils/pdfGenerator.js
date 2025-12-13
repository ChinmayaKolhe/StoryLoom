import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

/**
 * Load image from local path or URL
 */
const loadImage = async (imagePath) => {
  // If it's a local path (starts with /uploads)
  if (imagePath.startsWith('/uploads')) {
    const localPath = path.join(process.cwd(), imagePath);
    if (fs.existsSync(localPath)) {
      return fs.readFileSync(localPath);
    }
  }
  
  // If it's a URL, download it
  try {
    const response = await axios.get(imagePath, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
  } catch (error) {
    console.error('Error loading image:', error.message);
    return null;
  }
};

/**
 * Generate a PDF storybook from story pages
 * @param {Object} story - Story object with pages
 * @param {string} outputPath - Path to save PDF
 * @returns {Promise<string>} - Path to generated PDF
 */
export const generateStoryPDF = async (story, outputPath) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);

      // Cover page
      doc.fontSize(32)
         .font('Helvetica-Bold')
         .text(story.title, { align: 'center' });
      
      doc.moveDown(2);
      doc.fontSize(14)
         .font('Helvetica')
         .text(`A ${story.theme} story`, { align: 'center' });
      
      doc.addPage();

      // Story pages
      for (const page of story.pages) {
        // Add image if available
        if (page.panelImageUrl) {
          try {
            const imageBuffer = await loadImage(page.panelImageUrl);
            
            if (imageBuffer) {
              doc.image(imageBuffer, {
                fit: [500, 300],
                align: 'center'
              });
              doc.moveDown(1);
            }
          } catch (error) {
            console.error('Error loading image for page:', error.message);
          }
        }

        // Add narration
        if (page.narration) {
          doc.fontSize(12)
             .font('Helvetica')
             .text(page.narration, {
               align: 'justify',
               lineGap: 5
             });
          doc.moveDown(1);
        }

        // Add dialogue
        if (page.dialogue) {
          doc.fontSize(11)
             .font('Helvetica-Oblique')
             .text(`"${page.dialogue}"`, {
               align: 'center',
               lineGap: 3
             });
        }

        // Page number
        doc.fontSize(10)
           .font('Helvetica')
           .text(`Page ${page.pageNumber}`, {
             align: 'center'
           });

        // Add new page if not last
        if (page.pageNumber < story.pages.length) {
          doc.addPage();
        }
      }

      // End page
      doc.addPage();
      doc.fontSize(16)
         .font('Helvetica-Bold')
         .text('The End', { align: 'center' });

      doc.end();

      writeStream.on('finish', () => {
        resolve(outputPath);
      });

      writeStream.on('error', (error) => {
        reject(error);
      });

    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Ensure uploads directory exists
 */
export const ensureUploadsDir = () => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const pdfsDir = path.join(uploadsDir, 'pdfs');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
  
  if (!fs.existsSync(pdfsDir)) {
    fs.mkdirSync(pdfsDir);
  }
  
  return pdfsDir;
};
