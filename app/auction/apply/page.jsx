'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Geist } from "next/font/google";
import Link from 'next/link';
import { font } from '../../Components/Font/font';

const ApplyForAuction = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    businessName: '',
    businessType: '',
    experience: '',
    interests: '',
    termsAccepted: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.termsAccepted) {
      setError('Please accept the terms and conditions');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://api.certifurb.com/api/auction/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setResponseData(data.data);
        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 6000);
      } else {
        setError(data.message || 'Application failed');
      }
    } catch (error) {
      console.error('Application error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success && responseData) {
    return (
      <div className={`${font.className} min-h-screen bg-white flex items-center justify-center p-4`}>
        <div className="bg-gradient-to-br from-green-500/30 to-emerald-600/30 backdrop-blur-2xl rounded-2xl shadow-2xl border border-green-200/50 p-8 w-full max-w-md text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Request Sent!</h1>
            <p className="text-gray-600 mb-4">Your access request has been sent. Waiting for admin approval.</p>
            <p className="text-sm text-gray-500">You will be redirected to home in a few seconds...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${font.className} min-h-screen bg-white p-4 relative`}>
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

      <div className="bg-gradient-to-br from-[#00E348]/30 to-[#4C865E]/30 backdrop-blur-2xl rounded-2xl shadow-2xl border border-green-200/50 p-4 w-full mt-20">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Apply for Auction Access</h1>
          {/* <p className="text-gray-600">Join our exclusive auction platform</p> */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Row 1: Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white/80 border border-green-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="John"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white/80 border border-green-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white/80 border border-green-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white/80 border border-green-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Row 2: Address and Business Information */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white/80 border border-green-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="123 Main Street"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white/80 border border-green-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="New York"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white/80 border border-green-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="United States"
              />
            </div>

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white/80 border border-green-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Your Business Name"
              />
            </div>
          </div>

          {/* Row 3: Industry and Terms */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <input
                type="text"
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white/80 border border-green-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="e.g., Electronics, Retail, Technology"
              />
            </div>
            
            <div className="md:col-span-3">
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="termsAccepted" className="ml-3 text-sm text-gray-700">
                    I accept the <a href="#" className="text-green-600 hover:text-green-800">Terms and Conditions</a> and 
                    <a href="#" className="text-green-600 hover:text-green-800 ml-1">Privacy Policy</a>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
            >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting Application...
              </div>
            ) : (
              'Submit Application'
            )}
          </button>
        </form>

        <div className="mt-3 text-center">
          <p className="text-gray-500 text-sm mb-2">
            Already have an auction account?
          </p>
          <Link 
            href="/auction" 
            className="text-green-600 hover:text-green-800 font-medium text-sm transition-colors"
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ApplyForAuction; 