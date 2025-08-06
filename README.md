# Scheduler

A simple scheduling web app that pulls your **Canvas LMS assignments** and displays them in a:

- ✅ To-Do List View
- 🗓️ Calendar View

No login required — just paste your **Canvas access token** to see your assignments!

---

## Features

- 📚 Pulls assignments and upcoming events via Canvas API
- 📆 Calendar grid view of deadlines
- 🧾 To-Do list sorted by due dates
- 💨 Fast and lightweight: React + Vite frontend, FastAPI backend
- 🛡️ Tokens handled securely via backend proxy

---

## Tech Stack

| Layer     | Stack                 |
|-----------|-----------------------|
| Frontend  | React, Vite, Tailwind |
| Backend   | FastAPI (Python)      |
| API       | Canvas LMS API        |

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/canvas-scheduler.git
cd canvas-scheduler
```

---

### 2. Install Dependencies

#### Frontend:

```bash
cd frontend
npm install
```

#### Backend:

```bash
cd ../backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

### 3. Get a Canvas Access Token

1. Go to your Canvas account
2. Click **Account → Settings**
3. Scroll down to **“Approved Integrations”**
4. Click **“+ New Access Token”**
   - Give it a name like `Canvas Scheduler`
   - Set an expiry if you want
5. Copy the token!

---

### 4. Paste Token into Browser Console

In the app, before loading `/todo` or `/calendar`, open DevTools and run:

```js
localStorage.setItem("canvas_token", "your_token_here");
```

> 🔐 This token is only stored in your browser. It is **not uploaded** anywhere.

---

### 5. Run the App

#### Run Backend:

```bash
cd backend
uvicorn main:app --reload
```

#### Run Frontend (in another terminal):

```bash
cd frontend
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 🗺️ Folder Structure

```bash
canvas-scheduler/
├── frontend/          # React + Vite frontend
│   └── src/pages/     # ToDoPage, CalendarPage
├── backend/           # FastAPI backend
│   └── routes/        # /assignments route
├── Makefile           # Easy run commands
├── .gitignore
├── README.md
```

---

## Makefile (Optional)

You can also use `make` to simplify commands:

```bash
make dev             # Run frontend + backend
make backend         # Run just backend
make frontend        # Run just frontend
```



