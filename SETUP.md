# HireFlow Setup Guide

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- MySQL 5.7+

### Step 1: Backend Setup (5 minutes)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Create database
mysql -u root -p -e "CREATE DATABASE hireflow_db CHARACTER SET utf8mb4;"

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend running at: `http://localhost:8000`

### Step 2: Frontend Setup (3 minutes)

```bash
# Navigate to frontend directory (in new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend running at: `http://localhost:5173`

## Test Accounts

### Admin
- Email: admin@example.com
- Password: admin123

### Recruiter
- Email: recruiter@example.com
- Password: recruiter123

### Candidate
- Email: candidate@example.com
- Password: candidate123

## Common Issues

### MySQL Connection Error
```
Solution: Check DB_PASSWORD in .env, ensure MySQL is running
```

### CORS Error
```
Solution: Ensure CORS_ALLOWED_ORIGINS includes your frontend URL
```

### Port Already in Use
```bash
# Backend
python manage.py runserver 8001

# Frontend
npm run dev -- --port 5174
```

## Features Demo

### Login as Candidate
1. Register new account with role "Candidate"
2. Go to Jobs page
3. Browse, filter, and search jobs
4. Save jobs and apply
5. Track applications in Applications page

### Login as Recruiter
1. Register with role "Recruiter"
2. Go to Dashboard
3. Post a new job
4. View applicants
5. Update application status

## Production Build

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
# Update settings.py for production
# Collect static files
python manage.py collectstatic

# Use gunicorn
gunicorn config.wsgi:application
```

## Documentation
- API Docs: See README.md for endpoints
- Database: See Project Structure in README.md
- Components: Check frontend/src/components/ for reusable components
