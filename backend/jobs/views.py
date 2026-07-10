*** Begin Patch
*** Update File: backend/jobs/views.py
@@
     def get_queryset(self):
-        queryset = Job.objects.filter(is_active=True)
-        return queryset
+        # Allow public listing of active jobs. If the authenticated recruiter
+        # requests their own jobs with ?mine=true, return jobs posted by them.
+        if hasattr(self.request, 'user') and self.request.user.is_authenticated and self.request.query_params.get('mine') == 'true':
+            return Job.objects.filter(posted_by=self.request.user)
+        queryset = Job.objects.filter(is_active=True)
+        return queryset
*** End Patch
