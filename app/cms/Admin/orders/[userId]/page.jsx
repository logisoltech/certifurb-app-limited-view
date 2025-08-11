'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../../../Components/Layout/Layout';
import { font } from "../../../../Components/Font/font";
import {
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const UserOrdersPage = () => {
  const params = useParams();
  const router = useRouter();
  const userEmail = params.userId; // The param is still userId but contains email
  
  const [userOrders, setUserOrders] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [shipmentAddress, setShipmentAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (userEmail) {
      console.log('User orders page - userEmail:', userEmail);
      console.log('Decoded userEmail:', decodeURIComponent(userEmail));
      fetchUserOrders();
      fetchUserInfo();
      fetchShipmentAddress();
    }
  }, [userEmail]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const decodedEmail = decodeURIComponent(userEmail);
      console.log('Fetching orders for decoded email:', decodedEmail);
      console.log('Orders API URL:', `https://api.certifurb.com/api/cms/orders/user/${decodedEmail}`);
      
      const response = await fetch(`https://api.certifurb.com/api/cms/orders/user/${decodedEmail}`);
      console.log('Orders response status:', response.status);
      console.log('Orders response ok:', response.ok);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('User not found in database');
          return; // Don't throw error for 404, just return gracefully
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('User orders response:', data);
      
      if (data.success) {
        setUserOrders(data.data);
        console.log('User orders set:', data.data);
      } else {
        console.error('User orders API error:', data.message);
        console.error('Full orders error response:', data);
        setError(data.message || 'Failed to fetch user orders');
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
      console.error('Orders error details:', {
        message: error.message,
        stack: error.stack,
        userEmail: userEmail,
        decodedEmail: decodeURIComponent(userEmail)
      });
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const decodedEmail = decodeURIComponent(userEmail);
      console.log('Fetching user info for email:', decodedEmail);
      console.log('API URL:', `https://api.certifurb.com/api/cms/users/${decodedEmail}`);
      
      const response = await fetch(`https://api.certifurb.com/api/cms/users/${decodedEmail}`);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('User not found in database');
          return; // Don't throw error for 404, just return gracefully
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('User info response:', data);
      
      if (data.success) {
        setUserInfo(data.data);
        console.log('User info set:', data.data);
      } else {
        console.error('User info API error:', data.message);
        console.error('Full error response:', data);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        userEmail: userEmail,
        decodedEmail: decodeURIComponent(userEmail)
      });
    }
  };

  const fetchShipmentAddress = async () => {
    try {
      const decodedEmail = decodeURIComponent(userEmail);
      console.log('Fetching shipment address for email:', decodedEmail);
      
      const response = await fetch(`https://api.certifurb.com/api/shipment-address/${decodedEmail}`);
      console.log('Shipment address response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Shipment address response:', data);
        
        if (data.success && data.data) {
          setShipmentAddress(data.data);
          console.log('Shipment address set:', data.data);
        } else {
          console.log('No shipment address found for user');
          setShipmentAddress('');
        }
      } else {
        console.log('Shipment address not found or error occurred');
        setShipmentAddress('');
      }
    } catch (error) {
      console.error('Error fetching shipment address:', error);
      setShipmentAddress('');
    }
  };

  const getAvatarColor = (index) => {
    const colors = [
      'bg-orange-500',
      'bg-blue-500', 
      'bg-green-500',
      'bg-purple-500',
      'bg-red-500'
    ];
    return colors[index % colors.length];
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredOrders = userOrders.filter(order =>
    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSpent = userOrders.reduce((sum, order) => {
    const amount = parseFloat(order.total.replace(/[^0-9.]/g, ''));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  return (
    <Layout>
      <div className={`${font.className} p-6 bg-gray-50 min-h-screen`}>
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span 
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => router.push('/cms/Admin/orders')}
          >
            Orders
          </span>
          <span className="mx-2">›</span>
          <span>User Orders</span>
        </div>

        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/cms/Admin/orders')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Orders</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {userInfo ? `${userInfo.UserName} ${userInfo.UserLastName}` : decodeURIComponent(userEmail)} Orders
              </h1>
              <p className="text-gray-600 mt-1">
                Complete order history and customer profile
              </p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        {(userInfo || userEmail) && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Profile Section */}
              <div className="lg:col-span-2">
                                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-shrink-0 w-20 h-20">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {userInfo ? getInitials(userInfo.UserName + ' ' + userInfo.UserLastName) : getInitials(decodeURIComponent(userEmail))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {userInfo ? `${userInfo.UserName} ${userInfo.UserLastName}` : decodeURIComponent(userEmail)}
                      </h2>
                      <p className="text-gray-600">Customer Profile</p>
                    </div>
                  </div>
                
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <EnvelopeIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{userInfo ? userInfo.UserEmail : decodeURIComponent(userEmail)}</span>
                      </div>
                      {/* Phone field removed - not available in database */}
                    </div>
                  </div>
                  
                  {/* Address Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Shipment Address</h3>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <MapPinIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div className="flex-1">
                          {shipmentAddress ? (
                            <span className="text-sm text-gray-700 whitespace-pre-line">{shipmentAddress}</span>
                          ) : (
                            <span className="text-sm text-gray-500">No shipment address found</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Account Information */}
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-500">User Role</span>
                      <p className="text-sm text-gray-700">
                        {userInfo?.UserRole || 'Customer'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Email Verified</span>
                      <p className="text-sm text-gray-700">
                        {userInfo?.IsEmailVerified ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order Statistics */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Statistics</h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {userOrders.length}
                      </div>
                      <div className="text-sm text-gray-600">Total Orders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        PKR {totalSpent.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total Spent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-600">
                        {userOrders.length > 0 ? (totalSpent / userOrders.length).toFixed(0) : 0}
                      </div>
                      <div className="text-sm text-gray-600">Average Order Value</div>
                    </div>
                    {userOrders.length > 0 && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">
                          {new Date(userOrders[0].date).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-sm text-gray-600">Latest Order</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders or products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-800">
                <strong>Error:</strong> {error}
              </div>
              <button
                onClick={fetchUserOrders}
                className="ml-4 text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading user orders...</span>
            </div>
          </div>
        )}

        {/* Orders Table */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-500 mb-2">
                  {searchTerm ? 'No orders match your search' : 'No orders found for this user'}
                </div>
                <div className="text-sm text-gray-400">
                  {searchTerm ? 'Try adjusting your search terms' : 'This user has not placed any orders yet'}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ORDER DETAILS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PRODUCT INFORMATION
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        QUANTITY & PRICING
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PAYMENT & STATUS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ORDER DATE
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order, index) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer">
                              {order.orderNumber}
                            </span>
                            <span className="text-xs text-gray-500">Order ID: {order.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            {order.product?.image && (
                              <img 
                                src={order.product.image} 
                                alt={order.product.name}
                                className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {order.product?.name || 'Unknown Product'}
                              </div>
                              {order.product?.image && (
                                <div className="text-xs text-gray-500">Product ID: {order.id}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              Qty: {order.quantity}
                            </span>
                            <span className="text-sm font-semibold text-green-600">
                              {order.total}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${order.paymentStatus.color}`}>
                              {order.paymentStatus.text}
                            </span>
                            <span className="text-xs text-gray-500">
                              Payment Method: Online
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {order.date}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(order.date).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserOrdersPage; 