'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Geist } from "next/font/google";
import Link from 'next/link';
import { font } from '../Components/Font/font';

const AuctionLogin = () => {
  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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
      const response = await fetch('https://api.certifurb.com/api/auction/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Store user data in localStorage
        localStorage.setItem('auctionUser', JSON.stringify(data.data));
        
        // Redirect to auction dashboard
        router.push('/auction/products');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${font.className} min-h-screen bg-white flex items-center justify-center p-4 relative`}>
      {/* Logo in top left corner */}
      <div className="absolute top-6 left-6">
        <Link href="/">
          <img 
            src="/certifurb.png" 
            alt="Certifurb Logo" 
            className="h-12 w-auto cursor-pointer"
          />
        </Link>
      </div>

      <div className="bg-gradient-to-br from-[#00E348]/30 to-[#4C865E]/30 backdrop-blur-2xl rounded-2xl shadow-2xl border border-green-200/50 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Auction Login</h1>
          <p className="text-gray-600">Access Auction Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
              User ID
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/80 border border-green-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="AU123456789"
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
              'Sign In to Auction'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm mb-3">
            Don't have an auction account?
          </p>
          <Link 
            href="/auction/apply" 
            className="text-green-600 hover:text-green-800 font-medium text-sm transition-colors"
          >
            Apply for Auction Access
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuctionLogin; 