# AI Research Paper Analyzer

A full-stack application to analyze research papers using FastAPI, React, and OpenAI.

## Features
- **PDF Analysis**: Extracts text and provides a structured summary (Summary, Methodology, Results, etc.).
- **Interactive Chat**: Ask questions about the specific paper and get contextual answers.
- **Modern UI**: Sleek dark mode with glassmorphism aesthetics.
- **Intelligent Processing**: Handles long papers by focusing on key content chunks.

## Tech Stack
- **Frontend**: React (Vite), React Markdown, Vanilla CSS.
- **Backend**: FastAPI, `pdfplumber`, `openai`, `pydantic`.
- **LLM**: GPT-4o.

## Prerequisites
- Python 3.9+
- Node.js 16+
- OpenAI API Key

## Setup Instructions

### 1. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and install dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Create a `.env` file and add your OpenAI API key:
   ```bash
   cp .env.example .env
   # Edit .env and set OPENAI_API_KEY
   ```
4. Run the backend server:
   ```bash
   python3 main.py
   ```
   The backend will be available at `http://localhost:8000`.

### 2. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.


## Deployment

You can easily deploy this full-stack app using [Render](https://render.com).

### Quick Deploy (Render)
1. Fork or push this repository to your GitHub account.
2. Sign up/Log in to Render.
3. Go to the **Blueprints** tab and click **New Blueprint Instance**.
4. Connect your GitHub repository.
5. Render will automatically read the `render.yaml` file and set up both the backend (Web Service) and frontend (Static Site).
6. In the Render dashboard, go to the Backend service's Environment variables and set your `OPENAI_API_KEY`.

Alternatively, you can deploy the `backend` folder to any service that supports Python (Heroku, Railway, AWS) using the provided `Procfile` and deploy the `frontend` statically (Netlify, Vercel).

## Usage
1. Open the web app.
2. Upload a research paper PDF.
3. Wait for the analysis to complete.
4. Review the structured insights and use the chat panel to ask follow-up questions.
