'use client';

import React, { useState, useEffect } from 'react';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { font } from '../../Components/Font/font';
import Link from 'next/link';
import { formatPrice } from '../../utils/priceFormatter';
import Navbar from '../../Components/Layout/Navbar';
import { useFavorites } from '../../context/FavoritesContext';
import dayjs from "dayjs";
import utc from "dayjs-plugin-utc";

const PRICE_MIN = 500;
const PRICE_MAX = 500000;

const AuctionProductsPage = () => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceMin, setPriceMin] = useState(PRICE_MIN);
  const [priceMax, setPriceMax] = useState(PRICE_MAX);
  const [visibleCount, setVisibleCount] = useState(12);
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  dayjs.extend(utc);

  // Reset price range when component mounts
  useEffect(() => {
    setPriceMin(PRICE_MIN);
    setPriceMax(PRICE_MAX);
  }, []);

  // Update timer every minute for real-time countdown
  useEffect(() => {
    const timer = setInterval(() => {
      // Force re-render to update timers
      setProducts(prevProducts => [...prevProducts]);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('Fetching auction products from API...');
        const response = await fetch('https://api.certifurb.com/api/auctionproducts');
        console.log('API Response status:', response.status);
        const data = await response.json();
        console.log('API Response data:', data);
        
        if (data.success) {
          console.log('Raw auction products from database:', data.data);
          console.log('Number of auction products received:', data.data.length);
          
          // Map database fields to card structure for auction products
          const mappedProducts = data.data.map(product => {
            console.log('Mapping auction product:', product);
            
            // Handle product_specs - it could be an array, JSON string, or comma-separated string
            let specs = [];
            if (product.product_specs) {
              if (typeof product.product_specs === 'string') {
                try {
                  specs = JSON.parse(product.product_specs);
                } catch (error) {
                  // If JSON parsing fails, treat it as a comma-separated string
                  specs = product.product_specs.split(',').map(spec => spec.trim());
                }
              } else if (Array.isArray(product.product_specs)) {
                specs = product.product_specs;
              }
            }
            
            // Handle bids - it could be an array or JSON string
            let bids = [];
            if (product.bids) {
              if (typeof product.bids === 'string') {
                try {
                  bids = JSON.parse(product.bids);
                } catch (error) {
                  console.error('Error parsing bids JSON:', error);
                  bids = [];
                }
              } else if (Array.isArray(product.bids)) {
                bids = product.bids;
              }
            }
            
            return {
              id: product.productid,
              name: product.product_name,
              specs: specs.length > 0 ? specs.join(', ') : 'High-quality refurbished auction product',
              price: formatPrice(product.price),
              discount: '45% vs. new', // You can calculate this based on your logic
              image: product.image_url || '/laptop.png',
              category: 'Auction', // Since category is not in the table, default to 'Auction'
              brand: 'Certifurb', // Since brand is not in the table, default to 'Certifurb'
              storage: specs.find(spec => spec.toLowerCase().includes('storage') || spec.toLowerCase().includes('gb') || spec.toLowerCase().includes('tb')) || '',
              ram: specs.find(spec => spec.toLowerCase().includes('ram') || spec.toLowerCase().includes('memory')) || '',
              keyboard: specs.find(spec => spec.toLowerCase().includes('keyboard')) || '',
              screenSize: specs.find(spec => spec.toLowerCase().includes('screen') || spec.toLowerCase().includes('display') || spec.toLowerCase().includes('inch')) || '',
              // Auction-specific fields
              currentBid: product.price,
              startingBid: product.price, // You might want to add a separate starting_bid column
              auctionEndTime: product.auction_timer,
              bidCount: bids.length,
              isActive: (() => {
                if (!product.auction_timer) return false;
                
                try {
                  let end;
                  
                  // Parse the auction_timer as UTC from the API
                  if (product.auction_timer.includes("T") && product.auction_timer.includes("Z")) {
                    end = dayjs.utc(product.auction_timer);
                  } else if (product.auction_timer.includes(" ")) {
                    end = dayjs.utc(product.auction_timer, "YYYY-MM-DD HH:mm:ss");
                  } else {
                    return false;
                  }
                  
                  // Validate parsed date
                  if (!end.isValid()) {
                    return false;
                  }
                  
                  // Since the API's UTC time is based on PKT database time, adjust back to PKT
                  // Subtract 5 hours (PKT offset from UTC) to get the intended PKT end time
                  end = end.subtract(5, "hour");
                  
                  // Current time in local timezone (PKT)
                  const now = dayjs();
                  
                  return end.isAfter(now);
                } catch (error) {
                  console.error("Error checking auction status:", error);
                  return false;
                }
              })(), // Check if auction timer hasn't expired
              bids: bids,
              productSpecs: specs
            };
          });
          console.log('Mapped auction products:', mappedProducts);
          setProducts(mappedProducts);
        } else {
          console.error('API returned error:', data);
          setError(data.message || 'Failed to fetch auction products');
        }
      } catch (error) {
        console.error('Error fetching auction products:', error);
        setError('Failed to load auction products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatTimeRemaining = (auctionTimer) => {
    if (!auctionTimer || typeof auctionTimer !== "string") return "No timer set";
  
    try {
      let end;
  
      // Parse the auction_timer as UTC from the API
      if (auctionTimer.includes("T") && auctionTimer.includes("Z")) {
        end = dayjs.utc(auctionTimer);
      } else if (auctionTimer.includes(" ")) {
        end = dayjs.utc(auctionTimer, "YYYY-MM-DD HH:mm:ss");
      } else {
        return "Invalid timer format";
      }
  
      // Validate parsed date
      if (!end.isValid()) {
        return "Invalid Date";
      }
  
      // Since the API's UTC time is based on PKT database time, adjust back to PKT
      // Subtract 5 hours (PKT offset from UTC) to get the intended PKT end time
      end = end.subtract(5, "hour");
  
      // Current time in local timezone (PKT)
      const now = dayjs();
  
      // Calculate difference
      const diff = end.diff(now);
  
      if (diff <= 0) return "Auction Ended";
  
      // Calculate days, hours, minutes
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
      if (days > 0) return `${days}d ${hours}h`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Invalid Date";
    }
  };

  const handleSliderChange = (e) => {
    const value = Number(e.target.value);
    const minDifference = 100;
    if (e.target.name === 'min') {
      setPriceMin(Math.min(value, priceMax - minDifference));
    } else {
      setPriceMax(Math.max(value, priceMin + minDifference));
    }
  };

  const handleInputChange = (e) => {
    const value = Number(e.target.value);
    const minDifference = 100;
    if (e.target.name === 'min') {
      setPriceMin(Math.max(PRICE_MIN, Math.min(value, priceMax - minDifference)));
    } else {
      setPriceMax(Math.min(PRICE_MAX, Math.max(value, priceMin + minDifference)));
    }
  };

  const handleShowMore = () => {
    setVisibleCount(Math.min(products.length, visibleCount + 8));
  };

  const handleShowLess = () => {
    setVisibleCount(12);
  };

  // Filter products by price range (all products, no category filter)
  const filteredProducts = products.length > 0 ? products.filter(product => {
    console.log('Filtering product:', product);
    
    if (!product || !product.currentBid) {
      console.log('❌ Product or price is missing:', product);
      return false;
    }
    
    // Price filtering - use currentBid which is the numeric price
    const priceNumber = parseFloat(product.currentBid);
    const isInPriceRange = priceNumber >= priceMin && priceNumber <= priceMax;
    
    // Active auction filtering
    const isActiveAuction = showOnlyActive ? product.isActive : true;
    
    console.log(`Product: ${product.name}`);
    console.log(`  Price Number: ${priceNumber}`);
    console.log(`  Price Min: ${priceMin}, Price Max: ${priceMax}`);
    console.log(`  In Price Range: ${isInPriceRange}`);
    console.log(`  Is Active: ${product.isActive}`);
    console.log(`  Show Only Active: ${showOnlyActive}`);
    console.log(`  Final Result: ${isInPriceRange && isActiveAuction}`);
    console.log('---');
    
    return isInPriceRange && isActiveAuction;
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
        <Navbar />
        <div className="w-[95%] mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6 mt-4 lg:mt-6">
          {/* Filters Sidebar - Mobile: top, Desktop: left */}
          <div className="w-full lg:w-[260px] bg-white rounded-xl shadow p-4 flex flex-col gap-4 lg:gap-6 border border-gray-200 lg:h-fit lg:sticky lg:top-8">
            {/* Active Auctions Filter */}
            <div>
              <div className="font-bold text-md mb-2">Auction Status</div>
              <label className="flex items-center gap-2 text-sm">
                <input 
                  type="checkbox" 
                  checked={showOnlyActive}
                  onChange={(e) => setShowOnlyActive(e.target.checked)}
                />
                Show only active auctions
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-md">Price</div>
                <button 
                  onClick={() => {
                    setPriceMin(PRICE_MIN);
                    setPriceMax(PRICE_MAX);
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
                  min={PRICE_MIN}
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
                  max={PRICE_MAX}
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
                    left: `${((priceMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
                    right: `${100 - ((priceMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  name="min"
                  min={PRICE_MIN}
                  max={PRICE_MAX - 100}
                  value={priceMin}
                  onChange={handleSliderChange}
                  className="absolute w-full accent-green-500 pointer-events-auto h-1 bg-transparent"
                  style={{ zIndex: 1 }}
                />
                <input
                  type="range"
                  name="max"
                  min={PRICE_MIN + 100}
                  max={PRICE_MAX}
                  value={priceMax}
                  onChange={handleSliderChange}
                  className="absolute w-full accent-green-500 pointer-events-auto h-1 bg-transparent"
                  style={{ zIndex: 2 }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                <span>{PRICE_MIN.toLocaleString()}</span>
                <span>{PRICE_MAX.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Storage Filter */}
            <div>
              <div className="font-bold text-md mb-2">Storage</div>
              <div className="flex flex-col gap-1 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" /> 128GB</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> 256GB</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> 512GB</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> 1TB</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> 2TB</label>
              </div>
            </div>

            {/* RAM Filter */}
            <div>
              <div className="font-bold text-md mb-2">RAM</div>
              <div className="flex flex-col gap-1 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" /> 4GB</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> 8GB</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> 16GB</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> 32GB</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> 64GB</label>
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <div className="font-bold text-md mb-2">Brand</div>
              <div className="flex flex-col gap-1 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" /> Apple</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Samsung</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Dell</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> HP</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Lenovo</label>
              </div>
            </div>
          </div>
          
          {/* Products Section */}
          <div className="flex-1 flex flex-col items-center">
            {/* Debug Info */}
            <div className="w-full mb-4 p-3 bg-blue-50 rounded-lg text-sm">
              <div className="flex justify-between items-center">
                <span>Total Products: {products.length}</span>
                <span>Filtered Products: {filteredProducts.length}</span>
                <span>Displayed Products: {displayedProducts.length}</span>
                <span>Show Only Active: {showOnlyActive ? 'Yes' : 'No'}</span>
              </div>
            </div>

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
                {/* Auction-style List Layout */}
                <div className="w-full flex flex-col gap-4">
                  {displayedProducts.map((item, idx) => (
                    <Link key={item.id || idx} href={`/product/${item.id}?from=auction`}>
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="relative w-48 h-36 flex-shrink-0">
                            {/* Discount Badge */}
                            {item.discount && (
                              <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-medium py-1 px-2 rounded z-10">
                                {item.discount}
                              </span>
                            )}
                            {/* Wishlist Icon */}
                            <div className="absolute top-2 right-2 text-gray-400 hover:text-red-500 cursor-pointer z-10"
                                 onClick={(e) => {
                                   e.preventDefault();
                                   e.stopPropagation();
                                   toggleFavorite(item);
                                 }}>
                              {isFavorite(item.id) ? (
                                <FaHeart size={16} className="text-red-500" />
                              ) : (
                                <FaRegHeart size={16} />
                              )}
                            </div>
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-contain rounded-lg bg-gray-50" 
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              {/* Product Title */}
                              <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                                {item.name}
                              </h3>
                              
                              {/* Brand and Condition */}
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-600">
                                  Brand New
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm text-gray-600">
                                  {item.brand || 'Certified Brand'}
                                </span>
                              </div>

                              {/* Product Description */}
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {item.specs}
                              </p>
                            </div>

                            {/* Price and Bidding Info */}
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <div className="text-2xl font-bold text-gray-900">
                                  {item.price}
                                </div>
                                
                                {/* Bidding Information */}
                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                  <span className="flex items-center gap-1">
                                    <span className="font-medium text-blue-600">
                                      {item.bidCount} bids
                                    </span>
                                  </span>
                                  <span className="text-gray-400">•</span>
                                  <span className="font-medium text-orange-600">
                                    {formatTimeRemaining(item.auctionEndTime)} left
                                  </span>
                                </div>
                                
                                {/* Location */}
                                <div className="text-xs text-gray-500 mt-1">
                                  Located in Pakistan
                                </div>
                              </div>

                              {/* Sponsored Badge (randomly show on some items) */}
                              {idx % 3 === 0 && (
                                <div className="text-xs text-gray-500 self-start">
                                  Sponsored
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
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

export default AuctionProductsPage; 