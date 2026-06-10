import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      login(token, user);
      navigate('/app/default/general');
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0A0F] flex items-center justify-center relative overflow-hidden px-4">
      {/* Decorative Radial Violet Glow behind Card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7C3AED]/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[#06B6D4]/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Main Glass Card Panel */}
      <div className="w-full max-w-[420px] glass-card p-8 shadow-2xl relative z-10 border border-[#7C3AED]/20">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/30 text-[#7C3AED] mb-4 shadow-sm shadow-[#7C3AED]/25">
            <LogIn size={22} />
          </div>
          <h1 className="text-3xl font-bold font-heading text-[#F1F5F9] tracking-tight">
            Welcome <span className="text-[#7C3AED] bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">Back</span>
          </h1>
          <p className="text-sm text-[#64748B] font-body mt-2">
            Enter your details to access your workspace
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            disabled={loading}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            disabled={loading}
            required
            autoComplete="current-password"
          />

          {error && (
            <div className="text-xs text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 py-2 px-3 rounded-[4px] font-medium text-left">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full mt-2 font-semibold shadow-md shadow-[#7C3AED]/30 transition-transform duration-150 active:scale-[0.98]"
          >
            Sign In
          </Button>
        </form>

        {/* Footer Links */}
        <div className="text-center mt-6 pt-5 border-t border-[#1E293B]/50 text-sm">
          <span className="text-[#64748B] font-body">Don't have an account? </span>
          <Link
            to="/signup"
            className="text-[#7C3AED] hover:text-[#7C3AED]/80 transition-colors font-semibold hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
