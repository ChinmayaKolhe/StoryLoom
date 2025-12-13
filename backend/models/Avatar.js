import mongoose from 'mongoose';

const avatarSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalImageUrl: {
    type: String,
    required: true
  },
  generatedImageUrl: {
    type: String,
    required: true
  },
  style: {
    type: String,
    enum: ['cartoon', 'anime', 'comic', 'realistic', 'watercolor', 'sketch'],
    default: 'cartoon'
  },
  characterName: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Avatar = mongoose.model('Avatar', avatarSchema);

export default Avatar;
