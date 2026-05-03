from fastapi import FastAPI, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, chat
from app.utils.security import get_current_user
from app.models.user import User
from app.services.rag import process_pdf
from pypdf import PdfReader
import shutil
import os
from app.database import Base, engine
from app.models import user

app = FastAPI(title="AskMyDocs AI API")

# ✅ Startup event (important)
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

# ✅ CORS (temporary open)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(chat.router)

@app.get("/")
def home():
    return {"message": "Backend running"}

@app.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }

@app.post("/upload")
def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    os.makedirs("uploads", exist_ok=True)

    file_path = f"uploads/{current_user.id}_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    process_pdf(file_path, current_user.id)

    return {
        "message": "File uploaded and processed successfully",
        "filename": file.filename,
        "user_id": current_user.id
    }

@app.get("/read-pdf/{filename}")
def read_pdf(
    filename: str,
    current_user: User = Depends(get_current_user)
):
    file_path = f"uploads/{current_user.id}_{filename}"

    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"

    return {
        "filename": filename,
        "content": text[:5000]
    }