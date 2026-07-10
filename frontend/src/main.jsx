*** Begin Patch
*** Update File: frontend/src/main.jsx
@@
-import { AuthProvider } from './context/AuthContext';
+import { AuthProvider } from './context/AuthContext';
+import { ToastProvider } from './context/ToastContext';
@@
-    <BrowserRouter>
-      <AuthProvider>
-        <App />
-      </AuthProvider>
-    </BrowserRouter>
+    <BrowserRouter>
+      <AuthProvider>
+        <ToastProvider>
+          <App />
+        </ToastProvider>
+      </AuthProvider>
+    </BrowserRouter>
*** End Patch
