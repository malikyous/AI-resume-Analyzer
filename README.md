# AI Resume Analyzer

React + Flask application that analyzes PDF resumes using AI — extracts skills, identifies weak points, and generates interview questions. All analyses are saved to a MySQL database.

## Features

- **PDF Resume Upload** — Drag & drop or browse PDF files
- **AI Analysis** — OpenAI-powered deep analysis (with rule-based fallback)
- **Skills Extraction** — Technical and soft skills detected automatically
- **Weak Points** — Constructive feedback on resume gaps
- **Interview Questions** — Tailored questions based on resume content
- **MySQL Storage** — All analyses saved with history panel
- **Netlify Deployment** — Frontend deploys to Netlify; backend on Render

---

## Project Structure

```
├── backend/          # Flask API
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── routes/
│   ├── services/
│   └── utils/
├── frontend/         # React (Vite)
│   ├── src/
│   └── netlify.toml
└── render.yaml       # Backend deployment config
```

---

## Local Setup

### 1. MySQL Database

Create the database:

```sql
CREATE DATABASE resume_analyzer CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or run `backend/schema.sql`.

### 2. Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env   # Mac/Linux
```

Edit `backend/.env`:

```env
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=resume_analyzer
OPENAI_API_KEY=sk-your-key-here
```

Start the API:

```bash
python app.py
```

API runs at `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## Deployment

### Frontend → Netlify

1. Push this repo to GitHub
2. Go to [Netlify](https://netlify.com) → **Add new site** → **Import from Git**
3. Settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
4. Add environment variable:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
5. Deploy

### Backend → Render (Free)

1. Push repo to GitHub
2. Go to [Render](https://render.com) → **New Web Service**
3. Connect repo, set **Root Directory:** `backend`
4. **Build:** `pip install -r requirements.txt`
5. **Start:** `gunicorn app:app --bind 0.0.0.0:$PORT`
6. Add environment variables from `backend/.env.example`

Or use the included `render.yaml` for one-click deploy.

### MySQL (Cloud)

Use any hosted MySQL:

| Provider | Free Tier |
|----------|-----------|
| [PlanetScale](https://planetscale.com) | Yes |
| [Railway](https://railway.app) | Yes |
| [Aiven](https://aiven.io) | Trial |
| [FreeSQLDatabase](https://freesqldatabase.com) | Yes |

Set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` in Render env vars.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/analyze` | Upload PDF & analyze (field: `resume`) |
| GET | `/api/history` | List past analyses |
| GET | `/api/history/:id` | Get single analysis |
| DELETE | `/api/history/:id` | Delete analysis |

---

## Roman Urdu Guide

**Yeh app kya karti hai:**
- PDF resume upload karo
- AI skills nikalta hai
- Weak points batata hai
- Interview questions generate karta hai
- Sab data MySQL mein save hota hai

**Netlify par deploy:**
1. GitHub par code push karo
2. Netlify se connect karo — base folder `frontend` set karo
3. `VITE_API_URL` mein backend ka URL daalo

**Backend Render par chalega** (Netlify sirf frontend host karta hai).

**OpenAI key zaroori hai** best results ke liye — `.env` mein `OPENAI_API_KEY` set karo.

---

## Tech Stack

- **Frontend:** React 18, Vite, Axios, React Dropzone
- **Backend:** Flask, SQLAlchemy, PyPDF2, OpenAI
- **Database:** MySQL
- **Deploy:** Netlify (frontend) + Render (backend)
