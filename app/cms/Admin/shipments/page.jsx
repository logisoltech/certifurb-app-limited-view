'use client';
import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layout/Layout';
import { font } from "../../../Components/Font/font";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  EllipsisVerticalIcon,
  ArrowsUpDownIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  TruckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const ShipmentsPage = () => {
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalShipments, setTotalShipments] = useState(0);
  const [editingShipment, setEditingShipment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const router = useRouter();

  // Load shipments from API
  useEffect(() => {
    fetchShipments();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      const response = await fetch(`https://api.certifurb.com/api/cms/shipments?${params}`);
      const data = await response.json();
      
      console.log('Fetched shipments data:', data); // Debug log
      
      if (data.success) {
        setShipments(data.data.shipments);
        setTotalPages(data.data.pagination.totalPages);
        setTotalShipments(data.data.pagination.totalItems);
        
        // Debug: Check if shipping addresses are present
        data.data.shipments.forEach((shipment, index) => {
          console.log(`Shipment ${index}:`, {
            id: shipment.id,
            shippingAddress: shipment.shippingAddress,
            hasAddress: !!shipment.shippingAddress
          });
        });
      } else {
        setError(data.message || 'Failed to fetch shipments');
      }
    } catch (error) {
      console.error('Error fetching shipments:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchShipments();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedShipments(shipments.map(s => s.id));
    } else {
      setSelectedShipments([]);
    }
  };

  const handleSelectShipment = (shipmentId, checked) => {
    if (checked) {
      setSelectedShipments([...selectedShipments, shipmentId]);
    } else {
      setSelectedShipments(selectedShipments.filter(id => id !== shipmentId));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Out for Delivery':
        return 'bg-orange-100 text-orange-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const handleEditShipment = (shipment) => {
    console.log('Editing shipment:', shipment); // Debug log
    setEditingShipment({
      ...shipment,
      shipmentStatus: shipment.status,
      estimatedDelivery: shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toISOString().split('T')[0] : '',
      shippingAddress: shipment.shippingAddress || shipment.address || '' // Ensure shipping address is included
    });
    setShowEditModal(true);
  };

  const handleUpdateShipment = async (e) => {
    e.preventDefault();
    
    console.log('Updating shipment with data:', editingShipment); // Debug log
    
    try {
      const updateData = {
        shipmentStatus: editingShipment.shipmentStatus,
        trackingNumber: editingShipment.trackingNumber,
        estimatedDelivery: editingShipment.estimatedDelivery || null,
        shippingAddress: editingShipment.shippingAddress,
        courierService: editingShipment.courierService,
        notes: editingShipment.notes
      };
      
      console.log('Sending update data:', updateData); // Debug log
      
      const response = await fetch(`https://api.certifurb.com/api/cms/shipments/${editingShipment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      console.log('Update response:', data); // Debug log
      
      if (data.success) {
        setShowEditModal(false);
        setEditingShipment(null);
        fetchShipments(); // Refresh the list
      } else {
        setError(data.message || 'Failed to update shipment');
      }
    } catch (error) {
      console.error('Error updating shipment:', error);
      setError('Failed to update shipment');
    }
  };

  const statusOptions = [
    'Order Placed',
    'Processing', 
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ];

  return (
    <Layout>
      <div className={`${font.className} p-6 bg-gray-50 min-h-screen`}>
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="text-blue-600 hover:underline cursor-pointer">Home</span>
          <span className="mx-2">›</span>
          <span className="text-blue-600 hover:underline cursor-pointer">Admin</span>
          <span className="mx-2">›</span>
          <span>Shipments</span>
        </div>

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Shipment Management</h1>

        {/* Status Tabs */}
        <div className="flex items-center space-x-6 mb-6">
          <button 
            onClick={() => setStatusFilter('all')}
            className={`pb-2 font-medium ${statusFilter === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            All <span className="text-gray-500">({totalShipments})</span>
          </button>
          <button 
            onClick={() => setStatusFilter('Order Placed')}
            className={`pb-2 font-medium ${statusFilter === 'Order Placed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Order Placed <span className="text-gray-500">({shipments.filter(s => s.status === 'Order Placed').length})</span>
          </button>
          <button 
            onClick={() => setStatusFilter('Processing')}
            className={`pb-2 font-medium ${statusFilter === 'Processing' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Processing <span className="text-gray-500">({shipments.filter(s => s.status === 'Processing').length})</span>
          </button>
          <button 
            onClick={() => setStatusFilter('Shipped')}
            className={`pb-2 font-medium ${statusFilter === 'Shipped' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Shipped <span className="text-gray-500">({shipments.filter(s => s.status === 'Shipped').length})</span>
          </button>
          <button 
            onClick={() => setStatusFilter('Delivered')}
            className={`pb-2 font-medium ${statusFilter === 'Delivered' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Delivered <span className="text-gray-500">({shipments.filter(s => s.status === 'Delivered').length})</span>
          </button>
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, customers, tracking numbers"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-96"
              />
            </div>
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
                onClick={fetchShipments}
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
              <span className="ml-3 text-gray-600">Loading shipments...</span>
            </div>
          </div>
        )}

        {/* Shipments Table */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {shipments.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-500 mb-2">No shipments found</div>
                <div className="text-sm text-gray-400">
                  {searchTerm ? 'Try adjusting your search terms' : 'Shipments will appear here when orders are placed'}
                </div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-8 px-3 py-2 text-left">
                      <input
                        type="checkbox"
                        checked={shipments.length > 0 && selectedShipments.length === shipments.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>ORDER</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>CUSTOMER</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>PRODUCT</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>STATUS</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>TRACKING</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>LAST UPDATED</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="w-8 px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shipments.map((shipment, index) => (
                    <tr key={shipment.id || `shipment-${index}`} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedShipments.includes(shipment.id)}
                          onChange={(e) => handleSelectShipment(shipment.id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2 text-xs text-blue-600 hover:underline cursor-pointer font-medium">
                        {shipment.orderNumber}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex-shrink-0 w-8 h-8">
                            <div className={`w-8 h-8 ${getAvatarColor(index)} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                              {getInitials(shipment.customer.name)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-blue-600 hover:underline cursor-pointer truncate"
                            onClick={() => router.push(`/cms/Admin/orders/${shipment.customer.id}`)}
                            >
                              {shipment.customer.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {shipment.customer.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-1 py-2">
                        <div className="text-xs text-gray-900 font-medium truncate">
                          {shipment.product?.name || 'Unknown Product'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Qty: {shipment.quantity} • {shipment.total}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                          {shipment.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {shipment.trackingNumber || 'Not assigned'}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {shipment.lastUpdated}
                      </td>
                      <td className="px-3 py-2">
                        <button 
                          onClick={() => handleEditShipment(shipment)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit shipment"
                        >
                          <TruckIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm mt-4">
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalShipments)} of {totalShipments} results
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={`page-${pageNum}`}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    {totalPages > 6 && <span key="ellipsis" className="px-2 text-gray-400">...</span>}
                    <button
                      key={`page-last-${totalPages}`}
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        currentPage === totalPages
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Shipment Modal */}
      {showEditModal && editingShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Update Shipment - {editingShipment.orderNumber}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateShipment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipment Status *
                  </label>
                  <select
                    value={editingShipment.shipmentStatus}
                    onChange={(e) => setEditingShipment({...editingShipment, shipmentStatus: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={editingShipment.trackingNumber || ''}
                    onChange={(e) => setEditingShipment({...editingShipment, trackingNumber: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter tracking number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Delivery
                  </label>
                  <input
                    type="date"
                    value={editingShipment.estimatedDelivery || ''}
                    onChange={(e) => setEditingShipment({...editingShipment, estimatedDelivery: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Courier Service
                  </label>
                  <select
                    value={editingShipment.courierService || 'TCS'}
                    onChange={(e) => setEditingShipment({...editingShipment, courierService: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="TCS">TCS</option>
                    <option value="M&P">M&P</option>
                    <option value="Leopard">Leopard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Address
                </label>
                <textarea
                  value={editingShipment.shippingAddress || ''}
                  onChange={(e) => setEditingShipment({...editingShipment, shippingAddress: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter or update shipping address"
                />
                {editingShipment.shippingAddress && (
                  <p className="text-xs text-gray-500 mt-1">
                    Current address from database will be updated when you save changes
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={editingShipment.notes || ''}
                  onChange={(e) => setEditingShipment({...editingShipment, notes: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Add any additional notes about the shipment"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ShipmentsPage; 