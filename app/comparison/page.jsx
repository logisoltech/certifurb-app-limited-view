"use client";

import React, { useState, useEffect } from 'react'
import Navbar from '../Components/Layout/Navbar'
import Footer from '../Components/Layout/Footer'
import { font } from '../Components/Font/font'
import { FaChevronLeft, FaChevronRight, FaRegHeart, FaHeart, FaTimes, FaExclamationTriangle } from 'react-icons/fa'
import { useSearchParams } from 'next/navigation'
import { formatPrice } from '../utils/priceFormatter'
import { useCurrency } from '../context/CurrencyContext'
import { useFavorites } from '../context/FavoritesContext'

const page = () => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { convertPriceString, selectedCountry } = useCurrency();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct1, setSelectedProduct1] = useState(null);
  const [selectedProduct2, setSelectedProduct2] = useState(null);
  const [searchTerm1, setSearchTerm1] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryError, setCategoryError] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  const visibleCount = 5;
  const maxIndex = Math.max(0, filteredProducts.length - visibleCount);
  const handlePrev = () => setCarouselIndex(i => Math.max(0, i - 1));
  const handleNext = () => setCarouselIndex(i => Math.min(maxIndex, i + 1));

  // Fetch all products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.certifurb.com/api/products');
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.data);
          setFilteredProducts(data.data);
        } else {
          setError(data.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Re-render when currency changes
  useEffect(() => {
    console.log('Comparison: Currency changed to:', selectedCountry);
  }, [selectedCountry]);

  // Handle pre-selection from URL parameters
  useEffect(() => {
    const product1Id = searchParams.get('product1');
    
    if (product1Id && products.length > 0) {
      // For sample product from static page
      if (product1Id === 'sample') {
        // Use the sample product data from the static page
        const sampleProduct = {
          ProductID: 'sample',
          ProductName: 'Thinkpad T470 Core i5 6th Gen',
          ProductCategory: 'Laptop',
          ProductPrice: 130000,
          ProductImageURL: '/laptop.png',
          ProductModel: 'Lenovo ThinkPad T470',
          ProductBrand: 'Lenovo',
          ProductCpu: 'Core i5 - 6th Gen',
          ProductRam: '8 GB, 16 GB',
          ProductStorage: '128 GB SSD, 256 GB SSD',
          ProductGraphics: 'Intel HD Graphics',
          ProductScreenSize: '14"',
          ProductResolution: '1366 x 768',
          ProductOs: 'Windows 10',
          ProductWeight: '3.5 lbs',
          ProductBattery: 'Up to 8 hours',
          ProductKeyboard: 'English/Arabic Backlit',
          ProductBluetooth: '4.0 wireless technology',
          ProductWifi: '802.11ac Wi-Fi wireless networking',
          ProductCamera: '720p HD camera',
          ProductAudio: 'Stereo speakers | Dual microphones'
        };
        setSelectedProduct1(sampleProduct);
        setSearchTerm1(sampleProduct.ProductName);
        // Filter similar products by category
        setFilteredProducts(products.filter(p => p.ProductCategory?.toLowerCase() === 'laptop'));
      } else {
        // Find the actual product from database
        const product = products.find(p => p.ProductID.toString() === product1Id);
        if (product) {
          setSelectedProduct1(product);
          setSearchTerm1(product.ProductName);
          // Filter similar products by category
          setFilteredProducts(products.filter(p => p.ProductCategory?.toLowerCase() === product.ProductCategory?.toLowerCase()));
        }
      }
    }
  }, [searchParams, products]);

  // Update filtered products when a product is selected
  useEffect(() => {
    if (selectedProduct1 && !searchParams.get('product1')) {
      const category = selectedProduct1.ProductCategory?.toLowerCase();
      setFilteredProducts(products.filter(p => p.ProductCategory?.toLowerCase() === category));
    } else if (selectedProduct2 && !selectedProduct1) {
      const category = selectedProduct2.ProductCategory?.toLowerCase();
      setFilteredProducts(products.filter(p => p.ProductCategory?.toLowerCase() === category));
    } else if (!selectedProduct1 && !selectedProduct2) {
      setFilteredProducts(products);
    }
  }, [selectedProduct1, selectedProduct2, products, searchParams]);

  // Filter products for search dropdowns
  const getFilteredProducts = (searchTerm, excludeProduct = null) => {
    return products.filter(product => 
      product.ProductName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      product.ProductID !== excludeProduct?.ProductID
    );
  };

  // Category validation function
  const validateCategoryMatch = (product1, product2) => {
    if (!product1 || !product2) return true; // Allow if one is not selected
    
    const category1 = product1.ProductCategory?.toLowerCase().trim();
    const category2 = product2.ProductCategory?.toLowerCase().trim();
    
    return category1 === category2;
  };

  // Handle product selection with category validation
  const handleProductSelect = (product, isFirstProduct) => {
    if (isFirstProduct) {
      if (selectedProduct2 && !validateCategoryMatch(product, selectedProduct2)) {
        setCategoryError(`Cannot compare ${product.ProductCategory} with ${selectedProduct2.ProductCategory}. Please select products from the same category.`);
        return;
      }
      setSelectedProduct1(product);
      setSearchTerm1(product.ProductName);
      setShowDropdown1(false);
    } else {
      if (selectedProduct1 && !validateCategoryMatch(selectedProduct1, product)) {
        setCategoryError(`Cannot compare ${selectedProduct1.ProductCategory} with ${product.ProductCategory}. Please select products from the same category.`);
        return;
      }
      setSelectedProduct2(product);
      setSearchTerm2(product.ProductName);
      setShowDropdown2(false);
    }
    setCategoryError(''); // Clear any existing error
  };

  // Clear selected product
  const clearProduct = (isFirstProduct) => {
    if (isFirstProduct) {
      setSelectedProduct1(null);
      setSearchTerm1('');
    } else {
      setSelectedProduct2(null);
      setSearchTerm2('');
    }
    setCategoryError(''); // Clear any existing error
  };

  // Get technical specifications for comparison
  const getComparisonSpecs = () => {
    const specs = [
      { key: 'ProductModel', label: 'Model' },
      { key: 'ProductBrand', label: 'Brand' },
      { key: 'ProductCpu', label: 'CPU' },
      { key: 'ProductRam', label: 'RAM' },
      { key: 'ProductStorage', label: 'Storage' },
      { key: 'ProductGraphics', label: 'Graphics' },
      { key: 'ProductScreenSize', label: 'Screen Size' },
      { key: 'ProductResolution', label: 'Resolution' },
      { key: 'ProductOs', label: 'Operating System' },
      { key: 'ProductWeight', label: 'Weight' },
      { key: 'ProductBattery', label: 'Battery' },
      { key: 'ProductKeyboard', label: 'Keyboard' },
      { key: 'ProductBluetooth', label: 'Bluetooth' },
      { key: 'ProductWifi', label: 'WiFi' },
      { key: 'ProductCamera', label: 'Camera' },
      { key: 'ProductAudio', label: 'Audio' }
    ];

    return specs;
  };

  // Format specification value
  const formatSpecValue = (value, spec) => {
    if (!value) return 'N/A';
    if (spec.format) return spec.format(value);
    return value;
  };

  if (loading) {
    return (
      <div className={`${font.className} min-h-screen bg-gray-50`}>
        <Navbar />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">Loading products...</div>
            <div className="text-gray-600">Please wait while we fetch the product data</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${font.className} min-h-screen bg-gray-50`}>
        <Navbar />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">Error Loading Products</div>
            <div className="text-gray-600 mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`${font.className} min-h-screen bg-gray-50`}>
      <Navbar/>
      
      {/* Header Section */}
      <div className={`w-[95%] mx-auto flex items-center rounded-xl overflow-hidden mt-4 mb-6`} style={{ minHeight: '150px', background: 'linear-gradient(90deg, #333 60%, #00e676 100%)' }}>
        <div className="flex-1 bg-[#333] py-8 pl-8 pr-4 flex flex-col justify-center h-full">
          <div className="text-white font-bold text-2xl md:text-3xl mb-4">Compare Products</div>
          <div className="text-white text-xs md:text-sm">Select products from the same category to compare</div>
        </div>
        <div className="flex items-center justify-center rounded-bl-full py-3 flex-1 custom-green-bg h-full">
          <img src="/macs-group.png" alt="Products" className="h-24 md:h-32 object-contain" />
        </div>
      </div>

      {/* Category Error Alert */}
      {categoryError && (
        <div className="w-[95%] mx-auto mb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
            <FaExclamationTriangle />
            <span>{categoryError}</span>
            <button 
              onClick={() => setCategoryError('')}
              className="ml-auto text-red-700 hover:text-red-900"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Product Selection Section */}
      <div className="w-[95%] mx-auto mb-8">
        {/* Pre-selection indicator */}
        {searchParams.get('product1') && selectedProduct1 && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
            <div className="text-blue-600">✓</div>
            <span>
              <strong>{selectedProduct1.ProductName}</strong> has been pre-selected for comparison. 
              Now select a second {selectedProduct1.ProductCategory} to compare.
            </span>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-8 justify-center mb-8">
          {/* First Product Selector */}
          <div className="bg-white p-6 rounded-lg shadow-md flex-1 max-w-md">
            <div className="text-black text-lg font-semibold mb-4">Select First Product</div>
            <div className="relative">
              <div className="bg-gray-100 rounded-lg p-3 mb-6">
                <input 
                  type="text" 
                  placeholder="Search products..."
                  value={searchTerm1}
                  onChange={(e) => {
                    setSearchTerm1(e.target.value);
                    setShowDropdown1(true);
                  }}
                  onFocus={() => setShowDropdown1(true)}
                  className="w-full bg-transparent border-none outline-none text-gray-600"
                />
                {selectedProduct1 && (
                  <button 
                    onClick={() => clearProduct(true)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              
              {/* Dropdown for first product */}
              {showDropdown1 && searchTerm1 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg max-h-48 overflow-y-auto shadow-lg">
                  {getFilteredProducts(searchTerm1, selectedProduct2).map((product) => (
                    <div 
                      key={product.ProductID}
                      onClick={() => handleProductSelect(product, true)}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-sm">{product.ProductName}</div>
                      <div className="text-xs text-gray-500">{product.ProductCategory} - {convertPriceString(`PKR ${product.ProductPrice}`)}</div>
                    </div>
                  ))}
                  {getFilteredProducts(searchTerm1, selectedProduct2).length === 0 && (
                    <div className="p-3 text-gray-500 text-sm">No products found</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex justify-center mb-6">
              {selectedProduct1 ? (
                <div className="text-center">
                  <img 
                    src={selectedProduct1.ProductImageURL || '/laptop.png'} 
                    alt={selectedProduct1.ProductName} 
                    className="h-44 object-contain mx-auto mb-3" 
                  />
                  <div className="font-medium text-sm">{selectedProduct1.ProductName}</div>
                  <div className="text-xs text-gray-500">{selectedProduct1.ProductCategory}</div>
                  <div className="text-lg font-bold text-green-600 mt-2">{convertPriceString(`PKR ${selectedProduct1.ProductPrice}`)}</div>
                </div>
              ) : (
                <div className="h-44 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📱</div>
                    <div>Select a product</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Second Product Selector */}
          <div className="bg-white p-6 rounded-lg shadow-md flex-1 max-w-md">
            <div className="text-black text-lg font-semibold mb-4">Select Second Product</div>
            <div className="relative">
              <div className="bg-gray-100 rounded-lg p-3 mb-6">
                <input 
                  type="text" 
                  placeholder="Search products..."
                  value={searchTerm2}
                  onChange={(e) => {
                    setSearchTerm2(e.target.value);
                    setShowDropdown2(true);
                  }}
                  onFocus={() => setShowDropdown2(true)}
                  className="w-full bg-transparent border-none outline-none text-gray-600"
                />
                {selectedProduct2 && (
                  <button 
                    onClick={() => clearProduct(false)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              
              {/* Dropdown for second product */}
              {showDropdown2 && searchTerm2 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg max-h-48 overflow-y-auto shadow-lg">
                  {getFilteredProducts(searchTerm2, selectedProduct1).map((product) => (
                    <div 
                      key={product.ProductID}
                      onClick={() => handleProductSelect(product, false)}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-sm">{product.ProductName}</div>
                      <div className="text-xs text-gray-500">{product.ProductCategory} - {convertPriceString(`PKR ${product.ProductPrice}`)}</div>
                    </div>
                  ))}
                  {getFilteredProducts(searchTerm2, selectedProduct1).length === 0 && (
                    <div className="p-3 text-gray-500 text-sm">No products found</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex justify-center mb-6">
              {selectedProduct2 ? (
                <div className="text-center">
                  <img 
                    src={selectedProduct2.ProductImageURL || '/laptop.png'} 
                    alt={selectedProduct2.ProductName} 
                    className="h-44 object-contain mx-auto mb-3" 
                  />
                  <div className="font-medium text-sm">{selectedProduct2.ProductName}</div>
                  <div className="text-xs text-gray-500">{selectedProduct2.ProductCategory}</div>
                  <div className="text-lg font-bold text-green-600 mt-2">{convertPriceString(`PKR ${selectedProduct2.ProductPrice}`)}</div>
                </div>
              ) : (
                <div className="h-44 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📱</div>
                    <div>Select a product</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        {selectedProduct1 && selectedProduct2 && (
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Product Comparison</h3>
            <div className="space-y-0">
              {getComparisonSpecs().map((spec, index) => (
                <div key={spec.key} className={`flex justify-between ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                  <span className="text-green-500 p-3 font-bold w-1/3">{spec.label}</span>
                  <div className="flex gap-8 w-2/3">
                    <span className="text-gray-700 p-3 flex-1">
                      {formatSpecValue(selectedProduct1[spec.key], spec)}
                    </span>
                    <span className="text-gray-700 p-3 flex-1">
                      {formatSpecValue(selectedProduct2[spec.key], spec)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No comparison message */}
        {(!selectedProduct1 || !selectedProduct2) && (
          <div className="bg-white rounded-lg p-12 shadow-md text-center">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">Select Two Products to Compare</h3>
            <p className="text-gray-500">Choose products from the same category to see a detailed comparison</p>
          </div>
        )}
      </div>

      {/* Similar Products Section */}
      <div className="w-full flex flex-col mb-10 items-center justify-center mt-10">
        <div className="mx-auto max-w-[1230px] w-full px-4">
          <div className="font-bold text-3xl mb-4 text-left">
            {selectedProduct1 || selectedProduct2 ? 
              `Similar ${(selectedProduct1?.ProductCategory || selectedProduct2?.ProductCategory || 'Products')}` :
              'All Products'
            }
          </div>
          <div className="flex items-center justify-center">
            <button 
              onClick={handlePrev} 
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white shadow mr-2 disabled:opacity-50" 
              disabled={carouselIndex === 0}
            >
              <FaChevronLeft />
            </button>
            <div className="flex gap-4 overflow-hidden justify-center">
              {filteredProducts.slice(carouselIndex, carouselIndex + visibleCount).map((product) => (
                <div key={product.ProductID} className="bg-white rounded-xl border border-gray-300 p-6 relative flex flex-col min-w-[220px] max-w-[250px] w-[210px] h-full shadow-sm">
                  <span className="absolute top-2 left-2 bg-green-400 text-white text-xs font-bold py-1 px-3 rounded-full z-10">
                    {Math.round(((product.ProductPrice * 1.2) - product.ProductPrice) / (product.ProductPrice * 1.2) * 100)}% vs. new
                  </span>
                  <div 
                    className="absolute top-2 right-2 text-black hover:text-red-500 cursor-pointer z-10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(product);
                    }}
                  >
                    {isFavorite(product.ProductID) ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </div>
                  <img 
                    src={product.ProductImageURL || '/laptop.png'} 
                    alt={product.ProductName} 
                    className="w-full h-28 object-contain my-2" 
                  />
                  <h3 className="text-sm font-bold text-gray-800 mt-2 mb-1 line-clamp-2 min-h-[38px]">
                    {product.ProductName}
                  </h3>
                  <div className="text-xs text-gray-500 mb-1">{product.ProductCategory}</div>
                  <p className="text-md font-bold text-black mt-auto">{convertPriceString(`PKR ${product.ProductPrice}`)}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={handleNext} 
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white shadow ml-2 disabled:opacity-50" 
              disabled={carouselIndex === maxIndex}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
      
      <Footer/>
    </div>
  )
}

export default page