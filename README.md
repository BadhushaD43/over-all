# OTT Platform

Full-stack movie streaming discovery platform with:
- Public home interface
- Authenticated user dashboard
- Admin dashboard

## Stack
- Frontend: React + Vite
- Backend: FastAPI + SQLAlchemy
- Database: MySQL (via `DATABASE_URL`) or SQLite for local development
- Movie data: TMDB API

## Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs on `http://127.0.0.1:8000`.

### Environment
Use `backend/.env`:
```env
DATABASE_URL=sqlite:///./ott.db
SECRET_KEY=change-this-secret-key
TMDB_API_KEY=your-tmdb-api-key
DEFAULT_ADMIN_EMAIL=admin@ottstream.com
DEFAULT_ADMIN_PASSWORD=Admin@123
CORS_ORIGINS=http://localhost:5173
```

To use MySQL:
```env
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/ottdb
```

## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

Optional `frontend/.env`:
```env
VITE_API_BASE=http://127.0.0.1:8000/api
```

## Main API Endpoints
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/movies/trending-by-language`
- `GET /api/movies/upcoming`
- `GET /api/movies/search`
- `GET /api/movies/{movie_id}`
- `GET /api/users/me`
- `PUT /api/users/me`
- `GET/POST/DELETE /api/watchlist`
- `GET/POST /api/support`
- `GET /api/admin/stats`
- `GET /api/admin/support`
- `PATCH /api/admin/support/{message_id}/resolve`

## Admin Login
Default admin is auto-created on backend startup:
- Email: `admin@ottstream.com`
- Password: `Admin@123`
