*** Begin Patch
*** Update File: frontend/src/App.jsx
@@
-          <div className="flex gap-4">
-            <Link to="/jobs">Jobs</Link>
-            <Link to="/dashboard">Dashboard</Link>
-            <Link to="/login">Login</Link>
-            <Link to="/register">Register</Link>
-          </div>
+          <div className="flex gap-4">
+            <Link to="/">Home</Link>
+            <Link to="/jobs">Jobs</Link>
+            <Link to="/dashboard">Dashboard</Link>
+            <Link to="/profile">Profile</Link>
+            <Link to="/recruiter/applicants">Applicants</Link>
+            <Link to="/login">Login</Link>
+            <Link to="/register">Register</Link>
+          </div>
@@
-          <Route path="/jobs" element={<Jobs />} />
-          <Route path="/jobs/:slug" element={<JobDetail />} />
-          <Route path="/dashboard" element={<Dashboard />} />
+          <Route path="/jobs" element={<Jobs />} />
+          <Route path="/jobs/:slug" element={<JobDetail />} />
+          <Route path="/dashboard" element={<Dashboard />} />
+          <Route path="/profile" element={<CandidateProfile />} />
+          <Route path="/recruiter/applicants" element={<RecruiterApplicants />} />
         </Routes>
*** End Patch
