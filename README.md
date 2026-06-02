# 🚀 IntelliCV AI — Intelligent AI-Powered Resume Analysis Assistant

IntelliCV AI is a premium, full-stack, AI-powered resume parsing and analysis system. Built with **FastAPI** on the backend and **React + Vite + Tailwind CSS** on the frontend, it integrates **LangChain**, **FAISS Vector Databases**, and **Groq (Llama-3.3-70b-versatile)** to deliver semantic resume search (RAG), ATS compatibility analysis, skill gap mapping, detailed recruiter insights, and automated interview question generation in a beautiful, glassmorphic dashboard interface.

---

## 🌟 Key Features

1. **📄 Multi-Format Resume Parsing**
   * Instant text extraction from **PDF**, **DOCX**, and **TXT** files.
   * Automated key-field mapping (Name, Email, Phone, detected core skills).

2. **💬 RAG-Powered Resume Chat**
   * Talk directly to the resume. Answers are constrained strictly to the context of the uploaded file to prevent hallucinations.
   * Features a sleek chat bubble interface, typing indicators, suggested questions, and quick copy-to-clipboard functionality.

3. **📊 ATS Score & Compatibility Analyzer**
   * Evaluates the resume against ATS standards, returning a percentage compatibility score.
   * Detects matching keywords, highlights missing industry terms, provides actionable layout/content advice, and lists strengths and action verbs.

4. **🎯 Skill Gap Detection**
   * Allows matching the candidate against predefined roles (e.g., *Software Engineer*, *ML Engineer*, *DevOps*, etc.).
   * Calculates a readiness percentage, aligns matching/missing skills, and outlines tailored learning suggestions.

5. **👁️ Recruiter Insights View**
   * Generates a 360-degree candidate summary: experience level evaluation (Junior/Mid/Senior), technical depth rating, strengths/weaknesses breakdown, suitable roles, and a hiring recommendation.

6. **❓ Automated Interview Questions**
   * Auto-generates structured questions categorized into:
     * **HR & Behavioral Questions** (5)
     * **Technical Skill-Based Questions** (5)
     * **Project-Specific Questions** (3)
     * **Viva/Theoretical Questions** (3)

---

## 🛠️ Technology Stack

### Backend
* **FastAPI**: Asynchronous Python web framework for highly performant APIs.
* **LangChain**: Handles document chunking and text splitting processes.
* **FAISS**: In-memory dense vector store used to perform sub-second similarity searches per session.
* **HuggingFace Embeddings**: Utilizes the `sentence-transformers/all-MiniLM-L6-v2` model to generate local vector embeddings.
* **Groq API**: Orchestrates calls to the high-performance `llama-3.3-70b-versatile` LLM.
* **PyPDF & Docx**: Extractor engines for PDF text and Microsoft Word paragraphs.

### Frontend
* **React 19 (Vite)**: Modern, highly responsive single-page application builder.
* **Tailwind CSS**: Utility-first CSS styling framework tailored for modern, glassmorphic UI aesthetics.
* **Framer Motion**: Smooth micro-interactions, page state transitions, and responsive tab switches.
* **Axios**: Standard HTTP client handler for backend communication.

---

## 📂 Repository Structure

```text
intellicv-ai/
├── backend/                  # FastAPI Application
│   ├── routers/              # API Endpoints
│   │   ├── ats.py            # ATS score & analysis handler
│   │   ├── chat.py           # RAG chat handler
│   │   ├── insights.py       # Recruiter & skill-gap insights handler
│   │   ├── questions.py      # Interview questions handler
│   │   └── upload.py         # File parser & vectorizer handler
│   ├── services/             # Core Logic Services
│   │   ├── llm_service.py    # Groq API client config
│   │   ├── parser_service.py # PyPDF/Docx converters
│   │   └── rag_service.py    # FAISS + LangChain RAG pipeline
│   ├── uploads/              # Transient resume store (Git-ignored)
│   ├── .env                  # Configuration variables (Git-ignored)
│   ├── main.py               # Application entrypoint
│   └── requirements.txt      # Python dependencies
│
└── frontend/                 # Vite + React Client
    ├── src/
    │   ├── components/       # Reusable Dashboard Panels
    │   │   ├── ATSPanel.jsx       # ATS report page
    │   │   ├── ChatPanel.jsx      # Chatbot + layout wrapper
    │   │   ├── InsightsPanel.jsx  # Recruiter perspective page
    │   │   ├── QuestionsPanel.jsx # Interview questions page
    │   │   ├── RightPanel.jsx     # Side candidate info tray
    │   │   ├── Sidebar.jsx        # Navigation & page navigation control
    │   │   └── SkillGapPanel.jsx  # Skill gap comparison page
    │   ├── pages/
    │   │   ├── Dashboard.jsx      # Multi-panel main dashboard page
    │   │   └── Landing.jsx        # Interactive entry point with file dropzone
    │   ├── App.jsx           # Main application shell
    │   ├── index.css         # Custom animations & base styles
    │   └── main.jsx          # React hydration target
    ├── tailwind.config.js    # Tailwind configuration
    ├── package.json          # Node dependencies & run scripts
    └── vite.config.js        # Vite bundler parameters
```

---

## 📡 API Reference

All requests and responses communicate via JSON unless otherwise specified.

