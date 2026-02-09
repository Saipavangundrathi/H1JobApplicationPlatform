import { useState, type FormEvent } from 'react'; // 👈 Fix 1: Import FormEvent
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => { // 👈 Fix 2: Use FormEvent directly
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials and try again.');
      }

      const data = await response.json();
      console.log('Login Response:', data); // 👈 Debug: Check your browser console!

      const token = data?.token;

      if (!token) {
        throw new Error('Login failed. Missing token.');
      }

      localStorage.setItem('token', token);
      
      // Save User Data
      localStorage.setItem(
        'user',
        JSON.stringify({
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email // Added email just in case
        })
      );

      // Force a hard reload to ensure Layout picks up the new localStorage
      // This is the cleanest way to fix the "Guest User" lag without context
      window.location.href = '/dashboard'; 
      
    } catch (loginError) {
      const message =
        loginError instanceof Error
          ? loginError.message
          : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="grid min-h-screen md:grid-cols-2">
        {/* Left Side - Hero */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-900 md:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_60%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-white/70">SponsorScope</p>
              <h1 className="mt-4 text-3xl font-semibold">
                Find verified H1B sponsors, faster.
              </h1>
              <p className="mt-3 text-sm text-white/80">
                Curated roles, sponsorship insights, and AI-assisted resume tailoring.
              </p>
            </div>
            <p className="text-xs text-white/70">Trusted by ambitious international students.</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200/70 bg-white p-8 shadow-lg shadow-emerald-100/50">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
              <p className="mt-1 text-sm text-slate-500">Sign in to continue your search.</p>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700" htmlFor="login-email">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700" htmlFor="login-password">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-semibold text-emerald-600 hover:text-emerald-700">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}