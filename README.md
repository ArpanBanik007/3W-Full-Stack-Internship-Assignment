# 3W Full Stack Internship Assignment 🚀

A **production-ready MERN stack application** built as part of the **3W Full Stack Internship Assignment**.
The project demonstrates real-world practices like authentication with cookies, protected routes, file uploads, Redux state management, and cloud deployment.

---

## 🌐 Live Demo

* **Frontend (Vercel):** [https://3-w-full-stack-internship-assignmen.vercel.app](https://3-w-full-stack-internship-assignmen.vercel.app)
* **Backend (Render):** [https://threew-full-stack-internship-assignment.onrender.com](https://threew-full-stack-internship-assignment.onrender.com)

---

## 🛠 Tech Stack

### Frontend

* React (Vite)
* Redux Toolkit
* Axios (withCredentials)
* Bootstrap / CSS
* Vercel (Deployment)

### Backend

* Node.js
* Express.js
* MongoDB (Atlas)
* Mongoose
* JWT Authentication (Access + Refresh Token)
* Cookie-based Auth
* Cloudinary (File Uploads)
* Render (Deployment)

---

## ✨ Features

* 🔐 User Authentication (Login / Signup / Logout)
* 🍪 Secure Cookie-based JWT Auth
* 🧑 User Profile & My Details API
* 📝 Create Post with Text & Image Upload
* 👥 Follow / Unfollow System
* 📦 Redux Toolkit for State Management
* 🔒 Protected Routes (Backend)
* 🌍 Production-ready CORS & ENV setup

---

## 📁 Project Structure

```
3W-Full-Stack-Internship-Assignment/
│
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   └── index.js
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── slices/
│   │   ├── utils/axios.js
│   │   └── main.jsx
│   └── vite.config.js
│
└── README.md
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=8001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

### Frontend (.env)

```env
VITE_API_BASE_URL=https://threew-full-stack-internship-assignment.onrender.com
```

---

## 🚀 Deployment Details

### Backend (Render)

* Deployed as **Web Service**
* CORS configured for Vercel domain
* Cookies enabled with `SameSite=None` & `Secure=true`

### Frontend (Vercel)

* Framework: **Vite + React**
* Root Directory: `Frontend`
* Build Command: `npm run build`
* Output Directory: `dist`
* Environment variables added via Vercel Dashboard

---

## 🧪 How Authentication Works

1. User logs in
2. Backend sets **HttpOnly cookies** (accessToken & refreshToken)
3. Frontend sends requests with `withCredentials: true`
4. Protected routes verify JWT from cookies
5. Logout clears cookies securely

---

## 📌 Status

✅ Backend live on Render
✅ Frontend deployed on Vercel
✅ Full MERN Stack
✅ Production-ready setup

---

## 👨‍💻 Author

**Arpan Banik**
Full Stack Developer (MERN)

---

## 📄 License

This project is created for internship evaluation & learning purposes.
