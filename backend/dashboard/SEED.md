# Documentation: how to seed demo data

To populate the database with demo users, a company, jobs, and one application, run:

```bash
cd backend
python manage.py seed_demo
```

This creates:
- recruiter@example.com / password123 (role: recruiter)
- candidate@example.com / password123 (role: candidate)
- Company: Acme Corp
- Jobs: Frontend Engineer, Backend Engineer
- One application from candidate to Frontend Engineer
