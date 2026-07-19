from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import requests
import re
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Allow frontend to access the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific domain for production
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(file_path):
    with open(file_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        return "".join([page.extract_text() for page in reader.pages])

def clean_text(text):
    return re.sub(r'[^\x00-\x7F]+', '', text)

@app.post("/analyze")
async def analyze(file: UploadFile = File(...), question: str = Form(...)):
    with open("temp.pdf", "wb") as f:
        f.write(await file.read())

    raw_text = extract_text_from_pdf("temp.pdf")
    cleaned = clean_text(raw_text)

    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "deepseek-ai/deepseek-r1-0528-qwen3-8b",
        "messages": [
            {"role": "system", "content": "Answer strictly based on the uploaded document."},
            {"role": "user", "content": f"Document:\n{cleaned}\n\nQuestion: {question}"}
        ]
    }

    try:
        res = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
        res.raise_for_status()
        answer = res.json()["choices"][0]["message"]["content"]
        return {"answer": answer}
    except Exception as e:
        return {"error": str(e)}
