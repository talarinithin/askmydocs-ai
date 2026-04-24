import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS


def process_pdf(file_path: str, user_id: int):

    # Load PDF
    loader = PyPDFLoader(file_path)
    documents = loader.load()

    # Split text into chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )

    docs = splitter.split_documents(documents)

    # Embedding model
    embedding = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    # Create user folder
    save_path = f"faiss_db/user_{user_id}"
    os.makedirs(save_path, exist_ok=True)

    # Store vectors in FAISS
    db = FAISS.from_documents(
        docs,
        embedding
    )

    # Save locally
    db.save_local(save_path)

    return "PDF processed successfully"
    