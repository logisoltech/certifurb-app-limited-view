"use client";
import React, { useState, useEffect } from "react";
import Layout from "../../Components/Layout/Layout";
import { font } from "../../../Components/Font/font";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  EllipsisVerticalIcon,
  ArrowsUpDownIcon,
  DocumentArrowDownIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const CustomersPage = () => {
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const router = useRouter();

  // Load customers from API
  useEffect(() => {
    fetchCustomers();
  }, [currentPage, searchTerm]);

  const fetchCustomers = async () => {
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
        `https://api.certifurb.com/api/cms/customers?${params}`
      );
      const data = await response.json();

      if (data.success) {
        setCustomers(data.data.customers);
        setTotalPages(data.data.pagination.totalPages);
        setTotalCustomers(data.data.pagination.totalItems);
      } else {
        setError(data.message || "Failed to fetch customers");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      fetchCustomers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCustomers(customers.map((c) => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId, checked) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, customerId]);
    } else {
      setSelectedCustomers(selectedCustomers.filter((id) => id !== customerId));
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
          <span>Customers</span>
        </div>

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Customers</h1>

        {/* Status Tabs */}
        <div className="flex items-center space-x-6 mb-6">
          <button className="text-blue-600 border-b-2 border-blue-600 pb-2 font-medium">
            All <span className="text-gray-500">({totalCustomers})</span>
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
                placeholder="Search customers by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-96"
              />
            </div>
          </div>

          {/* Action Buttons */}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-800">
                <strong>Error:</strong> {error}
              </div>
              <button
                onClick={fetchCustomers}
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
              <span className="ml-3 text-gray-600">Loading customers...</span>
            </div>
          </div>
        )}

        {/* Customers Table */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {customers.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-500 mb-2">No customers found</div>
                <div className="text-sm text-gray-400">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Customers will appear here when they register"}
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
                          customers.length > 0 &&
                          selectedCustomers.length === customers.length
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>CUSTOMER</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>EMAIL</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>ORDERS</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>TOTAL SPENT</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>HAS CARD</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>LAST ORDER</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="w-8 px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer, index) => (
                    <tr
                      key={customer.id || `customer-${index}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={(e) =>
                            handleSelectCustomer(customer.id, e.target.checked)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex-shrink-0 w-8 h-8">
                            <div
                              className={`w-8 h-8 ${getAvatarColor(
                                index
                              )} rounded-full flex items-center justify-center text-white text-xs font-medium`}
                            >
                              {getInitials(customer.name)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-blue-600 truncate hover:underline cursor-pointer"
                            onClick={() => {
                              if (customer.email) {
                                const encodedEmail = encodeURIComponent(
                                  customer.email
                                );
                                router.push(
                                  `/cms/Admin/orders/${encodedEmail}`
                                );
                              } else {
                                console.log("No customer email available");
                              }
                            }}>
                              {customer.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-900">
                        {customer.email}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-900 font-medium">
                        {customer.orders}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-900 font-medium">
                        {customer.totalSpent}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            customer.hasCard
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {customer.hasCard ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {customer.lastOrderDate}
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
                {Math.min(currentPage * 10, totalCustomers)} of {totalCustomers}{" "}
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
                      key={`page-${pageNum}`}
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
                      <span key="ellipsis" className="px-2 text-gray-400">
                        ...
                      </span>
                    )}
                    <button
                      key={`page-last-${totalPages}`}
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
      </div>
    </Layout>
  );
};

export default CustomersPage;
