'use client';

import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layout/Layout';
import { Geist } from 'next/font/google';
import Image from 'next/image';
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const font = Geist({
    subsets: ['latin'],
});

const Refund = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [refundAction, setRefundAction] = useState(''); // 'accept' or 'deny'

    useEffect(() => {
        fetchOrders();
    }, [currentPage, searchTerm]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const params = new URLSearchParams({
                page: currentPage,
                limit: 10,
                search: searchTerm
            });
            
            const response = await fetch(`https://api.certifurb.com/api/cms/refunds?${params}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                setOrders(data.data.refunds);
                setTotalPages(data.data.pagination.totalPages);
            } else {
                setError(data.message || 'Failed to fetch refunds');
            }
        } catch (error) {
            console.error('Error fetching refunds:', error);
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const handleRefund = async (refundId, action) => {
        if (!action) {
            alert('Please select an action');
            return;
        }

        try {
            const response = await fetch(`https://api.certifurb.com/api/cms/refunds/${refundId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: action, // 'accept' or 'deny'
                    adminNotes: action === 'deny' ? 'Refund denied by admin' : 'Refund approved by admin'
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                alert(`Refund ${action === 'accept' ? 'accepted' : 'denied'} successfully!`);
                setRefundAction('');
                setSelectedOrder(null);
                fetchOrders(); // Refresh refunds
            } else {
                alert(data.message || 'Failed to process refund');
            }
        } catch (error) {
            console.error('Error processing refund:', error);
            alert('Error processing refund. Please try again.');
        }
    };

    const filteredOrders = orders.filter(refund =>
        refund.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        refund.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        refund.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        refund.refundReason?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRefundStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'APPROVED':
                return 'bg-green-100 text-green-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            case 'PROCESSED':
                return 'bg-blue-100 text-blue-800';
            case 'CANCELLED':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
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

    return (
        <Layout>
            <div className={`${font.className} p-6 bg-gray-50 min-h-screen`}>
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span>Home</span>
                    <span className="mx-2">›</span>
                    <span>Admin</span>
                    <span className="mx-2">›</span>
                    <span>Refund</span>
                </div>

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Refund Management</h1>
                        <p className="text-gray-600 mt-1">Process refunds for customer orders</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search refunds by order number, customer name, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Orders List */}
                {!loading && !error && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order #
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Refund Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Refund Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Requested Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredOrders.map((refund, index) => (
                                        <tr key={refund.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {refund.orderNumber}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {refund.date}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(index)}`}>
                                                        {getInitials(refund.customer.name)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {refund.customer.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {refund.customer.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {refund.product.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Qty: {refund.quantity}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                PKR {refund.refundAmount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRefundStatusColor(refund.status)}`}>
                                                  {refund.status}
                                                </span>
                                            </td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(refund.requestedAt).toLocaleDateString()}
                                              </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => setSelectedOrder(refund)}
                                                    className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                                                >
                                                    Process Refund
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing page <span className="font-medium">{currentPage}</span> of{' '}
                                            <span className="font-medium">{totalPages}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            <button
                                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                disabled={currentPage === 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeftIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                disabled={currentPage === totalPages}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronRightIcon className="h-5 w-5" />
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Refund Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Process Refund for {selectedOrder.orderNumber}
                                </h3>
                                
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-2">Customer: {selectedOrder.customer.name}</p>
                                    <p className="text-sm text-gray-600 mb-2">Product: {selectedOrder.product.name}</p>
                                    <p className="text-sm text-gray-600 mb-2">Refund Amount: PKR {selectedOrder.refundAmount}</p>
                                    <p className="text-sm text-gray-600 mb-2">Refund Reason: {selectedOrder.refundReason}</p>
                                    <p className="text-sm text-gray-600 mb-4">Status: <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRefundStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
                                    
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Refund Action
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => handleRefund(selectedOrder.id, 'accept')}
                                            disabled={selectedOrder.status !== 'PENDING'}
                                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                                selectedOrder.status === 'PENDING'
                                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            Accept Refund
                                        </button>
                                        <button
                                            onClick={() => handleRefund(selectedOrder.id, 'deny')}
                                            disabled={selectedOrder.status !== 'PENDING'}
                                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                                selectedOrder.status === 'PENDING'
                                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            Deny Refund
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setSelectedOrder(null);
                                            setRefundAction('');
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                    >
                                        Cancel
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

export default Refund;