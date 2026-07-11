import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { useAuth } from './hooks/useAuth.ts';
import { ToastProvider } from './components/ui/ToastProvider.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SignupPage from './pages/SignupPage.tsx';
import AppPage from './pages/AppPage.tsx';
import InvitePage from './pages/InvitePage.tsx';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!isAuthenticated && !token) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
};

const PublicRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const redirectTo = new URLSearchParams(location.search).get('redirect');
  const safeRedirect =
    redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')
      ? redirectTo
      : '/app/default/general';

  if (isAuthenticated || token) {
    return <Navigate to={safeRedirect} replace />;
  }

  return children;
};

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
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

            <Route path="/invite/:token" element={<InvitePage />} />

            <Route
              path="/app/:workspaceId/:channelId"
              element={
                <ProtectedRoute>
                  <AppPage />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
