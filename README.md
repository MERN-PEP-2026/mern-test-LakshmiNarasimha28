[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ZroWLq75)
# -mern-test-template

# 📚 Student Course Management System (MERN Stack)

A full-stack MERN application developed as part of the MERN Fullstack Test.

This project allows users to register, login, and manage courses securely using JWT authentication.

---

## 🧠 Project Overview

The Student Course Management System is a full-stack application where authenticated users can:

- Register an account
- Login securely
- Create new courses
- View all available courses
- Delete courses (only created by them)

The backend is built using Node.js, Express, and MongoDB.  
The frontend is built using React and connected via Axios.

---

# 🛠 Tech Stack

## 🔹 Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (Authentication)
- bcrypt (Password Hashing)
- CORS
- dotenv

## 🔹 Frontend
- React (Vite)
- React Router DOM
- Axios

---

# 📁 Project Structure

```
mern-test-LakshmiNarasimha28/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│
└── README.md
```

---

# 🔐 Authentication APIs

### 📝 Register User
```
POST /api/auth/register
```

### 🔑 Login User
```
POST /api/auth/login
```

Returns a JWT token that must be used for protected routes.

---

# 📘 Course APIs (Protected)

These routes require a valid JWT token.

### ➕ Create Course
```
POST /api/courses
```

### 📄 Get All Courses
```
GET /api/courses
```

### ❌ Delete Course
```
DELETE /api/courses/:id
```

Only the course creator is allowed to delete the course.

---

# ⚙ Backend Setup Instructions

## 1️⃣ Install Dependencies

```bash
cd backend
npm install
```

## 2️⃣ Create Environment Variables

Create a `.env` file inside the backend folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## 3️⃣ Run Backend Server

```bash
npm run dev
```

Backend will run on:
```
http://localhost:5000
```

---

# 🎨 Frontend Setup Instructions

## 1️⃣ Install Dependencies

```bash
cd frontend
npm install
npm install axios react-router-dom
```

## 2️⃣ Run Frontend

```bash
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

---

# 🔄 Application Flow

1. User registers.
2. User logs in.
3. JWT token is stored in localStorage.
4. Axios automatically attaches token to protected API requests.
5. User can create, view, and delete courses.

---

# 🧪 Testing

- Backend APIs tested using Postman.
- Authentication verified using JWT.
- MongoDB connection verified.
- Full frontend and backend integration tested.

---

# 📌 Assignment Submission Checklist

✔ Backend working  
✔ Frontend working  
✔ MongoDB connected  
✔ Authentication implemented  
✔ Protected routes implemented  
✔ Course CRUD implemented  
✔ Multiple commits pushed to GitHub  
✔ Repository not renamed  
✔ All code pushed before deadline  

---

# 👤 Author

Lakshmi Narasimha  

---

# 📜 Important Notes

- Project completed individually.
- Followed proper development order:
  - Setup backend
  - Create models
  - Implement APIs
  - Test with Postman
  - Setup frontend
  - Connect frontend with backend
  - Final testing

---

# 🚀 Future Improvements

- Edit Course Feature
- Pagination
- Role-Based Access Control
- Deployment (Render / Vercel)
- UI Improvements using Tailwind
