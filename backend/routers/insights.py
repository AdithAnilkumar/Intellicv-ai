from fastapi import APIRouter
from pydantic import BaseModel
from services.rag_service import get_full_context
from services.llm_service import generate_with_prompt

router = APIRouter()

class InsightRequest(BaseModel):
    session_id: str
    target_role: str = "Software Engineer"

@router.post("/recruiter-insights")
async def recruiter_insights(request: InsightRequest):
    context = get_full_context(request.session_id)
    
    prompt = f"""As a senior recruiter, analyze this resume for the role of {request.target_role}.
    Return a JSON response with:
    - strengths (list)
    - weaknesses (list)
    - suitable_roles (list)
    - experience_level (Junior/Mid/Senior)
    - technical_depth (weak/moderate/strong)
    - hiring_recommendation (string)
    - summary (2-3 sentence professional summary)
    Only return valid JSON, no extra text."""
    
    result = generate_with_prompt(context, prompt)
    
    return {
        "session_id": request.session_id,
        "target_role": request.target_role,
        "insights": result
    }

@router.post("/skill-gap")
async def skill_gap(request: InsightRequest):
    context = get_full_context(request.session_id)
    
    prompt = f"""Compare this resume against the role: {request.target_role}.
    Return JSON with:
    - matching_skills (list)
    - missing_skills (list)
    - readiness_percentage (number)
    - recommendations (list of learning suggestions)
    Only return valid JSON, no extra text."""
    
    result = generate_with_prompt(context, prompt)
    
    return {
        "session_id": request.session_id,
        "target_role": request.target_role,
        "gap_analysis": result
    }