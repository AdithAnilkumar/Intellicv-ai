from fastapi import APIRouter
from pydantic import BaseModel
from services.rag_service import get_full_context
from services.llm_service import generate_with_prompt

router = APIRouter()

class SessionRequest(BaseModel):
    session_id: str

@router.post("/ats-analysis")
async def ats_analysis(request: SessionRequest):
    context = get_full_context(request.session_id)
    
    prompt = """Analyze this resume for ATS compatibility and return a JSON response with:
    - score (number out of 100)
    - keyword_matches (list of found keywords)
    - missing_keywords (list of missing important keywords)
    - suggestions (list of improvement tips)
    - action_verbs (list of action verbs found)
    - strengths (list of resume strengths)
    Only return valid JSON, no extra text."""
    
    result = generate_with_prompt(context, prompt)
    
    return {
        "session_id": request.session_id,
        "analysis": result
    }