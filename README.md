# HireFlow - Applicant Tracking System

A modern, full-stack applicant tracking system built with React, Django REST Framework, and MySQL.

## Features

### For Candidates
- User registration and authentication
- Browse and search jobs
- Filter jobs by location, type, experience level
- Save jobs for later
- Apply for jobs with cover letter
- Track application status
- Manage profile with resume upload
- View application history

### For Recruiters
- Post job listings
- Manage job postings
- View applicants
- Update application status
- Recruiter dashboard with analytics
- Company management

### Admin Features
- Manage users, recruiters, companies, jobs, applications

## Tech Stack

### Backend
- Python 3.x
- Django 4.2
- Django REST Framework
- MySQL
- JWT Authentication

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Axios
- React Router DOM

## Installation

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/rutikakolhapure966-oss/Hire-Flow.git
cd Hire-Flow/backend
```

2. **Create and activate virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your database credentials:
```
DEBUG=True
SECRET_KEY=your-secret-key-here
DB_ENGINE=django.db.backends.mysql
DB_NAME=hireflow_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
JWT_SECRET_KEY=your-jwt-secret-key-here
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

5. **Create MySQL database**
```bash
mysql -u root -p
CREATE DATABASE hireflow_db CHARACTER SET utf8mb4;
EXIT;
```

6. **Run migrations**
```bash
python manage.py migrate
```

7. **Create superuser (admin)**
```bash
python manage.py createsuperuser
```

8. **Run development server**
```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Project Structure

```
HireFlow/
├── backend/
│   ├── config/              # Django settings
│   ├── accounts/            # User management
│   ├── companies/           # Company management
│   ├── jobs/                # Job listings
│   ├── applications/        # Job applications
│   ├── dashboard/           # Analytics
│   ├── notifications/       # Notifications
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── pages/           # Page components
    │   ├── layouts/         # Layout components
    │   ├── services/        # API services
    │   ├── context/         # Context API
    │   ├── hooks/           # Custom hooks
    │   ├── utils/           # Utility functions
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    ├── vite.config.js
    └── index.html
```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/user/` - Get current user
- `PUT /api/auth/user/` - Update user profile
- `GET /api/auth/candidate-profile/` - Get candidate profile
- `PUT /api/auth/candidate-profile/` - Update candidate profile
- `GET /api/auth/recruiter-profile/` - Get recruiter profile
- `PUT /api/auth/recruiter-profile/` - Update recruiter profile

### Jobs
- `GET /api/jobs/` - List all jobs
- `GET /api/jobs/{slug}/` - Get job details
- `POST /api/jobs/` - Create job (Recruiter only)
- `PUT /api/jobs/{slug}/` - Update job
- `DELETE /api/jobs/{slug}/` - Delete job

### Companies
- `GET /api/companies/` - List all companies
- `GET /api/companies/{slug}/` - Get company details
- `POST /api/companies/` - Create company (Recruiter only)
- `PUT /api/companies/{slug}/` - Update company

### Applications
- `GET /api/applications/applications/` - List applications
- `POST /api/applications/applications/` - Create application
- `PATCH /api/applications/applications/{id}/update_status/` - Update application status
- `GET /api/applications/saved-jobs/` - List saved jobs
- `POST /api/applications/saved-jobs/` - Save job
- `DELETE /api/applications/saved-jobs/{id}/remove_saved/` - Remove saved job

### Dashboard
- `GET /api/dashboard/recruiter/` - Recruiter dashboard
- `GET /api/dashboard/candidate/` - Candidate dashboard

### Notifications
- `GET /api/notifications/` - List notifications
- `PATCH /api/notifications/{id}/mark_as_read/` - Mark as read
- `PATCH /api/notifications/mark_all_as_read/` - Mark all as read

... (rest of README unchanged)
