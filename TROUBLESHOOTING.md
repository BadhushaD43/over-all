# 🔐 Login Failed - Troubleshooting Guide

## ✅ Step 1: Verify Backend is Running
```bash
# In terminal, check if uvicorn is running
# Should see: "Uvicorn running on http://0.0.0.0:8000"

# If not running, start it:
cd back
python -m uvicorn App.main:app --reload
```

## ✅ Step 2: Verify Database Connection
```bash
# Check that MySQL is running
# For Windows: MySQL should be in Services (services.msc)

# Check .env file exists: back/.env
# Must contain:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=Basha1510@.
# DB_NAME=tmdb_db
```

## ✅ Step 3: Test Backend Directly
Open browser and visit:
```
http://localhost:8000/trending?page=1
```
- If you see JSON data ✅ Backend is working
- If you see error or blank page ❌ Backend has issues

## ✅ Step 4: Check LocalStorage After Login
Open browser DevTools (F12) → Storage/Application → LocalStorage:
```
Key: token
Value: eyJhbGc... (JWT token string)

Key: user
Value: {"id": 1, "email": "test@example.com", ...}
```

## ✅ Step 5: Verify Database Tables
Login to MySQL:
```bash
mysql -u root -p
# Password: Basha1510@.

USE tmdb_db;
SELECT * FROM users;
```
Should show registered users.

## 🔧 Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "Cannot reach backend server" | Backend not running | Start uvicorn server |
| "Email not found" | User not registered | Register first, then login |
| "Invalid password" | Wrong password | Check caps lock, recheck password |
| "Database connection failed" | MySQL not running | Start MySQL service |
| "[2002] Can't connect to MySQL" | MySQL service down | Start MySQL: `net start MySQL80` (Windows) |

## 📊 Login API Flow

```
CLIENT (Browser)
   ↓ sends POST /auth/login {email, password}
   ↓
BACKEND (FastAPI)
   ↓ calls verify_password()
   ↓
DATABASE (MySQL - tmdb_db.users)
   ↓ returns user record if found
   ↓
JWT Token Generator
   ↓ creates access token with user.id
   ↓
RESPONSE: {access_token, token_type, user}
   ↓
CLIENT (AuthContext)
   ↓ stores token in localStorage
   ↓
Future Requests: Authorization: Bearer {token}
```

## 🧪 Test Registration First

If login fails, try registration first:
1. Go to Login page
2. Click "Register" 
3. Fill: Username, Email, Password, Language
4. Click Register
5. Should see success message
6. Then try Login with same email

## 🔍 Frontend Console Errors

Press F12 in browser → Console tab
Look for errors like:
- "TypeError: fetch failed" → Backend not running
- "401 Unauthorized" → Invalid credentials  
- "500 Internal Server Error" → Database error
