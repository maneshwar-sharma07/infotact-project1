import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { useAuth } from './hooks/useAuth.ts';
import LoginPage from './pages/LoginPage.tsx';
import SignupPage from './pages/SignupPage.tsx';
import AppPage from './pages/AppPage.tsx';

// Component to protect routes requiring authentication
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('token');

  // If there's no authenticated state and no token in localStorage, redirect to login
  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Component to redirect authenticated users away from auth pages (login/signup)
const PublicRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('token');

  if (isAuthenticated || token) {
    // Redirect to a default app page or workspace route if token exists
    return <Navigate to="/app/default/general" replace />;
  }

  return children;
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />

          {/* Protected App Route */}
          <Route
            path="/app/:workspaceId/:channelId"
            element={
              <ProtectedRoute>
                <AppPage />
              </ProtectedRoute>
            }
          />

          {/* Root Redirect to Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Catch-all redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
