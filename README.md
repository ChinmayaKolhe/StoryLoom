# 📚 Storyloom AI

> Transform your real-life memories into beautiful illustrated storybooks using AI

Storyloom AI is a MERN-stack application that converts your personal memories and experiences into professionally illustrated storybooks. Simply describe your memory, upload photos for personalized avatars, and let AI create a magical storybook complete with illustrations and a downloadable PDF.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![AI](https://img.shields.io/badge/AI-Gemini%20%7C%20Groq%20%7C%20OpenAI-orange)
![Image Gen](https://img.shields.io/badge/Images-Gemini%20%7C%20HuggingFace-yellow)
![Version](https://img.shields.io/badge/Version-2.0.0-purple)

## ✨ Features

- 📝 **Story Generation**: Describe your memory and AI creates a structured storybook using **Google Gemini 2.5 Flash** (primary), **Groq (Llama 3.3)**, or **OpenAI GPT-4o-mini**.
- 🎨 **AI Illustrations**: Generate comic-style panels using **Gemini 2.5 Flash Image Generation** (primary) or **Stable Diffusion XL** via HuggingFace.
- 👤 **Custom Avatars**: Upload a photo to create personalized character avatars in your chosen art style.
- 🎭 **Multiple Visual Styles**: Choose from `cartoon`, `anime`, `comic`, `realistic`, `watercolor`, or `sketch` styles.
- 📖 **PDF Export**: Download your storybook as a professional PDF via PDFKit.
- 🔐 **User Authentication**: Secure JWT-based authentication with bcrypt password hashing.
- 💾 **Local File Storage**: Generated images and PDFs are stored locally in `backend/uploads/` for privacy and easy setup.
- 🎨 **Premium UI**: Beautiful, modern interface with Tailwind CSS, Zustand state management, and flipbook reading effects.
- ⚡ **Provider Fallback**: If the primary AI provider fails, the system automatically falls back to the next available provider.

## 🧠 Tech Stack

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

## 📂 Project Structure

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

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB Atlas** account (free tier works)
- **At least one AI API Key** (Gemini is recommended):

| API Key | Purpose | Link |
|---|---|---|
| Google Gemini ⭐ | Text + Image generation (Primary) | [Get Key](https://aistudio.google.com/app/apikey) |
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
   - 🌐 Frontend: http://localhost:5173
   - 🔌 Backend API: http://localhost:5000
   - ✅ Health Check: http://localhost:5000/api/health
   - 📖 API Root: http://localhost:5000/

## 🎯 Usage Guide

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
   - Flip through your storybook using the interactive page-flip reader.
   - Click **"Build Storybook PDF"** to download a high-quality PDF version.

## 🔌 API Endpoints

### Authentication — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Register new user |
| `POST` | `/api/auth/login` | ❌ | Login user |
| `GET` | `/api/auth/me` | ✅ | Get current user profile |

### Stories — `/api/story`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/story/generate` | ✅ | Generate new story from memory |
| `GET` | `/api/story` | ✅ | Get all stories for current user |
| `GET` | `/api/story/:id` | ✅ | Get a specific story by ID |
| `PUT` | `/api/story/:id/status` | ✅ | Update story status |
| `DELETE` | `/api/story/:id` | ✅ | Delete a story |

### Panels — `/api/panel`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/panel/generate` | ✅ | Generate a single story panel image |
| `POST` | `/api/panel/generate-all` | ✅ | Generate all panels for a story (async) |
| `GET` | `/api/panel/status/:storyId` | ✅ | Get panel generation status |

### Avatars — `/api/avatar`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/avatar/generate` | ✅ | Generate avatar from uploaded photo |
| `GET` | `/api/avatar` | ✅ | Get all avatars for current user |
| `GET` | `/api/avatar/:id` | ✅ | Get a specific avatar |
| `DELETE` | `/api/avatar/:id` | ✅ | Delete an avatar |

### Book — `/api/book`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/book/build` | ✅ | Build and download PDF storybook |
| `GET` | `/api/book/preview/:storyId` | ✅ | Get storybook preview data |

### Utility
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | ❌ | API health check (shows active providers) |
| `GET` | `/` | ❌ | API root info |

## 🤖 AI Provider Configuration

The application supports **runtime provider switching** via environment variables. No code changes needed.

### Text Generation (`AI_PROVIDER`)

| Value | Model | Notes |
|---|---|---|
| `gemini` *(default)* | `gemini-2.5-flash` | Best quality; auto-falls back to Groq on failure |
| `groq` | `llama-3.3-70b-versatile` | Fast & free tier available |
| `openai` | `gpt-4o-mini` | Requires paid OpenAI account |

### Image Generation (`IMAGE_PROVIDER`)

| Value | Model | Notes |
|---|---|---|
| `gemini` | `gemini-2.5-flash-preview-image-generation` | Native inline image generation; auto-falls back to HuggingFace |
| `huggingface` *(default)* | `stabilityai/stable-diffusion-xl-base-1.0` | Free tier; ~25 inference steps |
| `openai` | `dall-e-3` (1792×1024) | Highest quality; requires paid account |

## 🐛 Troubleshooting

### Common Issues

- **Images not loading after generation**
  - Ensure `backend/uploads/panels/` and `backend/uploads/avatars/` exist with write permissions.
  - Verify `FRONTEND_URL` in `backend/.env` matches your frontend address exactly.

- **"No AI provider configured" error**
  - At minimum, set `GEMINI_API_KEY` in `backend/.env`.
  - Confirm `AI_PROVIDER=gemini` and `IMAGE_PROVIDER=gemini` (or `huggingface`) are set.

- **Gemini image generation fails**
  - The `gemini-2.5-flash-preview-image-generation` model may have rate limits or regional restrictions.
  - Switch to `IMAGE_PROVIDER=huggingface` as a reliable free fallback.

- **"Payload Too Large" on photo upload**
  - This is controlled by Multer in `backend/middleware/upload.js`.
  - If using a reverse proxy (Nginx), increase `client_max_body_size`.

- **MongoDB connection error**
  - Verify your `MONGODB_URI` in `backend/.env` is correct.
  - Ensure your IP address is whitelisted in MongoDB Atlas network access settings.

- **JWT errors**
  - Regenerate `JWT_SECRET` using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

