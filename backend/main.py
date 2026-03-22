from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn

from utils.pdf_processor import extract_text_from_pdf
from utils.llm_client import analyze_paper_content, chat_with_paper

app = FastAPI(title="AI Research Paper Analyzer")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for demo (should be a database in production)
paper_store = {}

class ChatRequest(BaseModel):
    paper_id: str
    question: str

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        content = await file.read()
        text = extract_text_from_pdf(content)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
            
        analysis = analyze_paper_content(text)
        
        # Store text for chat context
        paper_id = file.filename
        paper_store[paper_id] = text
        
        return {
            "paper_id": paper_id,
            "analysis": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(request: ChatRequest):
    if request.paper_id not in paper_store:
        raise HTTPException(status_code=404, detail="Paper context not found. Please upload again.")
        
    context = paper_store[request.paper_id]
    answer = chat_with_paper(request.question, context)
    
    return {"answer": answer}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
