from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.utils.security import get_current_user
from app.models.user import User

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

from groq import Groq


router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


# Load API Key
groq_key = os.getenv("GROQ_API_KEY")

if not groq_key:
    raise ValueError("Missing GROQ_API_KEY in .env")

client = Groq(api_key=groq_key)


class QuestionRequest(BaseModel):
    question: str


@router.post("/ask")
def ask_question(
    data: QuestionRequest,
    current_user: User = Depends(get_current_user)
):
    question = data.question.strip()

    if not question:
        return {
            "question": "",
            "answer": "Please enter a question first."
        }

    try:
        context = ""
        used_pdf = False

        # Embedding model
        embedding = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )

        db_path = f"faiss_db/user_{current_user.id}"

        # If user uploaded PDF, use it
        if os.path.exists(db_path):
            db = FAISS.load_local(
                db_path,
                embedding,
                allow_dangerous_deserialization=True
            )

            docs = db.similarity_search(
                question,
                k=4
            )

            if docs:
                context = "\n\n".join(
                    [doc.page_content for doc in docs]
                )
                used_pdf = True

        # Smart Prompt
        prompt = f"""
You are a professional AI assistant.

Follow these rules strictly:

1. Always structure answers clearly.
2. Use headings (##) for sections.
3. Use bullet points for lists.
4. Use tables when comparing.
5. Keep answers concise and readable.
6. Avoid long paragraphs.
7. Use examples when needed.
8. If coding question → use code blocks.
9. If explanation → break into steps.

Answer like ChatGPT, not like a textbook.

PDF Context:
{context}

User Question:
{question}
"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7
        )

        answer = response.choices[0].message.content

        return {
            "question": question,
            "answer": answer,
            "source": "PDF + AI" if used_pdf else "General AI"
        }

    except Exception as e:
        return {
            "question": question,
            "answer": f"Something went wrong ❌",
            "error": str(e)
        }