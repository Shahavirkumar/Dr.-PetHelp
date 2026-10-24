# PetHelp AI 🐾

PetHelp AI is an AI-powered pet-care assistant that gives pet owners personalized,
general guidance on diet, hydration, grooming, hygiene, exercise, and common symptoms —
while always encouraging proper veterinary care when it's actually needed.

> ⚠️ **Disclaimer:** PetHelp AI is not a licensed veterinarian. It does not diagnose
> conditions or prescribe medication. Always consult a qualified veterinarian for
> medical concerns, and seek immediate emergency care for serious symptoms.

---

## Tech Stack

**Frontend:** React.js, Vite, Tailwind CSS, React Router, Axios, Lucide React
**Backend:** Python, FastAPI, LangChain, langchain-groq
**AI Model:** `openai/gpt-oss-120b` via Groq API
**Database:** MongoDB

---

## Project Structure

```text
PetHelp/
├── frontend/     → React + Vite app
├── backend/      → FastAPI app
├── README.md
└── .gitignore
```

See `frontend/src/` and `backend/app/` for detailed folder breakdowns.

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11 (recommended — newer versions like 3.13/3.14 can have package build issues)
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register))
- A Groq API key ([console.groq.com](https://console.groq.com))

### 1. Backend Setup

**Windows (CMD):**
```cmd
cd backend
py -3.11 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

**Mac/Linux:**
```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Open `.env` and fill in your real `MONGODB_URI`, `JWT_SECRET`, and `GROQ_API_KEY`.

Then run the backend:
```
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000` (or the next available port — check the
terminal output). Interactive API docs at `http://localhost:8000/docs`.

> ⚠️ **Windows note:** every time you open a *new* terminal window, you must
> reactivate the virtual environment (`venv\Scripts\activate`) before running
> `uvicorn` or `pip` commands — it does not stay active across terminals.

### 2. Frontend Setup

**Windows (CMD):**
```cmd
cd frontend
npm install
copy .env.example .env
```

**Mac/Linux:**
```bash
cd frontend
npm install
cp .env.example .env
```

Open `.env` and confirm `VITE_API_BASE_URL` matches the port your backend is
actually running on (see backend terminal output — it may be `8000` or `8001`
if `8000` was already in use).

Then run the frontend:
```
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable          | Description                              |
|-------------------|-------------------------------------------|
| `MONGODB_URI`     | MongoDB connection string                 |
| `DATABASE_NAME`   | Database name (default: `pethelp_ai`)     |
| `JWT_SECRET`      | Secret key used to sign JWT tokens        |
| `JWT_EXPIRY_HOURS`| Token expiry in hours (default: `168`)    |
| `GROQ_API_KEY`    | API key for the Groq LLM                  |
| `ALLOWED_ORIGINS` | Comma-separated frontend origins for CORS |

### Frontend (`frontend/.env`)

| Variable              | Description                       |
|-----------------------|------------------------------------|
| `VITE_API_BASE_URL`   | Base URL of the backend API (must match the backend's actual port) |

> Never commit real `.env` files. Only `.env.example` files are tracked in git.

---

## Core Features

- 🔐 JWT authentication (register, login, protected routes)
- 🐕 Pet profiles (species, breed, age, weight, allergies, medical conditions, etc.)
- 💬 AI chat with personalized, profile-aware responses
- 🗂️ Persistent chat history (create, rename, delete conversations)
- 📌 Save useful AI recommendations by category
- 🚨 Emergency symptom detection with clear vet-care guidance

---

## Safety Principles

PetHelp AI is designed to **never**:
- Claim to be a licensed veterinarian
- Give a definitive medical diagnosis
- Prescribe medication or dosages
- Recommend human medicine for pets
- Encourage delaying emergency veterinary care

For emergency symptoms (difficulty breathing, seizures, severe bleeding, suspected
poisoning, collapse, etc.), the AI always directs the user to seek immediate
veterinary care first.

---

## Troubleshooting

| Problem | Likely fix |
|---|---|
| `uvicorn: not recognized` | Virtual environment isn't activated in this terminal — run `venv\Scripts\activate` |
| `numpy`/build errors during `pip install` | Python version too new — use Python 3.11 |
| `password cannot be longer than 72 bytes` | `bcrypt` version conflict with `passlib` — ensure `bcrypt==4.0.1` or use direct `bcrypt` calls (not `passlib`) |
| Frontend shows "Unable to reach the server" | Backend port and `VITE_API_BASE_URL` in `frontend/.env` don't match, or backend isn't running |
| Blank page after an action | Check the browser DevTools **Console** tab for a red error — it names the exact broken file/line |

---

## License

This project is for educational/personal use. Add a license of your choice here.