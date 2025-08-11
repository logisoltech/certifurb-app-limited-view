"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../Components/Layout/Layout";
import { font } from "../../../Components/Font/font";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  EllipsisVerticalIcon,
  ArrowsUpDownIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  CreditCardIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

const OrdersPage = () => {
  const router = useRouter();
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);

  // Load orders from API
  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(
        `https://api.certifurb.com/api/cms/orders?${params}`
      );
      const data = await response.json();

      if (data.success) {
        console.log("Orders data received:", data.data.orders);
        console.log("Sample order customer:", data.data.orders[0]?.customer);
        console.log(
          "Sample customer email:",
          data.data.orders[0]?.customer?.email
        );
        setOrders(data.data.orders);
        setTotalPages(data.data.pagination.totalPages);
        setTotalOrders(data.data.pagination.totalItems);
      } else {
        setError(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      fetchOrders();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(orders.map((o) => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId, checked) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    }
  };

  const handleOrderClick = async (order) => {
    setSelectedOrder(order);
    setShowOrderDialog(true);
    setLoadingOrderDetails(true);
    
    try {
      // Fetch detailed order information
      const response = await fetch(
        `https://api.certifurb.com/api/cms/orders/${order.id}`
      );
      const data = await response.json();
      
      if (data.success) {
        setOrderDetails(data.data);
      } else {
        console.error("Failed to fetch order details:", data.message);
        setOrderDetails(null);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setOrderDetails(null);
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  const getAvatarColor = (index) => {
    const colors = [
      "bg-orange-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-red-500",
    ];
    return colors[index % colors.length];
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getShipmentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className={`${font.className} p-6 bg-gray-50 min-h-screen`}>
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="text-blue-600 hover:underline cursor-pointer">
            Home
          </span>
          <span className="mx-2">›</span>
          <span className="text-blue-600 hover:underline cursor-pointer">
            Admin
          </span>
          <span className="mx-2">›</span>
          <span>Orders</span>
        </div>

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Orders</h1>

        {/* Status Tabs */}
        <div className="flex items-center space-x-6 mb-6">
          <button className="text-blue-600 border-b-2 border-blue-600 pb-2 font-medium">
            All <span className="text-gray-500">({totalOrders})</span>
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
                placeholder="Search orders, customers, or products"
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
                onClick={fetchOrders}
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
              <span className="ml-3 text-gray-600">Loading orders...</span>
            </div>
          </div>
        )}

        {/* Orders Table */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {orders.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-500 mb-2">No orders found</div>
                <div className="text-sm text-gray-400">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Orders will appear here when customers place them"}
                </div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-8 px-3 py-2 text-left">
                      <input
                        type="checkbox"
                        checked={
                          orders.length > 0 &&
                          selectedOrders.length === orders.length
                        }
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
                        <span>TOTAL</span>
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
                        <span>QUANTITY</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>PAYMENT STATUS</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>DATE</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="w-8 px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order, index) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={(e) =>
                            handleSelectOrder(order.id, e.target.checked)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2 text-xs text-blue-600 hover:underline cursor-pointer font-medium" onClick={() => handleOrderClick(order)}>
                        {order.orderNumber}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-900 font-medium">
                        {order.total}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex-shrink-0 w-8 h-8">
                            <div
                              className={`w-8 h-8 ${getAvatarColor(
                                index
                              )} rounded-full flex items-center justify-center text-white text-xs font-medium`}
                            >
                              {getInitials(order.customer.name)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs font-medium truncate ${
                                order.customer.email
                                  ? "text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                  : "text-gray-900"
                              }`}
                              onClick={() => {
                                if (order.customer.email) {
                                  const encodedEmail = encodeURIComponent(
                                    order.customer.email
                                  );
                                  router.push(
                                    `/cms/Admin/orders/${encodedEmail}`
                                  );
                                } else {
                                  console.log("No customer email available");
                                }
                              }}
                            >
                              {order.customer.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {order.customer.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-xs text-gray-900 font-medium truncate">
                          {order.product?.name || "Unknown Product"}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {order.quantity}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${order.paymentStatus.color}`}
                        >
                          {order.paymentStatus.text}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {order.date}
                      </td>
                      <td className="px-3 py-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <EllipsisVerticalIcon className="h-4 w-4" />
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
                Showing {(currentPage - 1) * 10 + 1} to{" "}
                {Math.min(currentPage * 10, totalOrders)} of {totalOrders}{" "}
                results
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    {totalPages > 6 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        currentPage === totalPages
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Order Details Dialog */}
        {showOrderDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-2 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Details - {selectedOrder?.orderNumber}
                </h2>
                <button
                  onClick={() => {
                    setShowOrderDialog(false);
                    setSelectedOrder(null);
                    setOrderDetails(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
                {loadingOrderDetails ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading order details...</span>
                  </div>
                ) : orderDetails ? (
                  <div className="space-y-8">
                    {/* Product and Order Details Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Product Image */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product</h3>
                        <div className="flex flex-col space-y-4">
                          <div className="flex-shrink-0">
                            {orderDetails.product?.images ? (
                              <img
                                src={orderDetails.product.images}
                                alt={orderDetails.product?.name || "Product"}
                                className="w-full h-60 object-contain"
                              />
                            ) : (
                              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400 text-sm">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900">
                              {orderDetails.product?.name || "Unknown Product"}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Product ID: {orderDetails.product?.id || "N/A"}
                            </p>
                            {orderDetails.product?.specs && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500">Specifications:</p>
                                <p className="text-sm text-gray-700">
                                  {Array.isArray(orderDetails.product.specs) 
                                    ? orderDetails.product.specs.join(", ")
                                    : orderDetails.product.specs}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Order Number:</span>
                            <span className="text-sm text-gray-900 font-semibold">{orderDetails.orderNumber || selectedOrder?.orderNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Order Date:</span>
                            <span className="text-sm text-gray-900">{formatDate(orderDetails.orderDate || selectedOrder?.date)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Quantity:</span>
                            <span className="text-sm text-gray-900">{orderDetails.quantity || selectedOrder?.quantity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Unit Price:</span>
                            <span className="text-sm text-gray-900">
                              PKR {orderDetails.unitPrice || orderDetails.product?.price || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Total Amount:</span>
                            <span className="text-sm text-gray-900 font-semibold">
                              PKR {orderDetails.totalAmount || selectedOrder?.total}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Payment Method:</span>
                            <span className="text-sm text-gray-900">{orderDetails.paymentMethod || "N/A"}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Payment Status:</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(orderDetails.paymentStatus)}`}>
                              {orderDetails.paymentStatus || "Unknown"}
                            </span>
                          </div>
                          {orderDetails.shipment && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600">Shipment Status:</span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getShipmentStatusColor(orderDetails.shipment.status)}`}>
                                {orderDetails.shipment.status || "N/A"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Customer Information Section */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <UserIcon className="h-5 w-5 mr-2" />
                        Customer Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Customer Info */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 ${getAvatarColor(0)} rounded-full flex items-center justify-center text-white font-medium`}>
                              {getInitials(orderDetails.customer?.name || "Unknown")}
                            </div>
                            <div>
                              <h4 className="text-lg font-medium text-gray-900">
                                {orderDetails.customer?.name || selectedOrder?.customer?.name || "Unknown Customer"}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Customer ID: {orderDetails.customer?.id || "N/A"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900">
                                {orderDetails.customer?.email || selectedOrder?.customer?.email || "No email provided"}
                              </span>
                            </div>
                            {orderDetails.customer?.phone && (
                              <div className="flex items-center space-x-3">
                                <PhoneIcon className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-900">
                                  {orderDetails.customer.phone}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center space-x-3">
                              <CalendarIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900">
                                Member since: {formatDate(orderDetails.customer?.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="space-y-4">
                          <h5 className="text-md font-medium text-gray-900 flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-2" />
                            Shipping Address
                          </h5>
                          {orderDetails.shippingAddress ? (
                            <div className="text-sm text-gray-700 space-y-1">
                              <p>{orderDetails.shippingAddress.street || "N/A"}</p>
                              <p>{orderDetails.shippingAddress.city || "N/A"}</p>
                              <p>{orderDetails.shippingAddress.state || "N/A"}</p>
                              <p>{orderDetails.shippingAddress.postalCode || "N/A"}</p>
                              <p>{orderDetails.shippingAddress.country || "N/A"}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No shipping address provided</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Shipment Information */}
                    {orderDetails.shipment && (
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <TruckIcon className="h-5 w-5 mr-2" />
                          Shipment Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600">Tracking Number:</span>
                              <span className="text-sm text-gray-900">{orderDetails.shipment.trackingNumber || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600">Courier Service:</span>
                              <span className="text-sm text-gray-900">{orderDetails.shipment.courierService || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600">Estimated Delivery:</span>
                              <span className="text-sm text-gray-900">{formatDate(orderDetails.shipment.estimatedDelivery)}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600">Status Updated:</span>
                              <span className="text-sm text-gray-900">{formatDate(orderDetails.shipment.statusUpdatedAt)}</span>
                            </div>
                            {orderDetails.shipment.notes && (
                              <div>
                                <span className="text-sm font-medium text-gray-600">Notes:</span>
                                <p className="text-sm text-gray-900 mt-1">{orderDetails.shipment.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Refund Information */}
                    {orderDetails.refund && (
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600">Refund Status:</span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(orderDetails.refund.status)}`}>
                                {orderDetails.refund.status}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600">Refund Amount:</span>
                              <span className="text-sm text-gray-900">PKR {orderDetails.refund.amount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600">Requested Date:</span>
                              <span className="text-sm text-gray-900">{formatDate(orderDetails.refund.requestedAt)}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm font-medium text-gray-600">Refund Reason:</span>
                              <p className="text-sm text-gray-900 mt-1">{orderDetails.refund.reason}</p>
                            </div>
                            {orderDetails.refund.adminResponse && (
                              <div>
                                <span className="text-sm font-medium text-gray-600">Admin Response:</span>
                                <p className="text-sm text-gray-900 mt-1">{orderDetails.refund.adminResponse}</p>
                              </div>
                            )}
                            {orderDetails.refund.processedAt && (
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-600">Processed Date:</span>
                                <span className="text-sm text-gray-900">{formatDate(orderDetails.refund.processedAt)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-2">Failed to load order details</div>
                    <div className="text-sm text-gray-400">
                      Please try again or contact support if the problem persists.
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end p-3 border-t bg-gray-50">
                <button
                  onClick={() => {
                    setShowOrderDialog(false);
                    setSelectedOrder(null);
                    setOrderDetails(null);
                  }}
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrdersPage;
