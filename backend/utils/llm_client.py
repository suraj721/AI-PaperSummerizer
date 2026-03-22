import os
from openai import OpenAI
from dotenv import load_dotenv

def get_client():
    load_dotenv(override=True)
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or "your-api-key-here" in api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set with a real key in .env")
    return OpenAI(api_key=api_key)

def analyze_paper_content(content):
    """Sends paper content to OpenAI for structured analysis."""
    client = get_client()
    # For very long papers, we might only send the first few chunks or a summary of chunks
    # For this implementation, we'll focus on the first 15000 chars to stay within common context limits
    # but a better way is to summarize chunks (omitted for brevity in initial version)
    snippet = content[:15000] 
    
    system_prompt = """
    You are an expert AI Research Assistant. Analyze the provided research paper text and return a structured analysis.
    Your response must be in Markdown format with the following sections:
    - Summary
    - Core Problem
    - Methodology
    - Key Results
    - Limitations
    - Future Improvements
    """
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Analyze this research paper:\n\n{snippet}"}
        ],
        temperature=0.2
    )
    
    return response.choices[0].message.content

def chat_with_paper(question, context):
    """Answers questions based on the paper context."""
    client = get_client()
    snippet = context[:15000]
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an AI assistant helping a researcher understand a paper. Use the provided context to answer the question."},
            {"role": "user", "content": f"Context: {snippet}\n\nQuestion: {question}"}
        ],
        temperature=0
    )
    
    return response.choices[0].message.content
