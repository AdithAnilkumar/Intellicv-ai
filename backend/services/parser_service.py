import re
from pypdf import PdfReader
from docx import Document

def extract_text(file_path: str, filename: str) -> str:
    ext = filename.split(".")[-1].lower()
    
    if ext == "pdf":
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    
    elif ext == "docx":
        doc = Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs])
    
    elif ext == "txt":
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    
    else:
        raise ValueError("Unsupported file format. Use PDF, DOCX, or TXT.")

def parse_resume(text: str) -> dict:
    return {
        "name": extract_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "skills": extract_skills(text),
    }

def extract_email(text: str) -> str:
    match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    return match.group(0) if match else "Not found"

def extract_phone(text: str) -> str:
    match = re.search(r'(\+?\d[\d\s\-]{8,15})', text)
    return match.group(0).strip() if match else "Not found"

def extract_name(text: str) -> str:
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    return lines[0] if lines else "Not found"

def extract_skills(text: str) -> list:
    common_skills = [
        "Python", "JavaScript", "TypeScript", "React", "Node.js",
        "FastAPI", "Django", "Flask", "SQL", "PostgreSQL", "MongoDB",
        "Docker", "Kubernetes", "AWS", "Git", "LangChain", "FAISS",
        "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
        "HuggingFace", "Pandas", "NumPy", "Tailwind", "GraphQL"
    ]
    found = [s for s in common_skills if s.lower() in text.lower()]
    return found