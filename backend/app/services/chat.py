from dotenv import load_dotenv
load_dotenv()

import os
from groq import Groq
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def ask_question(user_id: int, question: str):

    embedding = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    db = FAISS.load_local(
        f"faiss_db/user_{user_id}",
        embedding,
        allow_dangerous_deserialization=True
    )

    docs = db.similarity_search(question, k=3)

    context = "\n\n".join(
        [doc.page_content for doc in docs]
    )

    prompt = f"""
Use the PDF context first.
If needed, use general knowledge.
Answer clearly and naturally.

Context:
{context}

Question:
{question}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content