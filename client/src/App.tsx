import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const LoginPage = () => {
  return <h1>Login Page</h1>;
};

const SignupPage = () => {
  return <h1>Signup Page</h1>;
};

const AppLayout = () => {
  return <h1>Workspace App</h1>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/signup" element={<SignupPage />} />

        <Route path="/app" element={<AppLayout />} />

        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;