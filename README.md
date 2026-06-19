# Storyloom AI

> Transform your real-life memories into beautiful illustrated storybooks using AI

Storyloom AI is a MERN-stack application that converts your personal memories and experiences into professionally illustrated storybooks. Simply describe your memory, upload photos for personalized avatars, and let AI create a magical storybook complete with illustrations and a downloadable PDF.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![AI](https://img.shields.io/badge/AI-Gemini%20%7C%20Groq%20%7C%20OpenAI-orange)
![Image Gen](https://img.shields.io/badge/Images-Gemini%20%7C%20HuggingFace-yellow)
![Version](https://img.shields.io/badge/Version-2.0.0-purple)

## Features

- **Story Generation**: Describe your memory and AI creates a structured storybook using **Groq (Llama 3)**, **Google Gemini**, or **OpenAI**.
- **AI Illustrations**: Generate comic-style panels using **Stable Diffusion XL** or **RealCartoonXL** via Hugging Face (Free!).
- **Custom Avatars**: Upload photos to create personalized character avatars.
- **Multiple Styles**: Choose from cartoon, anime, comic, realistic, watercolor, or sketch styles.
- **PDF Export**: Download your storybook as a professional PDF.
- **User Authentication**: Secure JWT-based authentication.
- **Local Storage**: Images and PDFs are stored locally for privacy and ease of setup.
- **Premium UI**: Beautiful, modern interface with Tailwind CSS and flipbook effects.

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** + Vite | UI framework and build tool |
| **Tailwind CSS** | Styling |
| **Zustand** | Global state management |
| **React Router v6** | Client-side navigation |
| **React PageFlip** | Interactive book-reading experience |
| **Axios** | HTTP API client |
| **html2canvas + jsPDF** | Client-side PDF/canvas utilities |
| **react-icons** | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | Server and REST API |
| **MongoDB Atlas + Mongoose** | Cloud database and data modeling |
| **JWT + bcryptjs** | Authentication and password hashing |
| **Multer** | Photo/file upload handling |
| **PDFKit** | Server-side PDF generation |
| **Sharp** | Image processing |
| **Canvas** | Server-side canvas rendering |
| **Nodemon** | Development auto-restart |

### AI & Image Generation
| Provider | Role | Model Used |
|---|---|---|
| **Google Gemini** | Text (Primary) | `gemini-2.5-flash` |
| **Google Gemini** | Images (Primary) | `gemini-2.5-flash-preview-image-generation` |
| **Groq** | Text (Fallback) | `llama-3.3-70b-versatile` |
| **HuggingFace** | Images (Fallback) | `stabilityai/stable-diffusion-xl-base-1.0` |
| **OpenAI** | Text + Images (Optional) | `gpt-4o-mini` / `dall-e-3` |

## Project Structure

```
Storyloom/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, getMe
│   │   ├── storyController.js     # Story CRUD handlers
│   │   ├── panelController.js     # Panel generation handlers
│   │   ├── avatarController.js    # Avatar generation handlers
│   │   └── bookController.js     # PDF storybook builder
│   ├── middleware/
│   │   ├── auth.js                # JWT protect middleware
│   │   ├── upload.js              # Multer file upload config
│   │   └── errorHandler.js        # Global error handler
│   ├── models/
│   │   ├── User.js                # User schema
│   │   ├── Story.js               # Story + pages schema
│   │   └── Avatar.js              # Avatar schema
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth
│   │   ├── storyRoutes.js         # /api/story
│   │   ├── panelRoutes.js         # /api/panel
│   │   ├── avatarRoutes.js        # /api/avatar
│   │   └── bookRoutes.js          # /api/book
│   ├── services/
│   │   ├── storyService.js        # AI story generation (Gemini/Groq/OpenAI)
│   │   ├── imageService.js        # AI image generation (Gemini/HuggingFace/DALL-E)
│   │   ├── panelService.js        # Panel generation orchestration
│   │   ├── avatarService.js       # Avatar generation orchestration
│   │   └── bookService.js         # PDF assembly
│   ├── utils/
│   │   ├── promptBuilder.js       # AI prompt construction helpers
│   │   ├── pdfGenerator.js        # PDF generation utilities
│   │   └── cloudinary.js          # Local file storage helpers (replaces Cloudinary)
│   ├── uploads/                   # Local storage for generated assets
│   │   ├── panels/                # Generated story panel images
│   │   ├── avatars/               # Generated avatar images
│   │   └── books/                 # Generated PDF storybooks
│   ├── .env                       # Environment variables (see below)
│   └── server.js                  # Express server entry point (v2.0.0)
│
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Page components (Home, Create, Read, etc.)
│   │   ├── store/                 # Zustand state stores
│   │   ├── utils/                 # API utility functions (axios config)
│   │   ├── App.jsx                # Root app component + routing
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Global styles
│   ├── index.html                 # HTML template
│   ├── vite.config.js             # Vite configuration
│   ├── tailwind.config.js         # Tailwind CSS configuration
│   └── .env                       # Frontend environment variables
│
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB Atlas** account (free tier works)
- **At least one AI API Key** (Gemini is recommended):

| API Key | Purpose | Link |
|---|---|---|
| Google Gemini | Text + Image generation (Primary) | [Get Key](https://aistudio.google.com/app/apikey) |
| Groq (Free) | Text fallback | [Get Key](https://console.groq.com/keys) |
| HuggingFace (Free) | Image fallback | [Get Token](https://huggingface.co/settings/tokens) |
| OpenAI (Paid) | Optional text + image | [Get Key](https://platform.openai.com/api-keys) |

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ChinmayaKolhe/StoryLoom
   cd StoryLoom
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment Variables**

   **Backend** — create `backend/.env`:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=storybloom

   # JWT Secret (use a long random string, min 64 chars)
   JWT_SECRET=your_jwt_secret_key_here

   # AI Provider for Story Text Generation
   # Options: gemini | groq | openai
   AI_PROVIDER=gemini

   # Image Provider for Panel & Avatar Generation
   # Options: gemini | huggingface | openai
   IMAGE_PROVIDER=huggingface

   # Google Gemini API Key (Primary — recommended)
   # Get from: https://aistudio.google.com/app/apikey
   GEMINI_API_KEY=your_gemini_api_key_here

   # Groq API Key (Fallback for text — FREE!)
   # Get from: https://console.groq.com/keys
   GROQ_API_KEY=gsk_...

   # HuggingFace API Key (Fallback for images — FREE!)
   # Get from: https://huggingface.co/settings/tokens
   HUGGINGFACE_API_KEY=hf_...

   # OpenAI API Key (Optional)
   # OPENAI_API_KEY=sk-...

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:5173
   ```

   **Frontend** — create `frontend/.env`:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Run the Application**

   **Terminal 1 — Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 — Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health
   - API Root: http://localhost:5000/

## Usage Guide

### Creating Your First Storybook

1. **Register / Login**
   - Create an account to get started.

2. **Create New Story**
   - Click **"Create New Story"**.
   - **Step 1**: Describe your memory in detail (e.g., *"A rainy day picnic with 3 college friends at the park"*).
   - **Step 2**: Choose a **theme** (Adventure, Fantasy, Romance, etc.) and a **visual style** (Cartoon, Anime, Comic, Watercolor, Sketch, Realistic).
   - **Step 3** *(Optional)*: Upload a photo to generate a custom character avatar.

3. **Generate Story & Illustrations**
   - The AI generates a structured 6–8 page story with scene descriptions, dialogue, and narration.
   - Click **"Generate Illustrations"** to create panel images for each page.
   - Generation takes approximately 10–30 seconds per panel depending on the provider.

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

* for database hosting
