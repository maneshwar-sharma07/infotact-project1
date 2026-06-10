import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

export const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });
      const { token, user } = response.data;
      login(token, user);
      navigate('/app/default/general');
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0A0F] flex items-center justify-center relative overflow-hidden px-4">
      {/* Decorative Radial Cyan/Violet Glow behind Card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#06B6D4]/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-3/4 w-[300px] h-[300px] bg-[#7C3AED]/10 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Main Glass Card Panel */}
      <div className="w-full max-w-[440px] glass-card p-8 shadow-2xl relative z-10 border border-[#7C3AED]/20">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/30 text-[#06B6D4] mb-4 shadow-sm shadow-[#06B6D4]/25">
            <UserPlus size={22} />
          </div>
          <h1 className="text-3xl font-bold font-heading text-[#F1F5F9] tracking-tight">
            Create <span className="text-[#06B6D4] bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] bg-clip-text text-transparent">Account</span>
          </h1>
          <p className="text-sm text-[#64748B] font-body mt-2">
            Get started with Infotact Solutions collaboration workspaces
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={User}
            disabled={loading}
            required
            autoComplete="name"
          />

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
            autoComplete="new-password"
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={Lock}
            disabled={loading}
            required
            autoComplete="new-password"
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
            className="w-full mt-2 font-semibold shadow-md shadow-[#06B6D4]/10 transition-transform duration-150 active:scale-[0.98]"
          >
            Create Account
          </Button>
        </form>

        {/* Footer Links */}
        <div className="text-center mt-6 pt-5 border-t border-[#1E293B]/50 text-sm">
          <span className="text-[#64748B] font-body">Already have an account? </span>
          <Link
            to="/login"
            className="text-[#06B6D4] hover:text-[#06B6D4]/80 transition-colors font-semibold hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
