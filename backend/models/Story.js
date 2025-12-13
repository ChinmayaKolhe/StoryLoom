import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
  pageNumber: {
    type: Number,
    required: true
  },
  sceneDescription: {
    type: String,
    required: true
  },
  dialogue: {
    type: String,
    default: ''
  },
  narration: {
    type: String,
    default: ''
  },
  panelImageUrl: {
    type: String,
    default: ''
  },
  panelGenerationStatus: {
    type: String,
    enum: ['pending', 'generating', 'completed', 'failed'],
    default: 'pending'
  },
  layout: {
    type: String,
    enum: ['single', 'split', 'triple'],
    default: 'single'
  }
});

const storySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  userInput: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    enum: ['adventure', 'romance', 'mystery', 'comedy', 'drama', 'fantasy', 'scifi'],
    default: 'adventure'
  },
  visualStyle: {
    type: String,
    enum: ['cartoon', 'anime', 'comic', 'realistic', 'watercolor', 'sketch'],
    default: 'cartoon'
  },
  avatars: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Avatar'
  }],
  pages: [pageSchema],
  pdfUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'generating', 'completed', 'failed'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

storySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Story = mongoose.model('Story', storySchema);

export default Story;
