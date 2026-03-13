# ArvyaX Journal

An AI-powered nature journal. Users complete immersive nature sessions, write journal entries, and get emotion analysis powered by Llama 3.1 8B via Groq.

---

## Project Structure

```
ArvyaX/
├── arvyax-fastapi/     → Python FastAPI backend
├── frontend/           → Next.js frontend
├── .gitignore
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python, FastAPI, SQLAlchemy (async) |
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Database | PostgreSQL (Neon DB) |
| LLM | Llama 3.1 8B Instant via Groq API |
| Auth | JWT stored in httpOnly cookie |

---

## Prerequisites

- Python 3.11+
- Node.js 18+
- A [Neon DB](https://neon.tech) PostgreSQL database
- A [Groq](https://console.groq.com) API key

---

## 1. Backend Setup

```bash
cd arvyax-fastapi
```

**Create and activate virtual environment:**
```bash
python3.11 -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows
```

**Install dependencies:**
```bash
pip install -r requirements.txt
```

**Create `.env` file:**
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
DATABASE_URL=postgresql+asyncpg://user:password@ep-xxxx.neon.tech/dbname?ssl=require
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
SECRET_KEY=any_random_secret_string
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

this is very important if you are using online db service.

>  For Neon DB — use `postgresql+asyncpg://` prefix and `?ssl=require` at the end. Remove `sslmode=` and `channel_binding=` parameters if present.

**Start the backend:**
```bash
uvicorn app.main:app --reload --port 8000
```

Backend runs at `http://localhost:8000`
Swagger docs at `http://localhost:8000/docs`

---

## 2. Frontend Setup

```bash
cd frontend
```

**Install dependencies:**
```bash
npm install
```

**Create `.env` file:**
```bash
cp .env.example .env.local
```

`.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Start the frontend:**
```bash
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login → sets httpOnly cookie |
| POST | `/api/auth/logout` | Clear cookie |

### Journal
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/journal` | Create journal entry |
| GET | `/api/journal/{userId}` | Get all entries |
| POST | `/api/journal/analyze` | Analyze text emotion |
| GET | `/api/journal/insights/{userId}` | Get mental wellness stats |

---

## Example Requests

**Register:**
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "username": "naturelover",
  "password": "secret123"
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Create Journal Entry:**
```json
POST /api/journal
{
  "userId": "1",
  "ambience": "forest",
  "text": "I felt calm today after listening to the rain."
}
```

**Analyze:**
```json
POST /api/journal/analyze
{
  "text": "I felt peaceful and relaxed near the ocean waves."
}
```

**Response:**
```json
{
  "emotion": "calm",
  "keywords": ["peaceful", "ocean", "relaxed"],
  "summary": "User experienced deep relaxation near the ocean."
}
```

---

## Bonus Features

-  Analysis caching (5 min TTL, MD5-keyed)
-  Rate limiting (10 req/min on analyze, 60 req/min global)
-  httpOnly cookie authentication
-  Auto table creation on startup (no migrations needed)

---

## Health Check

```bash
curl http://localhost:8000/health
# {"status": "ok"}
```