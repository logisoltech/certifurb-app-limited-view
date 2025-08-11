'use client';
import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layout/Layout';
import { font } from "../../../Components/Font/font";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const AuctionRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [credentials, setCredentials] = useState({ userId: '', password: '' });
  const [processing, setProcessing] = useState(false);

  // Load auction requests from API
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`https://api.certifurb.com/api/auction/requests`);
      const data = await response.json();
      
      if (data.success) {
        setRequests(data.data);
      } else {
        setError(data.message || 'Failed to fetch auction requests');
      }
    } catch (error) {
      console.error('Error fetching auction requests:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!credentials.userId || !credentials.password) {
      alert('Please enter both User ID and Password');
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch(`https://api.certifurb.com/api/auction/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailAddress: selectedRequest.EmailAddress,
          userId: credentials.userId,
          password: credentials.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Auction Request Approved Successfully!');
        setShowApprovalModal(false);
        setSelectedRequest(null);
        setCredentials({ userId: '', password: '' });
        fetchRequests(); // Refresh the list
      } else {
        alert(data.message || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeny = async (emailAddress) => {
    if (!confirm('Are you sure you want to deny this request?')) {
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch(`https://api.certifurb.com/api/auction/deny`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailAddress }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Auction Request Denied!');
        fetchRequests(); // Refresh the list
      } else {
        alert(data.message || 'Failed to deny request');
      }
    } catch (error) {
      console.error('Error denying request:', error);
      alert('Failed to deny request');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRequests = requests.filter(request =>
    request.FirstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.LastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.EmailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.BusinessName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className={`${font.className} p-6 bg-gray-50 min-h-screen`}>
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Auction Access Requests</h1>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or business..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      Loading requests...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No auction requests found
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-green-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {request.FirstName} {request.LastName}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <EnvelopeIcon className="h-4 w-4 mr-1" />
                              {request.EmailAddress}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <PhoneIcon className="h-4 w-4 mr-1" />
                              {request.PhoneNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <BuildingOfficeIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {request.BusinessName || 'N/A'}
                          </div>
                          {request.Industry && (
                            <div className="text-xs text-gray-500 mt-1">
                              Industry: {request.Industry}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {request.City}, {request.Country}
                        </div>
                        <div className="text-xs text-gray-500">
                          {request.Address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <ClockIcon className="h-4 w-4 mr-1 text-orange-400" />
                          <span className="text-orange-600 font-medium">Pending</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowApprovalModal(true);
                            }}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            disabled={processing}
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeny(request.EmailAddress)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            disabled={processing}
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Request Details Modal */}
        {selectedRequest && !showApprovalModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Request Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-sm text-gray-900">{selectedRequest.FirstName} {selectedRequest.LastName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{selectedRequest.EmailAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{selectedRequest.PhoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-sm text-gray-900">{selectedRequest.Address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">City</p>
                    <p className="text-sm text-gray-900">{selectedRequest.City}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Country</p>
                    <p className="text-sm text-gray-900">{selectedRequest.Country}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Business Name</p>
                    <p className="text-sm text-gray-900">{selectedRequest.BusinessName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Industry</p>
                    <p className="text-sm text-gray-900">{selectedRequest.Industry || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="text-sm text-orange-600 font-medium">Pending Approval</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowApprovalModal(true);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleDeny(selectedRequest.EmailAddress);
                      setSelectedRequest(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Deny
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Approval Credentials Modal */}
        {showApprovalModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Set Login Credentials</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Set User ID and Password for {selectedRequest?.FirstName} {selectedRequest?.LastName}
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                    <input
                      type="text"
                      value={credentials.userId}
                      onChange={(e) => setCredentials({...credentials, userId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="AU123456789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="text"
                      value={credentials.password}
                      onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Password123"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowApprovalModal(false);
                      setCredentials({ userId: '', password: '' });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    disabled={processing}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                    disabled={processing}
                  >
                    {processing ? 'Approving...' : 'Approve Request'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AuctionRequestsPage; 