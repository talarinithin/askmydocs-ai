import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# ✅ Get correct absolute path to backend folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ✅ Point directly to .env file
dotenv_path = os.path.join(BASE_DIR, ".env")

# ✅ Load env properly
load_dotenv(dotenv_path)

# ✅ Debug (temporary)
print("ENV PATH:", dotenv_path)


DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL is missing. Check .env file location!")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()