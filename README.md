# 🚀 AskMyDocs AI

An intelligent full-stack AI application that allows users to upload PDF documents and chat with them using advanced **RAG (Retrieval-Augmented Generation)** technology.

Built with **FastAPI, React, FAISS, Groq LLM, Hugging Face Embeddings**, and designed with a modern premium user experience.

---

## 🌟 Project Overview

AskMyDocs AI transforms static PDF files into interactive AI assistants.

Users can:

- 🔐 Register and Login securely
- 📄 Upload PDF files
- 🤖 Ask questions from uploaded documents
- 🧠 Get smart answers using PDF context + AI reasoning
- 💬 Maintain separate chat history for each user
- 🎨 Experience a clean and responsive interface

---

## ✨ Core Features

### 🔐 Authentication System
- User Registration
- Secure JWT Login
- Multi-user support
- Protected Routes

### 📄 Smart PDF Processing
- Upload PDF documents
- Extract text from PDFs
- Chunking large documents
- Generate vector embeddings

### 🤖 AI Chatbot Engine
- FAISS vector similarity search
- Groq LLM integration
- Context-aware answers
- General AI fallback responses
- Fast intelligent responses

### 💬 Chat Experience
- Separate chat history for every user
- Recent chats sidebar
- Real-time chat interface
- Smooth scrolling experience

### 🎨 Modern UI/UX
- Premium Landing Page
- Stylish Login / Register pages
- Beautiful Dashboard
- Responsive design
- Smooth animations

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios

### Backend
- FastAPI
- Python
- SQLAlchemy
- SQLite

### AI / ML / GenAI
- FAISS
- Hugging Face Embeddings
- Groq API
- Llama 3.1
- RAG Pipeline

---

## 🧠 How It Works


 User uploads PDF
→ Text extracted
→ Document chunking
→ Embeddings generated
→ Stored in FAISS Vector DB
→ User asks question
→ Relevant chunks retrieved
→ LLM generates smart answer

📂 Project Structure
askmydocs-ai/
│── backend/
│   ├── app/
│   ├── .env
│
│── frontend/
│   ├── src/
│
│── uploads/
│── faiss_db/
│── requirements.txt

⚙️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/talarinithin/askmydocs-ai.git
cd askmydocs-ai
2️⃣ Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r ../requirements.txt

Create .env

DATABASE_URL=sqlite:///./app.db
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
GROQ_API_KEY=GROQ_API_KEY

Run Backend:

uvicorn app.main:app --reload
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev
🚀 Future Enhancements
Multi-PDF Chat Support
Voice AI Assistant
PostgreSQL Cloud Database
Live Deployment
Chat Memory
File Summarization
Team Workspace Support

💼 About the Developer
👨‍💻 Talari Nithin

Python Developer | Machine Learning Developer | Generative AI Developer

Passionate about building intelligent AI applications, scalable backend systems, and modern full-stack solutions using Python and emerging AI technologies.

Focused on:

Python Development
Machine Learning Solutions
Generative AI Applications
LLM Integrations
Backend Engineering
Full Stack Product Development
📬 Connect With Me
GitHub: https://github.com/talarinithin
LinkedIn: www.linkedin.com/in/talari-nithin

⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

