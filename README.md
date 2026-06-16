# PlayTube Frontend

A modern YouTube-inspired video streaming platform built with React and Vite. PlayTube allows users to browse videos, manage channels, interact through comments, and communicate in real-time using Socket.IO.

## 🚀 Features

- User Authentication
  - Login & Signup
  - JWT-based authentication
  - Persistent login state

- Video Platform
  - Browse videos
  - Watch video details
  - Channel pages
  - Video recommendations

- User Interaction
  - Like videos
  - Comment on videos
  - Reply to comments
  - Subscribe to channels

- Real-time Features
  - Socket.IO integration
  - Real-time chat support

- Dashboard
  - Manage uploaded videos
  - Channel analytics
  - Account management

- Responsive UI
  - Mobile-friendly design
  - Modern user interface
  - Dark theme support

---

## 🛠️ Tech Stack

### Frontend

- React 19
- React Router DOM
- Vite
- Axios
- Tailwind CSS v4
- Socket.IO Client
- React Hot Toast
- Lucide React Icons

---

## 📂 Project Structure

```text
src/
│
├── assets/
├── components/
│   ├── auth/
│   ├── comments/
│   ├── dashboard/
│   ├── channel/
│   └── ...
│
├── context/
├── hooks/
├── pages/
├── routes/
├── services/
├── utils/
│
├── App.jsx
└── main.jsx
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=BACKEND_BASE_URL
```


---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/Prasanta-Mondal76/play-tube-frontend.git
```

Move into the project:

```bash
cd play-tube-frontend
```

Install dependencies:

```bash
npm install
```

---

## 🏃 Running Locally

Start development server:

```bash
npm run dev
```

Application will be available at:

```text
http://localhost:5173
```

---

## 🔨 Build for Production

Generate production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## 🚀 Deployment

### Vercel

1. Import repository into Vercel.
2. Set Environment Variables:

```env
VITE_API_URL=BACKEND_BASE_URL
```

3. Deploy.

---

## 🔗 Backend Repository

Backend GitHub:

```text
https://github.com/Prasanta-Mondal76/playtube-backend
```

Backend Deployment:

```text
https://playtube-backend-puyh.onrender.com
```

---

## 👨‍💻 Author

**Prasanta Mondal**

GitHub:
https://github.com/Prasanta-Mondal76

---

## 📜 License

This project is created for learning, portfolio, and educational purposes.