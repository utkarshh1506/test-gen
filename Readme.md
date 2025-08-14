# 🧪 AI-Powered GitHub Test Case Generator

This project is an intelligent developer assistant that integrates with GitHub to generate test case summaries and test code using AI. It supports selecting files from a GitHub repository, summarizing their functionality, and generating corresponding test code with the option to create a Pull Request (PR) with the generated tests.

---

## 🚀 Features

- 🔗 Connect to your GitHub repo  
- 📂 Browse and select files from the repository  
- 🧠 Generate AI-powered test case **summaries**  
- 🧪 Generate **Jest test code** from selected summary  
- 📋 Copy code to clipboard  
- ✅ Create a **Pull Request** with generated test files  

---

## 🛠️ Tech Stack

| Frontend | Backend        | AI Model       | Others              |
|----------|----------------|----------------|---------------------|
| React.js | Node.js/Express| Gemini API     | GitHub API, Tailwind CSS |

---
## 🧰 Folder Structure

```
├── 📁 .git/ 🚫 (auto-hidden)
├── 📁 backend/
│   ├── 📁 config/
│   │   └── 📄 passport.js
│   ├── 📁 controllers/
│   │   ├── 📄 aiController.js
│   │   ├── 📄 authController.js
│   │   └── 📄 githubController.js
│   ├── 📁 node_modules/ 🚫 (auto-hidden)
│   ├── 📁 routes/
│   │   ├── 📄 aiRoutes.js
│   │   ├── 📄 authRoutes.js
│   │   └── 📄 githubRoutes.js
│   ├── 🔒 .env 🚫 (auto-hidden)
│   ├── 🚫 .gitignore
│   ├── 📄 package-lock.json
│   ├── 📄 package.json
│   └── 📄 server.js
└── 📁 client/
    ├── 📁 node_modules/ 🚫 (auto-hidden)
    ├── 📁 public/
    │   └── 🖼️ vite.svg
    ├── 📁 src/
    │   ├── 📁 assets/
    │   │   └── 🖼️ react.svg
    │   ├── 📁 components/
    │   │   ├── 📄 FileSelector.jsx
    │   │   ├── 📄 PRForm.jsx
    │   │   ├── 📄 SummarySelector.jsx
    │   │   └── 📄 TestFlow.jsx
    │   ├── 📁 pages/
    │   │   ├── 📄 Home.jsx
    │   │   ├── 📄 ListFiles.jsx
    │   │   └── 📄 OAuthCallback.jsx
    │   ├── 🎨 App.css
    │   ├── 📄 App.jsx
    │   ├── 🎨 index.css
    │   └── 📄 main.jsx
    ├── 🔒 .env 🚫 (auto-hidden)
    ├── 🚫 .gitignore
    ├── 📖 README.md
    ├── 📄 eslint.config.js
    ├── 🌐 index.html
    ├── 📄 package-lock.json
    ├── 📄 package.json
    ├── 📄 vercel.json
    └── 📄 vite.config.js
```

---

## 🔧 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/ai-test-generator.git
cd ai-test-generator
```

### 2️⃣ Install Frontend

```bash
cd client
npm install
```

### 3️⃣ Install Backend

```bash
cd ../server
npm install
```

### 4️⃣ Configure Environment Variables

Create `.env` file in the backend (`server/.env`):

```env
GITHUB_TOKEN=your_personal_access_token
GEMINI_API_KEY=your_ai_api_key
```

Also update `VITE_BACKEND_URL` in `client/.env`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

### 5️⃣ Run the App

Start backend:

```bash
cd server
node index.js
```

Start frontend:

```bash
cd ../client
npm run dev
```

---

## 🧪 Usage Guide

1. **Login / Authenticate** using GitHub username and token (stored in localStorage)  
2. **Enter the repository name** to connect  
3. **Select files** you want to generate summaries for  
4. Click **"Generate Summary"** to get AI-generated summaries  
5. **Select a summary**, then click **"Generate Code"**  
6. **Copy code** or click **"Create PR"** to push changes to GitHub  

---

## ✅ Example Flow

1. ✅ Select `utils/helpers.js` and `api/index.js`  
2. 🧠 Click "Generate Summary"  
3. 📋 Pick the best summary  
4. 🧪 Click "Generate Code"  
5. 🖱️ Click "Copy Code" or "Create PR"  

---

## 📌 Requirements

- Node.js v18+
- GitHub Personal Access Token with `repo` scope
- API Key for Gemini or OpenAI model

---

## 📜 License

MIT License © 2025 Utkarsh Singh

---

## 🤝 Contribution

Pull requests and feature requests are welcome. If you'd like to contribute, please fork the repo and submit a PR.
