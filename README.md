# Fake Job Post Detection System

A full-stack web application that uses a Bi-LSTM deep learning model to detect whether a job posting is Real or Fake.

## Features

- **AI-Powered Detection**: Real-time analysis of job descriptions.
- **Glassmorphism UI**: Modern, responsive React frontend with TailwindCSS.
- **Secure Authentication**: JWT-based login and registration.
- **History Tracking**: Saves all predictions for user review.
- **Role-Based Access**: User and Admin capabilities.
- **Production Ready**: Dockerized backend and frontend with MongoDB.

## Tech Stack

- **Backend**: FastAPI, Python, MongoDB (Beanie/Motor), TensorFlow/Keras.
- **Frontend**: React (Vite), TailwindCSS, Framer Motion.
- **Database**: MongoDB.
- **Deployment**: Docker Compose.

## Prerequisites

- Docker & Docker Compose
- Python 3.10+ (for local dev)
- Node.js 18+ (for local dev)

## Quick Start (Docker)

1.  **Clone the repository:**
    ```bash
    git clone <repo-url>
    cd fake-job-detection
    ```

2.  **Add ML Model:**
    Place your trained model files in `backend/ml/`:
    - `model.h5`
    - `tokenizer.pickle`
    *(The system will use a mock predictor if files are missing)*

3.  **Run with Docker Compose:**
    ```bash
    docker-compose up --build
    ```

4.  **Access the App:**
    - Frontend: [ ](http://localhost:5173) (or mapped port)
    - Backend API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Local Development Setup

### Backend

**Prerequisite:** Ensure you have a MongoDB instance running (locally or cloud). Update `.env` or `app/core/conf.py` with your `MONGODB_URL`.

```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Usage

**POST** `/api/v1/predict/`
```json
{
  "job_description": "We are looking for a data scientist..."
}
```

**Response:**
```json
{
  "prediction": "Real",
  "confidence": 0.98,
  "created_at": "2024-02-14T12:00:00Z"
}
```
