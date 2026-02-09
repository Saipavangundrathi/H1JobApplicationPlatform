import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  
  // State for ALL 4 fields
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), // Sends firstname, lastname, email, password
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Success! Save token and go to Dashboard
      localStorage.setItem('token', data.token);
      navigate('/onboarding'); 
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Left Side - Visuals */}
      <div className="hidden lg:flex w-1/2 justify-center items-center p-12 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-900 opacity-80"></div>
        <div className="relative z-10 text-white max-w-lg">
          <h1 className="text-5xl font-bold mb-6">Build your sponsored job plan.</h1>
          <p className="text-xl text-emerald-100">Track roles, match resumes, and stay focused on companies that sponsor.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white p-8 shadow-lg shadow-emerald-100/50">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
          <p className="text-gray-500 mb-8">Start tracking sponsorship-ready jobs.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            
            {/* NEW FIELDS: First & Last Name */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  type="text" 
                  name="firstname"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.firstname}
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  type="text" 
                  name="lastname"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                name="email"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                name="password"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 py-3 font-bold text-white shadow-sm transition hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;