# 🎬 MovieApp - Complete Setup Guide

A movie application with user authentication, language selection, dark mode, and movie streaming capabilities.

## 📋 Project Structure

```
backend/
├── App/
│   ├── auth.py (New - Authentication utilities)
│   ├── crud.py (Updated - User CRUD operations)
│   ├── database.py (Database connection)
│   ├── main.py (Updated - FastAPI app with CORS)
│   ├── models.py (Updated - User model added)
│   ├── routes.py (Updated - Auth endpoints added)
│   ├── schemas.py (Updated - User schemas)
│   └── tmdb_service.py (TMDB API service)
├── requirements.txt (Updated - Auth dependencies)
└── .env.example (New - Environment variables)

frontend/
├── src/
│   ├── context/
│   │   ├── AuthContext.jsx (New - Auth state management)
│   │   └── ThemeContext.jsx (New - Dark mode state)
│   ├── pages/
│   │   ├── Login.jsx (New - Login/Register page)
│   │   ├── Login.css (New - Login styling)
│   │   ├── Home.jsx (Updated - Movie grid)
│   │   ├── Home.css (New - Home styling)
│   │   ├── MovieDetail.jsx (Updated - Language selection)
│   │   └── MovieDetail.css (Updated - Dark mode support)
│   ├── components/
│   │   ├── Navbar.jsx (Updated - Auth & theme controls)
│   │   └── Navbar.css (Updated - Dark mode support)
│   ├── App.jsx (Updated - Routing & providers)
│   ├── App.css (New - Global styles)
│   └── main.jsx (No changes)
└── package.json (No changes needed)
```

## 🚀 Backend Setup

### 1. Install Dependencies

```bash
cd back
pip install -r requirements.txt
```

### 2. Configure Database

Create a `.env` file based on `.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=movieapp_db
SECRET_KEY=your-secret-key-change-this-in-production
```

### 3. Create Database Tables

Tables are now created automatically when the FastAPI server starts. The startup event in `App/main.py` calls
```python
models.Base.metadata.create_all(bind=engine)
```
so you normally don't need to run anything manually. Just start the backend (see next step) and you should see a
```
[startup] database tables checked/created
```
message in the terminal.

If you prefer to create them yourself, use:

```bash
python -c "from App.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

Or run migrations manually in your MySQL client:

```sql
CREATE DATABASE movieapp_db;
USE movieapp_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    preferred_language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE watchlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT UNIQUE,
    title VARCHAR(255),
    rating FLOAT,
    poster VARCHAR(255)
);
```

### 4. Run Backend Server

Make sure the `App` folder is a package (contains `__init__.py`). This repository already includes one, but if you add new modules later keep it in place.

Start the server from the `back` directory so Python can import `App` reliably:

```bash
cd back
python -m uvicorn App.main:app --reload
```

If you prefer running from the workspace root, specify the full module path and restrict reload watch path:

```bash
python -m uvicorn back.App.main:app --reload --reload-dir back
```

Backend will be available at `http://localhost:8000`

**API Endpoints:**

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `PUT /auth/language/{language}` - Update preferred language

#### Movies
- `GET /trending` - Get trending movies
- `GET /search?q=search_term` - Search movies
- `GET /watchlist` - Get user watchlist
- `POST /watchlist` - Add to watchlist

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
cd front
npm install
```

### 2. Update API Endpoint (if needed)

In `src/context/AuthContext.jsx`, change:
```javascript
const API_URL = 'http://localhost:8000'; // Update if backend runs on different port
```

### 3. Run Development Server

```bash
npm run dev
```

Frontend will be available at `http://localhost:5173` (or shown in terminal)

## � CORS note

Requests from the frontend (`http://localhost:5173`) to the backend (`http://localhost:8000`) are permitted by
CORS middleware, which is configured to allow all origins, methods, and headers. If you ever see "blocked by CORS
policy" in the browser console, it usually means the backend did not send ANY response (e.g. the server crashed).
Fix the underlying server error (such as missing database tables) and the CORS error will disappear.

## �🔐 Authentication Flow

### Register
1. Click "Login" button in navbar
2. Toggle to "Register" tab
3. Fill in username, email, password, and language preference
4. Submit form
5. Automatically switched to login tab
6. Login with credentials

