# Complaint Management System

A premium, AI-powered full-stack platform designed to automate, track, and manage citizen and customer complaints with advanced analytical capabilities. The application features a beautiful, clean, light-themed responsive React interface paired with a secure, robust Node.js/Express RESTful API backend integrated with MongoDB and Google Gemini 2.0 Flash.

---

## 🌟 Key Features

1. **Authentication & Security**
   - Secure login & signup workflows.
   - Password encryption using **bcrypt** (10 rounds).
   - Session protection via **JSON Web Tokens (JWT)**.
   - Fully protected API routes enforcing authentication checks.

2. **Smart Complaint Registration**
   - Custom fields: Name, Email, Title, Description, Category, Location, and Status.
   - Built-in input sanitisation and validation.

3. **Intelligent Tracking & Filtering**
   - Live search by Location (case-insensitive regular expression matching).
   - Dynamic sorting & filtering by Category.
   - Interactive administrative status updates.
   - Dashboard stats summarizing Pending, In Progress, and Resolved complaints.

4. **Gemini 2.0 Flash AI Integration**
   - **Urgency Detection**: Automatically categorizes priority level (`Low`, `Medium`, `High`, or `Critical`).
   - **Department Recommendations**: Intelligently assigns complaints (e.g. suggests `Water department` for leakage issues, `Sanitation department` for waste).
   - **Auto-generated Responses**: Dynamically drafts personalized, polite responses for the user.
   - **Summarization**: Distills lengthy descriptions into a concise 1-2 sentence overview.

---

## 📁 Project Directory Structure

```text
AI_BGM/
├── AI_BGM/                     # React Vite Frontend Application
│   ├── public/                 # Static Assets (custom logo)
│   ├── src/
│   │   ├── api/                # API Client Configurations (Axios)
│   │   ├── components/         # Shared Layout & Structural Components
│   │   ├── pages/              # Module Pages (Login, Registration, List, Details)
│   │   ├── index.css           # Premium Light Design System & Global Styles
│   │   ├── App.css             # Component-level overrides
│   │   └── main.jsx
│   └── vite.config.js          # Vite config & API dev server proxies
│
├── backend/                    # Express REST API Server
│   ├── controllers/            # Controller Functions (Auth, Complaints, AI)
│   ├── middleware/             # Middleware (JWT verification)
│   ├── models/                 # Mongoose Database Schemas (User, Complaint)
│   ├── routes/                 # API Routes Definition
│   ├── .env                    # Environment configurations (Port, DB URI, API Keys)
│   └── server.js               # Entry Point
│
├── .gitignore                  # Git Exclusion List
└── README.md                   # System Documentation
```

---

## 💻 Tech Stack

- **Frontend**: React 19, Vite, React Router DOM v6, Axios, Lucide React Icons.
- **Design & Layout**: Pure Vanilla CSS featuring responsive flex/grid architectures, custom variables, and elegant, accessible typography.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (via Mongoose ODM).
- **AI Engine**: Google Gen AI SDK (`gemini-2.0-flash`).

---

## 🔒 Security & Authentication Test Cases

| Action / Test Case | Security Mechanism | Expected Server Output |
| :--- | :--- | :--- |
| **Valid Login** | Credentials validated via bcrypt; JWT signed | `200 OK` (Returns Signed JWT Token + User object) |
| **Invalid Password** | Bcrypt hash match fail | `401 Unauthorized` (Error: Invalid credentials) |
| **Access Protected Route Without Token** | Middleware header verification fail | `401 Unauthorized` (Error: Access denied. No token provided.) |
| **Stored Password Safety** | Password auto-hashed pre-save | Hashed string formatted (e.g. `$2b$10$...`) inside DB |

---

## 🗃️ MongoDB Schema Design

The `Complaint` schema is mapped directly to support robust CRUD operations:

```javascript
const ComplaintSchema = new mongoose.Schema({ 
  name: String, 
  email: String, 
  title: String, 
  description: String, 
  category: String, 
  location: String, 
  status: { 
    type: String, 
    default: "Pending" 
  }, 
  createdAt: { 
    type: Date, 
    default: Date.now 
  } 
});
```

---

## 🔌 API Documentation

### 🏥 Health Check Route
* **Endpoint**: `GET /health`
* **Description**: Returns the server status. Use this endpoint with external services (like UptimeRobot or Cron jobs) to ping the server every 10-14 minutes and prevent the Render free tier service from spinning down / going to sleep.
* **Success Response (`200 OK`)**:
  ```json
  {
    "status": "UP",
    "timestamp": "2026-05-19T10:52:11.000Z"
  }
  ```

### 🔑 Authentication Routes
All Auth endpoints are prefix-mounted at `/api/auth`.

#### 1. Sign Up / Register
* **Endpoint**: `POST /api/auth/signup`
* **Request Body**:
  ```json
  {
    "name": "Rahul Kumar",
    "email": "rahul@gmail.com",
    "password": "securepassword123"
  }
  ```
