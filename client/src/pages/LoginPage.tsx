import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import Input from '../components/ui/Input.tsx';
import Button from '../components/ui/Button.tsx';
import { useAuth } from '../hooks/useAuth.ts';
import api from '../services/api.ts';

const LoginPage = () => {
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
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      login(token, user);
      navigate('/app/default/general');
    } catch (err: any) {
      console.error(err);

      const errMsg =
        err.response?.data?.message ||
        'Invalid email or password. Please try again.';

      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0A0F] flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7C3AED]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="w-full max-w-[420px] glass-card p-8 shadow-2xl relative z-10 border border-[#7C3AED]/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/30 text-[#7C3AED] mb-4">
            <LogIn size={22} />
          </div>

          <h1 className="text-3xl font-bold text-[#F1F5F9]">
            Welcome Back
          </h1>

          <p className="text-sm text-[#64748B] mt-2">
            Enter your details to access your workspace
          </p>
        </div>

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
          />

          {error && (
            <div className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 py-2 px-3 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            Sign In
          </Button>
        </form>

        <div className="text-center mt-6 pt-5 border-t border-[#1E293B]/50 text-sm">
          <span className="text-[#64748B]">
            Don't have an account?
          </span>{' '}
          <Link
            to="/signup"
            className="text-[#7C3AED] hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;