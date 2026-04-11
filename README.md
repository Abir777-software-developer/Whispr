# 📨 Whispr — Real-Time Chat with AI Intelligence

**Whispr** is a full-stack, real-time communication platform built on the MERN stack. It differentiates itself through **AI-powered intelligence**, featuring a custom "Catch Me Up" summarizer that helps users stay productive without scrolling through endless unread messages.

---

## 🚀 Core Features in Detail

### 🧠 1. AI-Powered "Catch Me Up" (Smart Summarization)
- **Problem**: In high-traffic group chats, users lose track of long conversations and are forced to scroll through hundreds of messages.
- **Solution**: A custom summarization engine using **Google Gemini 1.5 Flash**.
- **Execution**: When a user returns to a chat, the app detects unread messages and offers an AI-generated summary that highlights key decisions, action items, and topic shifts.
- **Technical Edge**: Uses a strict "Last Seen" tracking system in LocalStorage combined with a filtered backend query to minimize API token usage.

### ⚡ 2. High-Performance Real-Time Engine
- **Core**: Built on **Socket.io** for low-latency, bi-directional communication.
- **Features**: Includes real-time typing indicators, user-specific notifications, and "Join/Leave" room management to minimize unnecessary network broadcasts.
- **Reliability**: Employs **selectedChatCompare** logic in React to prevent state-stale UI bugs during rapid message reception.

### 🔐 3. Multi-Layered Security & Rate Limiting
- **Goal**: Protect the application from DoS attacks and AI resource exhaustion.
- **Limits**: Distinct policies for different route types:
    - **Auth**: Bruteforce protection for login/signup.
    - **Messaging**: Anti-spam limits to keep the chat flow clean.
    - **AI**: Strict quotas on Gemini summarization calls to stay within free-tier limits.
- **Feedback**: Integrated custom error handlers that provide human-readable feedback (e.g., "Summarizer is waking up, try again later").

### 👥 4. Advanced Group & Private Messaging
- **Logic**: Robust group creation and management tools.
- **Search**: Real-time user discovery from the MongoDB database with optimized search queries.

---

## 🛠️ The Technical Stack

### **Frontend**
- **React.js**: Functional components with Hooks for modular, maintainable UI.
- **Chakra UI**: A modern, glassmorphic design system for a premium user experience.
- **Socket.io-client**: Persistent WebSocket connection for real-time events.
- **Axios**: Promised-based HTTP client with global interceptors for clean error handling.
- **Lottie**: High-quality vector animations for typing and loading states.

### **Backend**
- **Node.js & Express**: Event-driven architecture capable of handling thousands of concurrent connections.
- **Socket.io (Server)**: Room-based communication layer.
- **Express-Rate-Limit**: Middleware used to enforce "fair use" policies across all API endpoints.
- **JWT (JSON Web Tokens)**: Secure, stateless user authentication.
- **Mongoose**: Schem-based modeling for MongoDB to ensure data integrity.

### **Database & AI**
- **MongoDB Atlas**: Fully managed NoSQL database for flexible data structures and high-availability.
- **Google Generative AI**: Integrating the `gemini-1.5-flash` model for high-speed, cost-effective natural language processing.


---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Google AI Studio API Key (for Gemini)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/whispr.git
   cd whispr
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```
   Run the backend:
   ```bash
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   Run the frontend:
   ```bash
   npm run dev
   ```

---

## 🛡️ Security & Scalability

- **Rate Limiting**: Custom policies defined in `backend/middleware/rateLimitMiddleware.js` protect the application from resource exhaustion.
- **Clean State Management**: Implemented rigorous Chat ID validation and state sanitization in React to prevent data leakage during rapid chat switching.
- **Event-Driven Architecture**: Optimized for high-concurrency environments using Node.js's non-blocking I/O and Socket.io's efficient room broadcasting.

---

## 📜 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request for new features or bug fixes.

---


