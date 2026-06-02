import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()  # This must run before Groq client is created

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are IntelliCV AI, an intelligent resume analysis assistant.
Answer questions ONLY using the uploaded resume context provided.
Do not hallucinate or generate unsupported claims.
If information is unavailable, clearly say: 'Information not found in the uploaded resume.'
Be concise, professional, and recruiter-friendly."""

def ask_llm(context: str, question: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Resume Context:\n{context}\n\nQuestion: {question}"}
        ],
        max_tokens=1024,
        temperature=0.3,
    )
    return response.choices[0].message.content

def generate_with_prompt(context: str, instruction: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Resume Context:\n{context}\n\nInstruction: {instruction}"}
        ],
        max_tokens=2048,
        temperature=0.5,
    )
    return response.choices[0].message.content