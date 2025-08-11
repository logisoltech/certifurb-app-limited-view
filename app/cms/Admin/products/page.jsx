'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Layout from '../../Components/Layout/Layout';
import { font } from "../../../Components/Font/font";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  EllipsisVerticalIcon,
  ArrowsUpDownIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const ProductsPage = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userRole, setUserRole] = useState('');
  const dropdownRefs = useRef({});

  // Get user role from localStorage
  useEffect(() => {
    const cmsUser = localStorage.getItem('cmsUser');
    if (cmsUser) {
      const userData = JSON.parse(cmsUser);
      setUserRole(userData.role || 'marketer');
    }
  }, []);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.certifurb.com/api/products');
        const result = await response.json();
        
        if (result.success) {
          setProducts(result.data);
          setFilteredProducts(result.data);
        } else {
          setError(result.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.ProductName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.ProductDesc.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.ProductID));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const formatPrice = (price) => {
    return `Rs. ${parseFloat(price)}`;
  };

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`https://api.certifurb.com/api/products/${productId}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        
        if (result.success) {
          // Remove product from state
          setProducts(products.filter(p => p.ProductID !== productId));
          setFilteredProducts(filteredProducts.filter(p => p.ProductID !== productId));
          alert('Product deleted successfully!');
        } else {
          alert('Failed to delete product: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
    setOpenDropdown(null);
  };

  const handleDropdownToggle = (productId, event) => {
    event.stopPropagation();
    event.preventDefault();
    
    if (openDropdown === productId) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(productId);
    }
  };

  // Simple click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      let clickedInside = false;
      
      Object.values(dropdownRefs.current).forEach(ref => {
        if (ref && ref.contains(event.target)) {
          clickedInside = true;
        }
      });
      
      if (!clickedInside) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className={`${font.className} p-6 bg-gray-50 min-h-screen flex items-center justify-center`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className={`${font.className} p-6 bg-gray-50 min-h-screen flex items-center justify-center`}>
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={`${font.className} p-6 bg-gray-50 min-h-screen`}>
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="text-blue-600 hover:underline cursor-pointer">Home</span>
          <span className="mx-2">›</span>
          <span className="text-blue-600 hover:underline cursor-pointer">Admin</span>
          <span className="mx-2">›</span>
          <span></span>
        </div>

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Products</h1>

        {/* Status Tabs */}
        <div className="flex items-center space-x-6 mb-6">
          <button className="text-blue-600 border-b-2 border-blue-600 pb-2 font-medium">
            All <span className="text-gray-500">({filteredProducts.length})</span>
          </button>
          <button className="text-gray-600 hover:text-gray-900 pb-2">
            Published <span className="text-gray-500">({products.length})</span>
          </button>
          <button className="text-gray-600 hover:text-gray-900 pb-2">
            Drafts <span className="text-gray-500">(0)</span>
          </button>
          <button className="text-gray-600 hover:text-gray-900 pb-2">
            On discount <span className="text-gray-500">(0)</span>
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
                placeholder="Search products"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-96"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-8 px-3 py-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>PRODUCT NAME</span>
                    <ArrowsUpDownIcon className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>PRICE</span>
                    <ArrowsUpDownIcon className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>CATEGORY</span>
                    <ArrowsUpDownIcon className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>TAGS</span>
                    <ArrowsUpDownIcon className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>VENDOR</span>
                    <ArrowsUpDownIcon className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>PUBLISHED ON</span>
                    <ArrowsUpDownIcon className="h-3 w-3" />
                  </div>
                </th>
                <th className="w-8 px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product, index) => (
                <tr key={product.ProductID} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.ProductID)}
                      onChange={(e) => handleSelectProduct(product.ProductID, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-shrink-0 w-8 h-8">
                        {product.ProductImageURL ? (
                          <img 
                            src={product.ProductImageURL} 
                            alt={product.ProductName}
                            className="w-8 h-8 rounded-md object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center"
                          style={{ display: product.ProductImageURL ? 'none' : 'flex' }}
                        >
                          <span className="text-xs text-gray-500 font-medium">
                            {product.ProductName?.charAt(0)?.toUpperCase() || 'P'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 max-w-xs">
                        <Link href={`/product/${product.ProductID}`} className="text-xs font-medium text-blue-600 hover:underline cursor-pointer truncate block">
                          {truncateText(product.ProductName)}
                        </Link>
                        <p className="text-xs text-gray-500 truncate">
                          {truncateText(product.ProductDesc, 30)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-900 font-medium">
                    {formatPrice(product.ProductPrice)}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-600">
                    {product.ProductCategory || 'Electronics'}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        ELECTRONICS
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        NEW
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center space-x-1">
                      <StarIcon className="h-3 w-3 text-yellow-400" />
                      <span className="text-xs text-blue-600 hover:underline cursor-pointer truncate max-w-32">
                        {product.ProductVendor || 'CertiFurb Store'}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-600">
                    {product.ProductPublishedOn || new Date().toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: 'numeric', 
                      minute: '2-digit', 
                      hour12: true 
                    })}
                  </td>
                  <td className="px-3 py-2">
                    <div 
                      className="relative"
                      ref={el => dropdownRefs.current[product.ProductID] = el}
                    >
                      <button 
                        onClick={(e) => handleDropdownToggle(product.ProductID, e)}
                        className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      >
                        <svg 
                          className="w-5 h-5" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      
                      {openDropdown === product.ProductID && (
                        <div className="absolute right-0 top-10 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                            Actions
                          </div>
                          
                          {userRole === 'admin' && (
                            <>
                              <Link 
                                href={`/cms/Admin/edit-product/${product.ProductID}`}
                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                                onClick={() => setOpenDropdown(null)}
                              >
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors">
                                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </div>
                                <div>
                                  <div className="font-medium">Edit Product</div>
                                  <div className="text-xs text-gray-500">Modify product details</div>
                                </div>
                              </Link>
                              
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDeleteProduct(product.ProductID);
                                }}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors group"
                              >
                                <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-lg mr-3 group-hover:bg-red-200 transition-colors">
                                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </div>
                                <div>
                                  <div className="font-medium">Delete Product</div>
                                  <div className="text-xs text-gray-500">Remove permanently</div>
                                </div>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && !loading && (
                <tr>
                  <td colSpan="8" className="px-3 py-8 text-center text-gray-500">
                    {searchTerm ? `No products found matching "${searchTerm}"` : 'No products found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;