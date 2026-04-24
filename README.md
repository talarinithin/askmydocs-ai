# 🚀 AskMyDocs AI

An intelligent full-stack AI application that allows users to upload PDF documents and chat with them using advanced **RAG (Retrieval-Augmented Generation)** technology.

Built with **FastAPI, React, FAISS, Groq LLM, Hugging Face Embeddings**.

---

## 🌟 Project Overview

AskMyDocs AI transforms static PDF files into interactive AI assistants.

### Users Can:

- 🔐 Register and Login securely
- 📄 Upload PDF files
- 🤖 Ask questions from uploaded documents
- 🧠 Get smart answers using PDF context + AI reasoning
- 💬 Separate chat history for each user
- 🎨 Responsive UI

---

## ✨ Core Features

### 🔐 Authentication
- JWT Login
- Registration
- Multi-user support

### 📄 PDF Processing
- PDF Upload
- Text Extraction
- Embeddings
- Vector Search

### 🤖 AI Chatbot
- FAISS Search
- Groq LLM
- Context-aware answers
- General AI fallback

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS

### Backend
- FastAPI
- Python
- SQLite

### AI
- FAISS
- Hugging Face Embeddings
- Groq API

---

## 🧠 How It Works

```text
User uploads PDF
→ Text extracted
→ Chunking
→ Embeddings generated
→ Stored in FAISS
→ User asks question
→ Relevant chunks retrieved
→ LLM generates answer

📂 Project Structure
askmydocs-ai/
│── backend/
│── frontend/
│── uploads/
│── faiss_db/
│── requirements.txt
⚙️ Installation
Clone Repository
git clone https://github.com/talarinithin/askmydocs-ai.git
cd askmydocs-ai
Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r ../requirements.txt
uvicorn app.main:app --reload
Frontend Setup
cd frontend
npm install
npm run dev
💼 About the Developer
👨‍💻 Talari Nithin

Python Developer | Machine Learning Developer | Generative AI Developer

Focused on:

Python Development
Machine Learning
Generative AI
LLM Applications
Full Stack Development
📬 Connect With Me
GitHub: https://github.com/talarinithin
LinkedIn: https://www.linkedin.com/in/talari-nithin
⭐ Support

If you like this project, give it a ⭐ on GitHub.

