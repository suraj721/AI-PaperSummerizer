import io
import pypdf

def extract_text_from_pdf(pdf_bytes):
    """Extracts all text from a PDF file efficiently."""
    text = ""
    try:
        reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return text

def chunk_text(text, chunk_size=4000, overlap=200):
    """Splits text into overlapping chunks."""
    chunks = []
    if not text:
        return chunks
        
    start = 0
    text_len = len(text)
    
    while start < text_len:
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += (chunk_size - overlap)
        
    return chunks