* **Success Response (`201 Created`)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64efc89d2c...",
      "name": "Rahul Kumar",
      "email": "rahul@gmail.com"
    }
  }
  ```

#### 2. Log In
* **Endpoint**: `POST /api/auth/login`
* **Request Body**:
  ```json
  {
    "email": "rahul@gmail.com",
    "password": "securepassword123"
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64efc89d2c...",
      "name": "Rahul Kumar",
      "email": "rahul@gmail.com"
    }
  }
  ```

---

### 📋 Complaint Routes
All Complaint endpoints are prefix-mounted at `/api/complaints` and require a valid `Authorization: Bearer <TOKEN>` header.

#### 1. Add Complaint
* **Endpoint**: `POST /api/complaints`
* **Request Body**:
  ```json
  {
    "name": "Rahul Kumar",
    "email": "rahul@gmail.com",
    "title": "Water Leakage Issue",
    "description": "Water pipeline damaged near market area.",
    "category": "Water Supply",
    "location": "Ghaziabad"
  }
  ```
* **Success Response (`201 Created`)**:
  ```json
  {
    "_id": "64efca51a7...",
    "name": "Rahul Kumar",
    "email": "rahul@gmail.com",
    "title": "Water Leakage Issue",
    "description": "Water pipeline damaged near market area.",
    "category": "Water Supply",
    "location": "Ghaziabad",
    "status": "Pending",
    "createdAt": "2026-05-19T10:00:00.000Z"
  }
  ```

#### 2. Get All Complaints
* **Endpoint**: `GET /api/complaints`
* **Optional Query Parameters**:
  - `category` (Filter by category, e.g. `/api/complaints?category=Water Supply`)
* **Success Response (`200 OK`)**:
  ```json
  [
    {
      "_id": "64efca51a7...",
      "name": "Rahul Kumar",
      "email": "rahul@gmail.com",
      "title": "Water Leakage Issue",
      "description": "Water pipeline damaged near market area.",
      "category": "Water Supply",
      "location": "Ghaziabad",
      "status": "Pending",
      "createdAt": "2026-05-19T10:00:00.000Z"
    }
  ]
  ```

#### 3. Update Complaint Status
* **Endpoint**: `PUT /api/complaints/:id`
* **Request Body**:
  ```json
  {
    "status": "In Progress"
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "_id": "64efca51a7...",
    "status": "In Progress",
    "name": "Rahul Kumar",
    "email": "rahul@gmail.com",
    "title": "Water Leakage Issue",
    "description": "Water pipeline damaged near market area.",
    "category": "Water Supply",
    "location": "Ghaziabad",
    "createdAt": "2026-05-19T10:00:00.000Z"
  }
  ```

#### 4. Search Complaints by Location
* **Endpoint**: `GET /api/complaints/search?location=Ghaziabad`
* **Query Parameters**:
  - `location` (Case-insensitive match filter)
* **Success Response (`200 OK`)**: Returns matching complaints array.

---

### 🤖 AI Analysis Routes
AI endpoints are prefix-mounted at `/api/ai` and require a valid `Authorization: Bearer <TOKEN>` header.

#### 1. AI Complaint Analyzer
* **Endpoint**: `POST /api/ai/analyze`
* **Request Body**:
  ```json
  {
    "title": "Water pipeline leakage",
    "description": "The main water supply line has cracked and thousands of liters of clean water are leaking out onto the street.",
    "category": "Water Supply",
    "location": "Ghaziabad"
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "urgency": "High",
    "department": "Water department",
    "summary": "Main water supply line cracked causing large-scale leakage on the street.",
    "autoResponse": "Thank you for bringing this to our attention. We have flagged this as high urgency and dispatched a repair crew from the Water Department to resolve the leak immediately."
  }
  ```

---

## ⚡ AI Intelligence Test Configurations

Our system's core system prompts are strictly configured to deliver highly predictable, reliable output that successfully complies with the following test profiles:

| Complaint Input Type | Target Analysis Target | Expected AI Output Structure |
| :--- | :--- | :--- |
| **Water leakage** | Department Suggestion | `"department": "Water department"` |
| **Electricity issue** | Urgency Classification | `"urgency": "High"` or `"Critical"` |
| **Garbage complaint** | Department Suggestion | `"department": "Sanitation department"` |
| **Long complaint text** | Summarization Feature | Brief, concise AI-generated summary |

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB account (Atlas cluster or local service)
- Google Gemini API Key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd AI_BGM
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`. Any API calls made to `/api/*` will be proxy-routed to the server at `http://localhost:5000` automatically.

---

## 🚀 Render Deployment Guide

### Deploying the Frontend (Vite) as a Static Site
When deploying a Vite single-page application (SPA) on Render, configure the following settings:

1. **Service Type**: Select **Static Site**.
2. **Build & Deploy Settings**:
   - **Repository URL**: Connect your repository.
   - **Root Directory**: `AI_BGM` *(Crucial since the frontend code is in a subfolder)*.
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
3. **SPA Redirect Rules**:
   Since the React frontend uses client-side routing (`react-router-dom`), you must configure a redirect rule so that direct links (like `/login` or `/complaints`) do not return 404s when refreshed:
   - In your Render dashboard, navigate to the **Redirects/Rewrites** tab for the static site service.
   - Add a rule:
     - **Source**: `/*`
     - **Destination**: `/index.html`
     - **Action**: `Rewrite`

### Deploying the Backend (Express API) as a Web Service
1. **Service Type**: Select **Web Service**.
2. **Build & Deploy Settings**:
   - **Root Directory**: `backend` *(Since backend code is in the `backend` subfolder)*.
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
3. **Environment Variables**:
   Under the **Environment** tab, add your production environment variables:
   - `PORT`: `5000` or whatever port you choose.
   - `MONGO_URL`: Your production MongoDB connection string.
   - `JWT_SECRET`: A secure random secret key.
   - `GEMINI_API_KEY`: Your valid Gemini API Key.

