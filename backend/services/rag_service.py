from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from services.llm_service import ask_llm

# Load embedding model once
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# In-memory store per session
vector_stores = {}

def build_index(text: str, session_id: str):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = splitter.split_text(text)
    vector_stores[session_id] = FAISS.from_texts(chunks, embeddings)

def query_resume(question: str, session_id: str) -> str:
    if session_id not in vector_stores:
        return "No resume found. Please upload a resume first."
    
    docs = vector_stores[session_id].similarity_search(question, k=4)
    context = "\n\n".join([d.page_content for d in docs])
    return ask_llm(context, question)

def get_full_context(session_id: str) -> str:
    if session_id not in vector_stores:
        return ""
    docs = vector_stores[session_id].similarity_search("resume summary", k=10)
    return "\n\n".join([d.page_content for d in docs])