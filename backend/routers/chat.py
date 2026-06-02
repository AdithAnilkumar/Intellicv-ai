from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.rag_service import query_resume

router = APIRouter()

class ChatRequest(BaseModel):
    session_id: str
    question: str

@router.post("/ask")
async def ask_question(request: ChatRequest):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    
    answer = query_resume(request.question, request.session_id)
    
    return {
        "question": request.question,
        "answer": answer,
        "session_id": request.session_id
    }