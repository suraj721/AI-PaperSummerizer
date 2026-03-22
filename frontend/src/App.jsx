import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

const API_BASE = "http://localhost:8000";


function App() {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [paperId, setPaperId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [chatting, setChatting] = useState(false);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef();

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    if (uploadedFile.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setFile(uploadedFile);
    setAnalyzing(true);
    setAnalysis(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      setAnalysis(data.analysis);
      setPaperId(data.paper_id);
      setChatMessages([{ role: 'assistant', text: "Hello! I've analyzed the paper. Feel free to ask me anything about it!" }]);
    } catch (err) {
      setError(`Analysis failed: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!question.trim() || chatting) return;

    const userMsg = { role: 'user', text: question };
    setChatMessages(prev => [...prev, userMsg]);
    setQuestion("");
    setChatting(true);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paper_id: paperId, question: userMsg.text }),
      });

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', text: data.answer }]);
    } catch (err) {
      setError(`Chat failed: ${err.message}`);
    } finally {
      setChatting(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1 className="title">AI Research Paper <span className="highlight">Analyzer</span></h1>
        <p className="subtitle">Upload complex papers and get instant, structured insights.</p>
      </header>

      <main>
        {!analysis && !analyzing && (
          <div className="upload-section glass-card" onClick={() => fileInputRef.current.click()}>
            <div className="upload-icon">📄</div>
            <h3>Click to upload Research Paper</h3>
            <p>PDF only, max 20MB</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              style={{ display: 'none' }} 
              accept=".pdf"
            />
          </div>
        )}

        {analyzing && (
          <div className="loading-section glass-card">
            <div className="spinner"></div>
            <h3 className="loading-dots">Analyzing PDF</h3>
            <p>Extracting text and generating insights using GPT-4o...</p>
          </div>
        )}

        {error && <div className="error-msg glass-card">{error}</div>}

        {analysis && (
          <div className="content-grid">
            <section className="analysis-panel glass-card">
              <h2>Deep Analysis</h2>
              <div className="markdown-content">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            </section>

            <section className="chat-panel glass-card">
              <h2>Chat with Paper</h2>
              <div className="chat-box">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`message ${msg.role}`}>
                    <small>{msg.role === 'user' ? 'You' : 'Assistant'}</small>
                    <p>{msg.text}</p>
                  </div>
                ))}
                {chatting && <div className="message assistant loading-dots">Thinking</div>}
              </div>
              <form onSubmit={handleChat} className="chat-input-area">
                <input 
                  value={question} 
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question about the methodology..." 
                />
                <button type="submit" disabled={chatting}>Send</button>
              </form>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
