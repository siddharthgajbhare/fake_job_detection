# 🛡️ Fake Job Post Detection System

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An advanced, full-stack web application designed to identify fraudulent job postings using state-of-the-art **Bi-LSTM** (Bidirectional Long Short-Term Memory) neural networks. This system helps protect job seekers by analyzing job descriptions with high accuracy and confidence.

---

## ✨ Key Features

- **🧠 AI-Powered Analysis**: Real-time detection using deep learning models trained on massive datasets.
- **📱 Fully Responsive UI**: Premium glassmorphism design that works seamlessly on Desktop, Tablet, and Mobile.
- **🔒 Secure Architecture**: JWT-based authentication with protected routes and encrypted password hashing.
- **📊 Prediction History**: Track and review previous detection results at a glance.
- **⚡ Performance-Driven**: Built with **FastAPI** for high-concurrency and **Vite** for lightning-fast frontend delivery.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: TailwindCSS & Framer Motion
- **Icons**: Lucide React
- **Client**: Axios with persistent auth interceptors

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Database**: MongoDB (Beanie ODM & Motor)
- **Machine Learning**: TensorFlow CPU, Pandas, NumPy
- **Security**: Python-jose (JWT), Passlib (Bcrypt)

---

## 🚀 Deployment

The project is structured for easy deployment using **Docker** and modern hosting providers.

- **Frontend**: Optimized for [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
- **Backend**: Containerized and ready for [Render](https://render.com) or [Railway](https://railway.app).
- **Database**: Recommended to use [MongoDB Atlas](https://www.mongodb.com/atlas) cluster for production.

---

## 🔧 Installation & Setup

### 1. Prerequisites
- Docker & Docker Compose
- Node.js 18+ & Python 3.10+ (for local development)

### 2. Local Environment Setup

#### **Clone the Project**
```bash
git clone https://github.com/your-username/fake-job-detection.git
cd fake-job-detection
```

#### **Backend Setup**
1. Add your ML model files to `backend/ml/` (`model.h5` and `tokenizer.pickle`).
2. Create `backend/.env` based on `backend/.env.example`.
3. Start the server:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

#### **Frontend Setup**
1. Create `frontend/.env.production` with your backend URL.
2. Install and run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 🐳 Docker Deployment

Run the entire stack (Frontend, Backend, and MongoDB) in one command:
```bash
docker-compose up --build
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Sameer** - *Initial Work & Architecture*
