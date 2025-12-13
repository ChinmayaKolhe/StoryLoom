# 📚 Storyloom AI

> Transform your real-life memories into beautiful illustrated storybooks using AI

Storyloom AI is a MERN-stack application that converts your personal memories and experiences into professionally illustrated storybooks. Simply describe your memory, upload photos for personalized avatars, and let AI create a magical storybook complete with illustrations and downloadable PDFs.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![AI](https://img.shields.io/badge/AI-Groq%20%7C%20OpenAI-orange)
![Image Gen](https://img.shields.io/badge/Images-HuggingFace-yellow)

## ✨ Features

- 📝 **Story Generation**: Describe your memory and AI creates a structured storybook using **Groq (Llama 3)**, **Google Gemini**, or **OpenAI**.
- 🎨 **AI Illustrations**: Generate comic-style panels using **Stable Diffusion XL** or **RealCartoonXL** via Hugging Face (Free!).
- 👤 **Custom Avatars**: Upload photos to create personalized character avatars.
- 🎭 **Multiple Styles**: Choose from cartoon, anime, comic, realistic, watercolor, or sketch styles.
- 📖 **PDF Export**: Download your storybook as a professional PDF.
- 🔐 **User Authentication**: Secure JWT-based authentication.
- 💾 **Local Storage**: Images and PDFs are stored locally for privacy and ease of setup.
- 🎨 **Premium UI**: Beautiful, modern interface with Tailwind CSS and flipbook effects.

## 🧠 Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for premium styling
- **Zustand** for state management
- **React Router** for navigation
- **React PageFlip** for book reading experience
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB Atlas** for cloud database
- **Mongoose** for data modeling
- **JWT** for authentication
- **Multer** for file uploads
- **Local File System** for asset storage (originally Cloudinary)
- **PDFKit** for PDF generation

### AI Integration
- **Groq SDK** (Llama 3) - *Super fast & Free tier available*
- **Hugging Face Inference** (SDXL, RealCartoonXL) - *Free tier available*
- **Google Generative AI** (Gemini) - *Optional*
- **OpenAI** (GPT-4, DALL-E 3) - *Optional*

## 📂 Project Structure

```
storyloom-ai/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # AI integration (Groq, HF, OpenAI)
│   ├── middleware/      # Auth, upload, error handling
│   ├── utils/           # Helper functions & File storage
│   ├── uploads/         # Local storage for generated assets
│   └── server.js        # Express server
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Zustand state management
│   │   ├── utils/       # API utilities
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── public/
│   └── index.html
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- **API Keys** (At least one set required):
  - [Groq API Key](https://console.groq.com/keys) (Recommended for text - Free)
  - [Hugging Face API Key](https://huggingface.co/settings/tokens) (Recommended for images - Free)
  - OpenAI API Key (Optional)
  - Google Gemini API Key (Optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StoryBloom
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure Environment Variables**

   **Backend** (`backend/.env`):
   Create a `.env` file in the `backend` folder with the following:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=storybloom
   
   # JWT Secret (Generate a random string)
   JWT_SECRET=your_jwt_secret_key_here

   # AI Provider Configuration (Choose one for text)
   # Options: groq, gemini, openai
   AI_PROVIDER=groq
   
   # Image Provider Configuration (Choose one for images)
   # Options: huggingface, openai
   IMAGE_PROVIDER=huggingface

   # API Keys (Fill in the ones you use)
   GROQ_API_KEY=gsk_...
   HUGGINGFACE_API_KEY=hf_...
   OPENAI_API_KEY=sk-...
   GEMINI_API_KEY=...

   # Frontend URL (CORS)
   FRONTEND_URL=http://localhost:5173
   ```

   **Frontend** (`frontend/.env`):
   Create a `.env` file in the `frontend` folder:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Run the Application**

   **Option 1: Run both servers concurrently (from root)**
   ```bash
   npm run dev
   ```

   **Option 2: Run servers separately**
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 🎯 Usage Guide

### Creating Your First Storybook

1. **Register/Login**
   - Create an account to start your journey.

2. **Create New Story**
   - Click "Create New Story".
   - **Step 1**: Describe your memory (e.g., "A sunny day at the beach with my dog").
   - **Step 2**: Choose a theme (Adventure, Fantasy, etc.) and visual style (Comic, Anime, Watercolor).
   - **Step 3**: Optional: Upload a photo to create a custom avatar.

3. **Generate Illustrations**
   - The AI will first generate the story structure (text).
   - Click "Generate Illustrations" to bring the story to life using the selected AI model.
   - Wait for panel generation (approx. 10-20 seconds per panel with Groq/HF).

4. **Read & Export**
   - Flip through your storybook using the interactive reader.
   - Click "Build Storybook PDF" to download a high-quality PDF version.

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user protocol

### Stories
- `POST /api/story/generate` - Generate new story text
- `GET /api/story` - Get all user stories
- `GET /api/story/:id` - Get specific story

### Panels & Avatars
- `POST /api/panel/generate` - Generate single panel
- `POST /api/avatar/generate` - Generate avatar from photo

### Book
- `POST /api/book/build` - Build PDF storybook

## 🐛 Troubleshooting

### Common Issues

- **"Payload Too Large" on Upload**:
  - Check your Nginx or specialized proxy settings if deploying.
  - Local uploads are handled by Multer (limit is usually set in middleware).

- **"Groq/OpenAI API Error"**:
  - Verify your API keys in `backend/.env`.
  - Check your usage limits on the provider's console.

- **Images not loading**:
  - Ensure the `backend/uploads` directory exists and has write permissions.
  - Verify `FRONTEND_URL` matches your frontend address.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- **Groq** for fast LLM inference
- **Hugging Face** for accessible image generation models
- **OpenAI** for pioneering generative AI
- **MongoDB Atlas** for database hosting
