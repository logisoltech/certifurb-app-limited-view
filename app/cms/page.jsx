'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import { Geist } from "next/font/google";

const font = Geist({
  subsets: ["latin"],
});

const CmsLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, user, loading, justLoggedOut } = useAuth();

  // Redirect if user is already logged in (but not if they just logged out)
  useEffect(() => {
    if (user && !justLoggedOut) {
      router.push('/cms/dashboard');
    }
  }, [user, justLoggedOut, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirect to dashboard
        router.push('/cms/dashboard');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className={`${font.className} min-h-screen bg-white flex items-center justify-center p-4`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className={`${font.className} min-h-screen bg-white flex items-center justify-center p-4 relative`}>
      {/* Logo in top left corner */}
      <div className="absolute top-6 left-6">
        <img 
          src="/certifurb.png" 
          alt="Certifurb Logo" 
          className="h-12 w-auto"
        />
      </div>

      <div className="bg-gradient-to-br from-[#00E348]/30 to-[#4C865E]/30 backdrop-blur-2xl rounded-2xl shadow-2xl border border-green-200/50 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">CMS Login</h1>
          <p className="text-gray-600">Admin Portal Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/80 border border-green-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/80 border border-green-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
            >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              'Sign In to CMS'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          {/* <p className="text-gray-500 text-sm mb-3">
            Login Credentials:
          </p>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Admin:</strong> admin@email.com / admin</p>
            <p><strong>Marketer:</strong> marketer@email.com / marketer</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CmsLogin;