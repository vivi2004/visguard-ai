# VisGuard AI
**VisGuard AI** is a visual intelligence platform that performs AI-powered **image captioning** and **object detection**. Built with a modern full-stack architecture (React + Node.js + FastAPI + Supabase + Hugging Face), it enables users to upload images, analyze them, and export results.
---
## Features
* Upload image via modern UI* AI-generated image caption using `ViT-GPT2`* Object detection using `facebook/detr-resnet-50`* Export results as PDF* 🡩 Authenticated with Supabase* History and feedback management* Image storage using Supabase Storage or UploadThing
---
## Folder Structure
```visguard-ai/├── client/              # Frontend: React + Vite.js + Tailwind CSS├── backend/             # Node.js backend (object detection + Supabase)├── captioning-api/      # FastAPI backend for image captioning├── README.md└── .env.example```
---
## Installation
### 1. Clone the Repository
```bashgit clone https://github.com/your-username/visguard-ai.gitcd visguard-ai```
---
### 2. Backend (Node.js API)
```bashcd backendnpm install```
Create a `.env` file based on the example below.
Start the backend server:
```bashnpm run dev# ornode app.js```
Runs at: `http://localhost:5000`
---
### 3. Captioning API (Python + FastAPI)
```bashcd captioning-apipython -m venv venvsource venv/bin/activate   # On Windows: venv\Scripts\activatepip install -r requirements.txt```
Run server:
```bashuvicorn main:app --host 0.0.0.0 --port 8000 --reload```
Runs at: `http://localhost:8000`
---
### 4. Frontend (React + Vite)
```bashcd clientnpm installnpm run dev```
Runs at: `http://localhost:5173`
---
## Supabase Setup
Create tables in Supabase:
* `users`* `analyses`* `feedback`* Storage bucket: `uploads`
Enable **Row-Level Security (RLS)** and add policies.
Set your JWT secret in the `.env` file and allow service role key for DB access.
---
## API Overview
### POST `/api/analyze` (Node.js)
* Takes `imageUrl`* Authenticated via Supabase JWT* Runs object detection (locally or via Hugging Face)* Calls FastAPI `/caption-by-url` for captioning* Stores result in Supabase DB
### POST `/caption` (FastAPI)
* Accepts image file upload* Returns AI-generated caption
### POST `/caption-by-url` (FastAPI)
* Accepts `imageUrl`* Returns caption
---
## Vite Proxy Setup
In `client/vite.config.ts`:
```tsserver: {  proxy: {    '/api': 'http://localhost:5000',  },}```
---
## .env.example
```env# Node BackendSUPABASE_URL=https://your-project.supabase.coSUPABASE_KEY=your-supabase-service-role-keySUPABASE_JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloud-nameCLOUDINARY_API_KEY=your-cloudinary-keyCLOUDINARY_API_SECRET=your-cloudinary-secret```
---
## requirements.txt (Python FastAPI)
```txtfastapiuvicorntransformerstorchpillowrequests```
Save this as `captioning-api/requirements.txt`
---
## Troubleshooting
| Problem                | Fix                                                                             || ---------------------- | ------------------------------------------------------------------------------- || `CORS Error`           | Ensure CORS is configured for `http://localhost:5173` in both backend & FastAPI || `Network Error: 500`   | Check Cloudinary credentials and Supabase policies                              || `Caption timeout`      | Increase Axios timeout or ensure captioning API is responsive                   || `Login fails`          | Check Supabase JWT secret and project URL                                       || `Objects not returned` | Make sure `/api/analyze` calls both detection & caption endpoints correctly     || `Only caption shows`   | Backend must merge results from captioning + object detection before responding |
---
## Tech Stack
| Layer    | Tech                            || -------- | ------------------------------- || Frontend | React + Tailwind + Vite         || Backend  | Node.js + Express + Cloudinary  || AI API   | Python + FastAPI + Hugging Face || Auth/DB  | Supabase                        || Storage  | Supabase Storage / UploadThing  |
---
## Author
Made with by [Vivek Kumar Purbey](https://github.com/vivi2004)
---
## License
MIT License. Feel free to fork, extend, and contribute!
