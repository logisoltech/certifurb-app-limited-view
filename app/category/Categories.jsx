'use client';

import React, { useState, useEffect } from 'react';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { font } from '../Components/Font/font';
import Link from 'next/link';
import { formatPrice } from '../utils/priceFormatter';
import { useFavorites } from '../context/FavoritesContext';
import { useCurrency } from '../context/CurrencyContext';

// Keep the fallback for demonstration
const baseProduct = {
  name: 'Lenovo Thinkpad T470s Core-i7-7th-Gen',
  specs: '8GB-256 GB SSD-14"-Win 10',
  price: formatPrice(130000),
  discount: '45% vs. new',
  image: '/laptop.png',
};

const PRICE_MIN_PKR = 500;
const PRICE_MAX_PKR = 500000;

const Categories = ({ categoryFilter, brandFilter }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { convertPriceString, getCurrentCurrency, selectedCountry } = useCurrency();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceMin, setPriceMin] = useState(PRICE_MIN_PKR);
  const [priceMax, setPriceMax] = useState(PRICE_MAX_PKR);
  const [visibleCount, setVisibleCount] = useState(12);
  
  // Category-specific filters
  const [selectedProcessors, setSelectedProcessors] = useState([]);
  const [selectedScreenSizes, setSelectedScreenSizes] = useState([]);
  const [selectedResolutions, setSelectedResolutions] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState([]);
  const [selectedRam, setSelectedRam] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedConnections, setSelectedConnections] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Reset all filters when component mounts or filters change
  useEffect(() => {
    setPriceMin(PRICE_MIN_PKR);
    setPriceMax(PRICE_MAX_PKR);
    setSelectedProcessors([]);
    setSelectedScreenSizes([]);
    setSelectedResolutions([]);
    setSelectedStorage([]);
    setSelectedRam([]);
    setSelectedBrands([]);
    setSelectedConnections([]);
    setSelectedTypes([]);
  }, [categoryFilter, brandFilter]);



  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.certifurb.com/api/products');
        console.log('API Response status:', response.status);
        const data = await response.json();
        console.log('API Response data:', data);
        
        if (data.success) {
          console.log('Raw products from database:', data.data);
          console.log('Number of products received:', data.data.length);
          
          // Map database fields to card structure
          const mappedProducts = data.data.map(product => {
            console.log('Mapping product:', product);
            return {
              id: product.ProductID,
              name: product.ProductName,
              specs: product.ProductDesc || 'High-quality refurbished product',
              price: `PKR ${product.ProductPrice}`, // Store as PKR for conversion
              discount: '45% vs. new', // You can calculate this based on your logic
              image: product.ProductImageURL || '/laptop.png',
              category: product.ProductCategory,
              brand: product.ProductBrand,
              storage: product.ProductStorage,
              ram: product.ProductRam,
              keyboard: product.ProductKeyboard,
              screenSize: product.ProductScreenSize
            };
          });
          console.log('Mapped products:', mappedProducts);
          setProducts(mappedProducts);
        } else {
          console.error('API returned error:', data);
          setError(data.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Re-render when currency changes
  useEffect(() => {
    // This will trigger a re-render when selectedCountry changes
    console.log('Currency changed to:', selectedCountry);
    console.log('Current currency info:', getCurrentCurrency());
    
    // Test conversion
    const testPrice = 'PKR 1000';
    const converted = convertPriceString(testPrice);
    console.log(`Test conversion: ${testPrice} -> ${converted}`);
  }, [selectedCountry, convertPriceString, getCurrentCurrency]);

  const handleSliderChange = (e) => {
    const value = Number(e.target.value);
    const minDifference = 100; // Reduced from 1000 to 100 for better flexibility
    if (e.target.name === 'min') {
      setPriceMin(Math.max(PRICE_MIN_PKR, Math.min(value, priceMax - minDifference)));
    } else {
      setPriceMax(Math.min(PRICE_MAX_PKR, Math.max(value, priceMin + minDifference)));
    }
  };

  const handleInputChange = (e) => {
    const value = Number(e.target.value);
    const minDifference = 100; // Reduced from 1000 to 100 for better flexibility
    if (e.target.name === 'min') {
      setPriceMin(Math.max(PRICE_MIN_PKR, Math.min(value, priceMax - minDifference)));
    } else {
      setPriceMax(Math.min(PRICE_MAX_PKR, Math.max(value, priceMin + minDifference)));
    }
  };

  const handleShowMore = () => {
    setVisibleCount(Math.min(products.length, visibleCount + 8));
  };

  const handleShowLess = () => {
    setVisibleCount(12);
  };

  // Filter handler functions
  const handleFilterChange = (filterType, value, checked) => {
    switch (filterType) {
      case 'processor':
        setSelectedProcessors(prev => 
          checked ? [...prev, value] : prev.filter(item => item !== value)
        );
        break;
      case 'screenSize':
        setSelectedScreenSizes(prev => 
          checked ? [...prev, value] : prev.filter(item => item !== value)
        );
        break;
      case 'resolution':
        setSelectedResolutions(prev => 
          checked ? [...prev, value] : prev.filter(item => item !== value)
        );
        break;
      case 'storage':
        setSelectedStorage(prev => 
          checked ? [...prev, value] : prev.filter(item => item !== value)
        );
        break;
      case 'ram':
        setSelectedRam(prev => 
          checked ? [...prev, value] : prev.filter(item => item !== value)
        );
        break;
      case 'brand':
        setSelectedBrands(prev => 
          checked ? [...prev, value] : prev.filter(item => item !== value)
        );
        break;
      case 'connection':
        setSelectedConnections(prev => 
          checked ? [...prev, value] : prev.filter(item => item !== value)
        );
        break;
      case 'type':
        setSelectedTypes(prev => 
          checked ? [...prev, value] : prev.filter(item => item !== value)
        );
        break;
      default:
        break;
    }
  };

  // Filter products by price range, category, and brand (only if products are loaded)
  const filteredProducts = products.length > 0 ? products.filter(product => {
    console.log('Filtering product:', product);
    
    if (!product || !product.price) {
      console.log('❌ Product or price is missing:', product);
      return false;
    }
    
    // Price filtering - always use PKR values for comparison since priceMin/priceMax are in PKR
    const priceString = product.price; // e.g., "PKR 200,000"
    const priceNumber = parseFloat(product.price.replace(/[^\d.]/g, '')); // e.g., 200000
    const isInPriceRange = priceNumber >= priceMin && priceNumber <= priceMax;
    
    // Category filtering
    let isInCategory;
    if (!categoryFilter) {
      isInCategory = true;
    } else if (categoryFilter === 'Monitors') {
      // For Monitors filter, show LCD, LED, and Monitor products
      isInCategory = product.category === 'LCD' || product.category === 'LED' || product.category === 'Monitor';
    } else {
      isInCategory = product.category === categoryFilter;
    }
    
    // Brand filtering
    let isInBrand;
    if (!brandFilter) {
      isInBrand = true;
    } else {
      isInBrand = product.brand && product.brand.toLowerCase() === brandFilter.toLowerCase();
    }

    // Category-specific filtering
    let isInProcessorFilter = true;
    let isInScreenSizeFilter = true;
    let isInResolutionFilter = true;
    let isInStorageFilter = true;
    let isInRamFilter = true;
    let isInBrandFilter = true;
    let isInConnectionFilter = true;
    let isInTypeFilter = true;

    // Processor filter (for Laptops and Desktop PC)
    if (selectedProcessors.length > 0 && (categoryFilter === 'Laptop' || categoryFilter === 'Desktop PC')) {
      const productProcessor = (product.specs || product.name || '').toLowerCase();
      isInProcessorFilter = selectedProcessors.some(processor => 
        productProcessor.includes(processor.toLowerCase())
      );
    }

    // Screen size filter (for Monitors only)
    if (selectedScreenSizes.length > 0 && categoryFilter === 'Monitors') {
      const productScreenSize = product.screenSize || product.specs || '';
      isInScreenSizeFilter = selectedScreenSizes.some(size => 
        productScreenSize.includes(size)
      );
    }

    // Resolution filter removed

    // Storage filter (for Laptops, Desktop PC)
    if (selectedStorage.length > 0 && (categoryFilter === 'Laptop' || categoryFilter === 'Desktop PC')) {
      const productStorage = product.storage || product.specs || '';
      isInStorageFilter = selectedStorage.some(storage => 
        productStorage.includes(storage)
      );
    }

    // RAM filter (for Laptops, Desktop PC)
    if (selectedRam.length > 0 && (categoryFilter === 'Laptop' || categoryFilter === 'Desktop PC')) {
      const productRam = product.ram || product.specs || '';
      isInRamFilter = selectedRam.some(ram => 
        productRam.includes(ram)
      );
    }

    // Brand filter (for all categories)
    if (selectedBrands.length > 0) {
      const productBrand = (product.brand || product.name || '').toLowerCase();
      isInBrandFilter = selectedBrands.some(brand => 
        productBrand.includes(brand.toLowerCase())
      );
    }

    // Connection filter (for Monitors, Network, etc.)
    if (selectedConnections.length > 0 && (categoryFilter === 'Monitors' || categoryFilter === 'Network')) {
      const productConnection = product.specs?.toLowerCase() || '';
      isInConnectionFilter = selectedConnections.some(connection => 
        productConnection.includes(connection.toLowerCase())
      );
    }

    // Type filter (for various categories)
    if (selectedTypes.length > 0) {
      const productType = product.specs?.toLowerCase() || '';
      isInTypeFilter = selectedTypes.some(type => 
        productType.includes(type.toLowerCase())
      );
    }
    
    console.log(`Product: ${product.name}`);
    console.log(`  Price String: "${priceString}"`);
    console.log(`  Price Number: ${priceNumber}`);
    console.log(`  Price Min: ${priceMin}, Price Max: ${priceMax}`);
    console.log(`  In Price Range: ${isInPriceRange}`);
    console.log(`  Category: ${product.category}`);
    console.log(`  Category Filter: ${categoryFilter}`);
    console.log(`  In Category: ${isInCategory}`);
    console.log(`  Brand: ${product.brand}`);
    console.log(`  Brand Filter: ${brandFilter}`);
    console.log(`  In Brand: ${isInBrand}`);
    console.log(`  Selected Brands: ${selectedBrands.join(', ')}`);
    console.log(`  Product Brand: ${product.brand || product.name}`);
    console.log(`  In Brand Filter: ${isInBrandFilter}`);
    console.log(`  Final Result: ${isInPriceRange && isInCategory && isInBrand && isInProcessorFilter && isInScreenSizeFilter && isInResolutionFilter && isInStorageFilter && isInRamFilter && isInBrandFilter && isInConnectionFilter && isInTypeFilter}`);
    console.log('---');
    
    return isInPriceRange && isInCategory && isInBrand && isInProcessorFilter && isInScreenSizeFilter && isInResolutionFilter && isInStorageFilter && isInRamFilter && isInBrandFilter && isInConnectionFilter && isInTypeFilter;
  }) : [];

  console.log('=== SUMMARY ===');
  console.log('Total products:', products.length);
  console.log('Filtered products:', filteredProducts.length);
  console.log('Price range:', priceMin, '-', priceMax);
  console.log('Visible count:', visibleCount);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  console.log('Displayed products:', displayedProducts.length);
  console.log('================');

  return (
    <div className={`${font.className} w-full min-h-screen bg-[#fafbfc] flex flex-col items-center`}>
      {/* Debug info */}
      <div className="fixed top-20 right-4 bg-white p-2 rounded shadow z-50 text-xs">
        <div>Country: {selectedCountry}</div>
        <div>Currency: {getCurrentCurrency().currency}</div>
        <div>Rate: {getCurrentCurrency().rate}</div>
      </div>
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6 mt-4 lg:mt-6">
        {/* Filters Sidebar - Mobile: top, Desktop: left */}
        <div className="w-full lg:w-[260px] bg-white rounded-xl shadow p-4 flex flex-col gap-4 lg:gap-6 border border-gray-200 lg:h-fit lg:sticky lg:top-8">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-md">Price</div>
              <button 
                onClick={() => {
                  setPriceMin(PRICE_MIN_PKR);
                  setPriceMax(PRICE_MAX_PKR);
                }}
                className="text-xs text-green-500 hover:text-green-600 font-semibold"
              >
                Reset
              </button>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="number"
                name="min"
                value={priceMin}
                min={PRICE_MIN_PKR}
                max={priceMax - 100}
                onChange={handleInputChange}
                className="w-20 px-3 py-1 rounded-lg border border-gray-300 shadow-sm text-xs font-semibold focus:ring-2 focus:ring-green-400 focus:border-green-400 transition outline-none text-center bg-[#f7f7f7]"
                style={{ boxShadow: '0 1px 4px 0 #e5e7eb' }}
              />
              <span className="text-gray-400 font-bold">-</span>
              <input
                type="number"
                name="max"
                value={priceMax}
                min={priceMin + 100}
                max={PRICE_MAX_PKR}
                onChange={handleInputChange}
                className="w-20 px-3 py-1 rounded-lg border border-gray-300 shadow-sm text-xs font-semibold focus:ring-2 focus:ring-green-400 focus:border-green-400 transition outline-none text-center bg-[#f7f7f7]"
                style={{ boxShadow: '0 1px 4px 0 #e5e7eb' }}
              />
            </div>
            <div className="relative h-8 flex items-center">
              <div className="absolute left-0 right-0 h-1 bg-gray-200 rounded-full" />
              <div
                className="absolute h-1 bg-green-400 rounded-full"
                style={{
                  left: `${((priceMin - PRICE_MIN_PKR) / (PRICE_MAX_PKR - PRICE_MIN_PKR)) * 100}%`,
                  right: `${100 - ((priceMax - PRICE_MIN_PKR) / (PRICE_MAX_PKR - PRICE_MIN_PKR)) * 100}%`,
                }}
              />
              <input
                type="range"
                name="min"
                min={PRICE_MIN_PKR}
                max={PRICE_MAX_PKR - 100}
                value={priceMin}
                onChange={handleSliderChange}
                className="absolute w-full accent-green-500 pointer-events-auto h-1 bg-transparent"
                style={{ zIndex: 1 }}
              />
              <input
                type="range"
                name="max"
                min={PRICE_MIN_PKR + 100}
                max={PRICE_MAX_PKR}
                value={priceMax}
                onChange={handleSliderChange}
                className="absolute w-full accent-green-500 pointer-events-auto h-1 bg-transparent"
                style={{ zIndex: 2 }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
              <span>{PRICE_MIN_PKR.toLocaleString()}</span>
              <span>{PRICE_MAX_PKR.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Processor Filter - Laptops & Desktop PC */}
          {(categoryFilter === 'Laptop' || categoryFilter === 'Desktop PC') && (
            <div>
              <div className="font-bold text-md mb-2">Processor</div>
              <div className="flex flex-col gap-1 text-sm">
                {['i3', 'i5', 'i7', 'i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9'].map(processor => (
                  <label key={processor} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={selectedProcessors.includes(processor)}
                      onChange={(e) => handleFilterChange('processor', processor, e.target.checked)}
                    /> 
                    {processor}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Screen Size Filter - Monitors only */}
          {categoryFilter === 'Monitors' && (
            <div>
              <div className="font-bold text-md mb-2">Screen Size</div>
              <div className="flex flex-col gap-1 text-sm">
                {['13"', '14"', '15"', '15.6"', '17"', '19"', '21"', '24"', '27"', '32"'].map(size => (
                  <label key={size} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={selectedScreenSizes.includes(size)}
                      onChange={(e) => handleFilterChange('screenSize', size, e.target.checked)}
                    /> 
                    {size}
                  </label>
                ))}
              </div>
            </div>
          )}



          {/* Storage Filter - Laptops & Desktop PC */}
          {(categoryFilter === 'Laptop' || categoryFilter === 'Desktop PC') && (
            <div>
              <div className="font-bold text-md mb-2">Storage</div>
              <div className="flex flex-col gap-1 text-sm">
                {['128GB', '256GB', '512GB', '1TB', '2TB'].map(storage => (
                  <label key={storage} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={selectedStorage.includes(storage)}
                      onChange={(e) => handleFilterChange('storage', storage, e.target.checked)}
                    /> 
                    {storage}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* RAM Filter - Laptops & Desktop PC */}
          {(categoryFilter === 'Laptop' || categoryFilter === 'Desktop PC') && (
            <div>
              <div className="font-bold text-md mb-2">RAM</div>
              <div className="flex flex-col gap-1 text-sm">
                {['4GB', '8GB', '16GB', '32GB', '64GB'].map(ram => (
                  <label key={ram} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={selectedRam.includes(ram)}
                      onChange={(e) => handleFilterChange('ram', ram, e.target.checked)}
                    /> 
                    {ram}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Brand Filter - Category Specific */}
          <div>
            <div className="font-bold text-md mb-2">Brand</div>
            <div className="flex flex-col gap-1 text-sm">
              {categoryFilter === 'Desktop PC' ? (
                // Desktop PC brands
                ['Asus', 'HP', 'Zotac', 'Dell', 'Lenovo'].map(brand => (
                  <label key={brand} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={selectedBrands.includes(brand)}
                      onChange={(e) => handleFilterChange('brand', brand, e.target.checked)}
                    /> 
                    {brand}
                  </label>
                ))
              ) : (
                // Laptop brands (default)
                ['Dell', 'HP', 'Lenovo', 'Microsoft'].map(brand => (
                  <label key={brand} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={selectedBrands.includes(brand)}
                      onChange={(e) => handleFilterChange('brand', brand, e.target.checked)}
                    /> 
                    {brand}
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Connection Filter - Monitors & Network */}
          {(categoryFilter === 'Monitors' || categoryFilter === 'Network') && (
            <div>
              <div className="font-bold text-md mb-2">Connection</div>
              <div className="flex flex-col gap-1 text-sm">
                {['HDMI', 'VGA', 'DVI', 'DisplayPort', 'USB-C', 'WiFi', 'Ethernet', 'Bluetooth'].map(connection => (
                  <label key={connection} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={selectedConnections.includes(connection)}
                      onChange={(e) => handleFilterChange('connection', connection, e.target.checked)}
                    /> 
                    {connection}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Type Filter - Various Categories */}
          {(categoryFilter === 'Mouse' || categoryFilter === 'Keyboard' || categoryFilter === 'Headphones') && (
            <div>
              <div className="font-bold text-md mb-2">Type</div>
              <div className="flex flex-col gap-1 text-sm">
                {categoryFilter === 'Mouse' && ['Wireless', 'Wired', 'Gaming', 'Optical', 'Laser'].map(type => (
                  <label key={type} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={selectedTypes.includes(type)}
                      onChange={(e) => handleFilterChange('type', type, e.target.checked)}
                    /> 
                    {type}
                  </label>
                ))}
                {categoryFilter === 'Keyboard' && ['Mechanical', 'Membrane', 'Wireless', 'Wired', 'RGB'].map(type => (
                  <label key={type} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={selectedTypes.includes(type)}
                      onChange={(e) => handleFilterChange('type', type, e.target.checked)}
                    /> 
                    {type}
                  </label>
                ))}
                {categoryFilter === 'Headphones' && ['Wireless', 'Wired', 'Bluetooth', 'Noise Cancelling', 'Gaming'].map(type => (
                  <label key={type} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={selectedTypes.includes(type)}
                      onChange={(e) => handleFilterChange('type', type, e.target.checked)}
                    /> 
                    {type}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Products Section */}
        <div className="flex-1 flex flex-col items-center">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {displayedProducts.map((item, idx) => (
                  <Link key={item.id || idx} href={`/product/${item.id}`}>
                    <div className="bg-white rounded-xl shadow p-4 border border-gray-500 relative flex flex-col min-h-[340px] max-w-[220px] mx-auto group transition hover:shadow-lg cursor-pointer">
                      <span className="absolute top-2 left-2 bg-green-400 text-white text-xs font-semibold py-1 px-2 rounded-full z-10">
                        {item.discount}
                      </span>
                      <div className="absolute top-2 right-2 text-black hover:text-red-500 cursor-pointer z-10"
                           onClick={(e) => {
                             e.preventDefault();
                             e.stopPropagation();
                             toggleFavorite(item);
                           }}>
                        {isFavorite(item.id) ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart />
                        )}
                      </div>
                      <img src={item.image} alt={item.name} className="w-full h-36 mt-6 object-contain my-2" />
                      <h3 className="text-base font-bold text-gray-800 mt-2 line-clamp-2 min-h-[44px]">{item.name}</h3>
                      <div className="text-sm text-gray-500 mb-1 font-medium">{item.specs}</div>
                      <p className="text-lg font-bold text-black mt-auto">
                        {(() => {
                          const converted = convertPriceString(item.price);
                          console.log(`Converting ${item.price} to ${converted} for ${selectedCountry}`);
                          return converted;
                        })()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Show More/Less Buttons */}
              {visibleCount < filteredProducts.length && (
                <div className="w-full flex justify-center mt-6 lg:mt-8 mb-4">
                  <button onClick={handleShowMore} className="bg-white border border-green-400 text-green-500 px-6 py-2 rounded-full font-semibold shadow hover:bg-green-50 transition">Show More Products</button>
                </div>
              )}
              {visibleCount >= filteredProducts.length && filteredProducts.length > 12 && (
                <div className="w-full flex justify-center mt-6 lg:mt-8 mb-4">
                  <button onClick={handleShowLess} className="bg-white border border-green-400 text-green-500 px-6 py-2 rounded-full font-semibold shadow hover:bg-green-50 transition">Show Less Products</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-2 mb-8">
        {loading ? 'Loading...' : `Showing 1-${Math.min(visibleCount, filteredProducts.length)} of ${filteredProducts.length} products`}
      </div>
    </div>
  );
};

export default Categories;