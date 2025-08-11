'use client';
import React, { useState, useEffect } from 'react';
import { font } from '../Components/Font/font';
// import Header from '../Components/Layout/Header';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';
import { 
  MagnifyingGlassIcon, 
  CheckCircleIcon, 
  ClockIcon,
  TruckIcon,
  HomeIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('User data from localStorage:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    } else {
      console.log('No user data found in localStorage');
    }
  }, []);

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    if (!user || !user.useremail) {
      setError('Please log in to track your orders');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTrackingData(null);

      const response = await fetch(`https://api.certifurb.com/api/track-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId.trim(),
          userEmail: user.useremail
        })
      });
      
      const data = await response.json();

      if (data.success) {
        setTrackingData(data.data);
      } else {
        setError(data.message || 'Order not found');
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (step) => {
    if (step.completed) {
      return <CheckCircleIconSolid className="w-8 h-8 text-green-600" />;
    } else if (step.current) {
      return <ClockIcon className="w-8 h-8 text-blue-600" />;
    } else {
      return <div className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white"></div>;
    }
  };

  const getStepIcon = (stepKey) => {
    switch (stepKey) {
      case 'Order Placed':
        return <ArchiveBoxIcon className="w-5 h-5" />;
      case 'Processing':
        return <ClockIcon className="w-5 h-5" />;
      case 'Shipped':
        return <TruckIcon className="w-5 h-5" />;
      case 'Out for Delivery':
        return <TruckIcon className="w-5 h-5" />;
      case 'Delivered':
        return <HomeIcon className="w-5 h-5" />;
      default:
        return <ArchiveBoxIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className={`${font.className} min-h-screen bg-gray-50`}>
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Track Your Order
          </h1>
          <p className="text-gray-600 text-lg">
            Enter your order ID to get real-time updates on your shipment
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          {!user ? (
            // Login prompt for non-authenticated users
            <div className="text-center py-8">
              <div className="mb-4">
                <ArchiveBoxIcon className="mx-auto h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Login Required
              </h3>
              <p className="text-gray-600 mb-6">
                Please log in to your account to track your orders securely.
              </p>
              <div className="space-y-3">
                <a
                  href="/Auth/login"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-colors"
                >
                  Login to Track Orders
                </a>
                <div className="text-sm text-gray-500">
                  Don't have an account? <a href="/Auth/signup" className="text-green-600 hover:text-green-700 font-medium">Sign up here</a>
                </div>
              </div>
            </div>
          ) : (
            // Order tracking form for authenticated users
            <div>
              <div className="mb-4 text-center">
                <p className="text-gray-600">
                  Welcome back, <span className="font-semibold text-gray-900">{user.username || user.useremail}</span>! 
                  Track your orders below.
                </p>
              </div>
              <form onSubmit={handleTrackOrder} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter your order ID (e.g., 12345)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 rounded-lg font-semibold text-lg transition-colors ${
                    loading
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                  }`}
                >
                  {loading ? 'Tracking...' : 'Track Order'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="text-red-800">
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Order {trackingData.orderNumber}
                  </h2>
                  <p className="text-gray-600">
                    Placed on {trackingData.orderDate}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {trackingData.total}
                    </div>
                    <div className="text-gray-600">Total Amount</div>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="border-t pt-6">
                <div className="flex items-center space-x-4">
                  {trackingData.product.image && (
                    <img
                      src={trackingData.product.image}
                      alt={trackingData.product.name}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {trackingData.product.name}
                    </h3>
                    <p className="text-gray-600">
                      Quantity: {trackingData.product.quantity} × {trackingData.product.price}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipment Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Shipment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Current Status</div>
                  <div className="font-semibold text-lg text-gray-900">
                    {trackingData.shipment.status}
                  </div>
                </div>
                {trackingData.shipment.trackingNumber && (
                  <div>
                    <div className="text-sm text-gray-600">Tracking Number</div>
                    <div className="font-semibold text-gray-900">
                      {trackingData.shipment.trackingNumber}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-600">Courier Service</div>
                  <div className="font-semibold text-gray-900">
                    {trackingData.shipment.courierService}
                  </div>
                </div>
                {trackingData.shipment.estimatedDelivery && (
                  <div>
                    <div className="text-sm text-gray-600">Estimated Delivery</div>
                    <div className="font-semibold text-gray-900">
                      {trackingData.shipment.estimatedDelivery}
                    </div>
                  </div>
                )}
              </div>
              
              {trackingData.shipment.lastUpdated && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Last updated: {trackingData.shipment.lastUpdated}
                  </div>
                </div>
              )}
            </div>

            {/* Tracking Progress */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Tracking Progress
              </h3>
              
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200"></div>
                <div 
                  className="absolute left-4 top-8 w-0.5 bg-green-600 transition-all duration-500"
                  style={{
                    height: `${(trackingData.statusSteps.filter(step => step.completed).length - 1) * 100 / (trackingData.statusSteps.length - 1)}%`
                  }}
                ></div>

                {/* Status Steps */}
                <div className="space-y-8">
                  {trackingData.statusSteps.map((step, index) => (
                    <div key={step.key} className="relative flex items-start">
                      {/* Status Icon */}
                      <div className="relative z-10 bg-white">
                        {getStatusIcon(step)}
                      </div>
                      
                      {/* Status Content */}
                      <div className="ml-6 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {getStepIcon(step.key)}
                          <h4 className={`font-semibold ${
                            step.completed ? 'text-green-600' : 
                            step.current ? 'text-blue-600' : 'text-gray-400'
                          }`}>
                            {step.label}
                          </h4>
                        </div>
                        <p className={`text-sm ${
                          step.completed || step.current ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {trackingData.shipment.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Additional Notes</h4>
                <p className="text-blue-800">{trackingData.shipment.notes}</p>
              </div>
            )}

            {/* Customer Support */}
            <div className="bg-gray-100 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Need Help?
              </h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about your order, feel free to contact us.
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6">
                <div className="text-gray-700">
                  <strong>Email:</strong> info@certifurb.com
                </div>
                <div className="text-gray-700">
                  <strong>Phone:</strong> +92-333-123-4567
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sample Order IDs (for testing) */}
        {!trackingData && !loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-800 text-sm">
              <strong>For testing:</strong> Try entering any order ID from your recent orders
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TrackOrderPage; 