from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, chat, ats, questions, insights
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="IntelliCV AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(chat.router)
app.include_router(ats.router)
app.include_router(questions.router)
app.include_router(insights.router)

@app.get("/")
def root():
    return {"message": "IntelliCV AI Backend Running!"}