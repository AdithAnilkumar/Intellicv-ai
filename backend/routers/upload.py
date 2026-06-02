from fastapi import APIRouter, UploadFile, File, HTTPException
from services.parser_service import extract_text, parse_resume
from services.rag_service import build_index
import shutil, os, uuid

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    allowed = ["pdf", "docx", "txt"]
    ext = file.filename.split(".")[-1].lower()
    
    if ext not in allowed:
        raise HTTPException(status_code=400, detail="Only PDF, DOCX, TXT allowed.")
    
    session_id = str(uuid.uuid4())
    file_path = f"{UPLOAD_DIR}/{session_id}.{ext}"
    
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    
    text = extract_text(file_path, file.filename)
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from file.")
    
    build_index(text, session_id)
    parsed = parse_resume(text)
    
    return {
        "session_id": session_id,
        "filename": file.filename,
        "parsed": parsed,
        "message": "Resume uploaded and indexed successfully!"
    }