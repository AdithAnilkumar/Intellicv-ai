from fastapi import APIRouter
from pydantic import BaseModel
from services.rag_service import get_full_context
from services.llm_service import generate_with_prompt

router = APIRouter()

class SessionRequest(BaseModel):
    session_id: str

@router.post("/generate-questions")
async def generate_questions(request: SessionRequest):
    context = get_full_context(request.session_id)
    
    prompt = """Based on this resume, generate interview questions as JSON:
    - hr_questions (5 HR/behavioral questions)
    - technical_questions (5 technical questions based on their skills)
    - project_questions (3 questions about their projects)
    - viva_questions (3 conceptual/theory questions)
    Only return valid JSON, no extra text."""
    
    result = generate_with_prompt(context, prompt)
    
    return {
        "session_id": request.session_id,
        "questions": result
    }