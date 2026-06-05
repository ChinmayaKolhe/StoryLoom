import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { ensureUploadsDir } from './utils/pdfGenerator.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import avatarRoutes from './routes/avatarRoutes.js';
import panelRoutes from './routes/panelRoutes.js';
import bookRoutes from './routes/bookRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Ensure uploads directory exists
ensureUploadsDir();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/story', storyRoutes);
app.use('/api/avatar', avatarRoutes);
app.use('/api/panel', panelRoutes);
app.use('/api/book', bookRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Storyloom AI API is running',
    aiProvider: process.env.AI_PROVIDER || 'gemini',
    imageProvider: process.env.IMAGE_PROVIDER || 'gemini',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Storyloom AI API',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      story: '/api/story',
      avatar: '/api/avatar',
      panel: '/api/panel',
      book: '/api/book'
    }
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  const aiProvider = process.env.AI_PROVIDER || 'gemini';
  const imageProvider = process.env.IMAGE_PROVIDER || 'gemini';
  
  console.log(`\n🚀 Storyloom AI Server v2.0`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📍 Port:           ${PORT}`);
  console.log(`🌍 Environment:    ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL:   ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🤖 AI Provider:    ${aiProvider.toUpperCase()} ${aiProvider === 'gemini' ? '(gemini-2.5-flash)' : ''}`);
  console.log(`🎨 Image Provider: ${imageProvider.toUpperCase()} ${imageProvider === 'gemini' ? '(gemini-2.5-flash-image)' : ''}`);
  console.log(`🔑 Gemini API:     ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});

export default app;
