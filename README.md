# 🔥 BLPredictor

Yeah idk, small tool I made, took some inspiration from [this thing here](https://scoresaber.balibalo.xyz/peepee)  

---

## 🚀 Getting Started
Currently im not planning on deploying this (yet), so you can run it by following these steps:


### 🧩 1. Clone the Repository

```shell
git clone https://github.com/underswing/blpredictor
cd blpredictor
```

---

### 📦 2. Install Dependencies
Probably works best using Node.js (v16+). Install dependencies for both frontend and backend:
```shell
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

---

### 🛠️ 3. Run Development Servers
```shell
# Start backend
cd backend
npm run dev
```
In a separate terminal:
```shell
# Start frontend
cd frontend
npm run dev
```

---

### ⚙️ 4. Ports & Config (OPTIONAL)

By default, the app runs on:

- 🛠️ **Backend**: `http://localhost:42004`
- 🎨 **Frontend**: `http://localhost:42003`

If you want to change these, just add a `.env` file to each directory:

#### 🛠 Backend `.env`
```env
PORT=1234
```

#### 🎨 Frontend `.env`
```env
VITE_PORT=5678
VITE_API_URL=http://localhost:1234
```

> ⚠️ Make sure `VITE_API_URL` matches the backend port you set, or things will break and you'll be sad.