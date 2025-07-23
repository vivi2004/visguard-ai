 VisGuard AI
VisGuard AI is a visual intelligence platform for AI-powered image captioning and object detection. Built with a full-stack architecture using React, Node.js, FastAPI, Supabase, and Hugging Face, it allows users to upload images, analyze them using modern AI models, and export results.

📸 Features
📄 Upload images via a modern UI

🧠 AI-generated image captions using ViT-GPT2

🎯 Object detection powered by facebook/detr-resnet-50

📜 Export analyzed results as PDF

🡩 User authentication with Supabase

📃 History and feedback management

☁️ Image storage with Supabase Storage or UploadThing

📁 Folder Structure
text
visguard-ai/
├── client/              # Frontend: React + Vite.js + Tailwind CSS
├── backend/             # Node.js backend (object detection + Supabase)
├── captioning-api/      # FastAPI backend for image captioning
├── README.md
└── .env.example
⚙️ Installation
1. Clone the Repository
bash
git clone https://github.com/your-username/visguard-ai.git
cd visguard-ai
2. Backend (Node.js API)
bash
cd backend
npm install
Create a .env file using the provided example.

Start the backend server:

bash
npm run dev
# or
node app.js
Server runs at: http://localhost:5000

3. Captioning API (Python + FastAPI)
bash
cd captioning-api
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
Start the captioning server:

bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
Server runs at: http://localhost:8000

4. Frontend (React + Vite)
bash
cd client
npm install
npm run dev
Runs at: http://localhost:5173

🔐 Supabase Setup
Create the following tables in Supabase:

users

analyses

feedback

Storage bucket: uploads

Enable Row-Level Security (RLS) and set policies.

Set your JWT secret in the .env file and provide the service role key for database access.

🧪 API Overview
POST /api/analyze (Node.js)
Accepts imageUrl

Authenticated via Supabase JWT

Runs object detection (locally or via Hugging Face API)

Calls FastAPI /caption-by-url endpoint for caption

Saves analysis results in Supabase

POST /caption (FastAPI)
Accepts image file uploads

Returns AI-generated caption

POST /caption-by-url (FastAPI)
Accepts imageUrl

Returns AI-generated caption

🌐 Vite Proxy Setup
In your client/vite.config.ts, add:

ts
server: {
  proxy: {
    '/api': 'http://localhost:5000',
  },
}
📄 .env.example
text
# Node Backend
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
🦪 requirements.txt (Python FastAPI)
text
fastapi
uvicorn
transformers
torch
pillow
requests
Save this as captioning-api/requirements.txt.

⚠️ Troubleshooting
Problem	Fix
CORS Error	Ensure CORS is configured for http://localhost:5173 in both backend and FastAPI
Network Error: 500	Check Cloudinary credentials and Supabase policies
Caption timeout	Increase Axios timeout or ensure captioning API is responsive
Login fails	Verify Supabase JWT secret and project URL
Objects not returned	Ensure /api/analyze calls both detection and caption endpoints
Only caption shows	Backend must merge results from captioning and object detection
🛠 Tech Stack
Layer	Tech
Frontend	React + Tailwind + Vite
Backend	Node.js + Express + Cloudinary
AI API	Python + FastAPI + Hugging Face
Auth/DB	Supabase
Storage	Supabase Storage / UploadThing
👨‍💼 Author
Made with 💻 by Vivek Kumar Purbey

📜 License
MIT License. Feel free to fork, extend, and contribute!