### Login
1. Click "Login" button in navbar
2. Enter email and password
3. Submit form
4. Redirected to home page with user profile visible

### User Profile
- Click username in navbar to see profile dropdown
- Shows username, email, and preferred language
- Click "Logout" to logout

## 🌙 Dark Mode

Click the theme toggle button (☀️/🌙) in navbar to switch between light and dark modes. 
Preference is saved to localStorage.

## 🎬 Movie Streaming

### Watch Movie
1. Click on any movie card to view details
2. Scroll to "Select Language" section
3. Choose your preferred language
4. Click "▶️ Watch Now" button
5. Must be logged in to watch (redirects to login if not)
6. Video modal opens with language selection

### Language Selection
- Available languages: English, Spanish, French, German, Italian, Portuguese, Japanese, Chinese
- Selected language is saved to user profile if logged in
- Video displays in selected language

## 📁 File Descriptions

### Backend Files

#### `auth.py` (New)
- Password hashing and verification
- JWT token creation and validation
- Dependency functions for authentication

#### `models.py` (Updated)
- `User` model with username, email, password, language preference
- `Watchlist` model remains unchanged

#### `schemas.py` (Updated)
- `UserCreate`, `UserLogin`, `UserOut` schemas
- `Token` schema for API responses

#### `crud.py` (Updated)
- User creation, retrieval, and language updates
- Existing watchlist operations

#### `routes.py` (Updated)
- Authentication endpoints (register, login, get user)
- Language update endpoint
- Existing movie endpoints

#### `main.py` (Updated)
- CORS middleware enabled for frontend communication

### Frontend Files

#### `AuthContext.jsx` (New)
- Global auth state management
- Login, register, logout functions
- Token management and verification

#### `ThemeContext.jsx` (New)
- Global dark mode state
- Theme toggle function
- localStorage persistence

#### `pages/Login.jsx` (New)
- Combined login and register form
- Email and password validation
- Language selection during registration

#### `pages/MovieDetail.jsx` (Updated)
- Language selection dropdown
- Video player with language display
- Protected watch functionality (requires login)

#### `components/Navbar.jsx` (Updated)
- Login/logout button
- User profile dropdown
- Dark mode toggle
- Responsive design

#### `App.css` (New)
- Global CSS variables for theming
- Dark mode support
- Responsive utilities

## 🔧 Configuration

### Backend Secret Key
Change the `SECRET_KEY` in `App/auth.py` for production:

```python
SECRET_KEY = "your-super-secure-secret-key-change-this"
```

### CORS Settings
Update allowed origins in `App/main.py` for production:

```python
allow_origins=["https://yourdomain.com"],  # Change from ["*"]
```

## 🐛 Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check .env file credentials
- Verify database exists

### Login Not Working
- Check backend is running on correct port
- Verify CORS is enabled
- Check browser console for errors

### Dark Mode Not Working
- Clear browser localStorage
- Check if `[data-theme='dark']` CSS is loading
- Verify ThemeContext is wrapping the app

### Movies Not Loading
- Check TMDB API key in tmdb_service.py
- Verify internet connection
- Check API limits (TMDB has rate limits)

## 🔒 Security Notes

- Change `SECRET_KEY` in production
- Use HTTPS in production
- Set specific `allow_origins` in CORS
- Hash passwords (already implemented with bcrypt)
- Use environment variables for sensitive data

## 📝 Features

✅ User authentication (register, login, logout)
✅ User profiles with language preferences
✅ Dark mode theme switching
✅ Movie browsing and search
✅ Language selection for movies
✅ Video streaming interface
✅ Watchlist management (backend ready)
✅ Responsive design
✅ MySQL database integration
✅ JWT token authentication
✅ CORS enabled for frontend

## 🚀 Deployment

### Backend Deployment (Heroku example)
1. Create `Procfile`:
   ```
   web: uvicorn App.main:app --host 0.0.0.0 --port $PORT
   ```

2. Deploy:
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Vercel example)
```bash
npm run build
# Deploy the dist folder
```

## 📧 Support

For issues or questions, check:
1. Backend terminal for error messages
2. Browser console (F12) for frontend errors
3. Network tab for API call issues
4. Database for data integrity issues