### 1. Upload & Index Resume
* **Endpoint**: `POST /upload-resume`
* **Format**: `multipart/form-data`
* **Body**: `file` (PDF, DOCX, or TXT)
* **Response**:
  ```json
  {
    "session_id": "uuid-string-xxxx-yyyy",
    "filename": "john_doe_resume.pdf",
    "parsed": {
      "name": "John Doe",
      "email": "johndoe@email.com",
      "phone": "+1 234 567 8900",
      "skills": ["Python", "React", "Docker", "SQL"]
    },
    "message": "Resume uploaded and indexed successfully!"
  }
  ```

### 2. RAG Resume Chat
* **Endpoint**: `POST /ask`
* **Body**:
  ```json
  {
    "session_id": "uuid-string-xxxx-yyyy",
    "question": "What is John Doe's experience with FastAPI?"
  }
  ```
* **Response**:
  ```json
  {
    "question": "What is John Doe's experience with FastAPI?",
    "answer": "According to the resume, John Doe built a microservices backend using FastAPI and Docker in 2024.",
    "session_id": "uuid-string-xxxx-yyyy"
  }
  ```

### 3. ATS Analysis
* **Endpoint**: `POST /ats-analysis`
* **Body**:
  ```json
  {
    "session_id": "uuid-string-xxxx-yyyy"
  }
  ```
* **Response**:
  ```json
  {
    "session_id": "uuid-string-xxxx-yyyy",
    "analysis": "{\n  \"score\": 85,\n  \"keyword_matches\": [\"React\", \"Python\"],\n  \"missing_keywords\": [\"Kubernetes\", \"CI/CD\"],\n  \"suggestions\": [\"Add quantifiable metrics to impact\"],\n  \"action_verbs\": [\"Optimized\", \"Architected\"],\n  \"strengths\": [\"Strong framework usage\"]\n}"
  }
  ```

### 4. Skill Gap Analysis
* **Endpoint**: `POST /skill-gap`
* **Body**:
  ```json
  {
    "session_id": "uuid-string-xxxx-yyyy",
    "target_role": "Software Engineer"
  }
  ```
* **Response**:
  ```json
  {
    "session_id": "uuid-string-xxxx-yyyy",
    "target_role": "Software Engineer",
    "gap_analysis": "{\n  \"matching_skills\": [\"Python\", \"React\"],\n  \"missing_skills\": [\"TypeScript\"],\n  \"readiness_percentage\": 80,\n  \"recommendations\": [\"Learn TypeScript definitions\"]\n}"
  }
  ```

### 5. Recruiter Insights
* **Endpoint**: `POST /recruiter-insights`
* **Body**:
  ```json
  {
    "session_id": "uuid-string-xxxx-yyyy",
    "target_role": "Software Engineer"
  }
  ```
* **Response**:
  ```json
  {
    "session_id": "uuid-string-xxxx-yyyy",
    "target_role": "Software Engineer",
    "insights": "{\n  \"strengths\": [\"Deep backend skills\"],\n  \"weaknesses\": [\"Lacks cloud deployment history\"],\n  \"suitable_roles\": [\"Backend Engineer\", \"Python Developer\"],\n  \"experience_level\": \"Mid\",\n  \"technical_depth\": \"strong\",\n  \"hiring_recommendation\": \"Recommend for technical round\",\n  \"summary\": \"John is an experienced Software Engineer focusing on Python architectures...\"\n}"
  }
  ```

### 6. Interview Questions
* **Endpoint**: `POST /generate-questions`
* **Body**:
  ```json
  {
    "session_id": "uuid-string-xxxx-yyyy"
  }
  ```
* **Response**:
  ```json
  {
    "session_id": "uuid-string-xxxx-yyyy",
    "questions": "{\n  \"hr_questions\": [\"Why did you choose...\"],\n  \"technical_questions\": [\"Explain how FAISS handles...\"],\n  \"project_questions\": [\"Describe the architecture of...\"],\n  \"viva_questions\": [\"What is the difference between...\"]\n}"
  }
  ```

---

## 🚀 Setup & Installation

### Prerequisites
* **Python 3.8+**
* **Node.js 18+** (with npm)
* **Groq API Key** (Get one from [Groq Console](https://console.groq.com/))

### 1. Backend Configuration
Navigate to the `backend` directory:
```bash
cd backend
```

Create a virtual environment and activate it:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory and add your Groq API key:
```env
GROQ_API_KEY=your_groq_api_key_here
```

Start the FastAPI application:
```bash
uvicorn main:app --reload
```
The backend server will run at: `http://127.0.0.1:8000`

---

### 2. Frontend Configuration
Navigate to the `frontend` directory:
```bash
cd ../frontend
```

Install node packages:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
The application will open locally (usually at `http://localhost:5173`).

---

## 🎨 Design System & User Experience
* **Glassmorphic Theme**: Heavy use of translucent panels (`glass` styling) against colorful background blurs with `backdrop-filter: blur(16px)`.
* **Motion Choreography**: Orchestrated with **Framer Motion** for elements slide-ins, layout layout adjustments, and smooth hover expansions.
* **Micro-interactions**: Interactive stats cards, progress charts, tag badges, instant copy capabilities, and real-time loading feedback spinners.

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.
