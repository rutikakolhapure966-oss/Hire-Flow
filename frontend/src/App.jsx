diff --git a/frontend/src/App.jsx b/frontend/src/App.jsx
index 0000000..0000000 100644
--- a/frontend/src/App.jsx
+++ b/frontend/src/App.jsx
@@
-import Register from './pages/Register';
-import Login from './pages/Login';
+import Register from './pages/Register';
+import Login from './pages/Login';
+import Jobs from './pages/Jobs';
+import JobDetail from './pages/JobDetail';
@@
-        <Routes>
-          <Route path="/" element={<h2>Welcome to HireFlow — build out the UI</h2>} />
-          <Route path="/register" element={<Register />} />
-          <Route path="/login" element={<Login />} />
-        </Routes>
+        <Routes>
+          <Route path="/" element={<h2>Welcome to HireFlow — build out the UI</h2>} />
+          <Route path="/register" element={<Register />} />
+          <Route path="/login" element={<Login />} />
+          <Route path="/jobs" element={<Jobs />} />
+          <Route path="/jobs/:slug" element={<JobDetail />} />
+        </Routes>
