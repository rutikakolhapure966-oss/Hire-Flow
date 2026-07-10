*** Begin Patch
*** Update File: README.md
@@
 ### Backend Setup
@@
 8. **Run development server**
 ```bash
 python manage.py runserver
 ```
 
 Backend will be available at `http://localhost:8000`
+
+### Seed demo data (optional)
+
+Run the management command to populate demo users, a company, jobs, and one application:
+
+```bash
+python manage.py seed_demo
+```
+
+Demo credentials:
+- recruiter@example.com / password123
+- candidate@example.com / password123
*** End Patch
