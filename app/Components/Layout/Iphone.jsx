"use client";

import React, { useState, useEffect } from 'react';
import { FaRegHeart, FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { font } from '../Font/font';
import Link from 'next/link';
import { formatPrice } from '../../utils/priceFormatter';
import { useCurrency } from '../../context/CurrencyContext';
import { useFavorites } from '../../context/FavoritesContext';

// Custom Arrow Components
const CustomLeftArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-1 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-white text-black border border-gray-500 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 shadow-lg"
    aria-label="Previous"
  >
    <FaChevronLeft size={14} />
  </button>
);

const CustomRightArrow = ({ onClick, screenWidth }) => (
  <button
    onClick={onClick}
    className={`absolute ${screenWidth < 768 ? 'right-[26px]' : screenWidth <= 1366 ? 'right-20' : 'right-3'} top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-white text-black border border-gray-500 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 shadow-lg`}
    aria-label="Next"
  >
    <FaChevronRight size={14} />
  </button>
);

const Iphone = () => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { convertPriceString, selectedCountry } = useCurrency();
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  // Handle window resize
  useEffect(() => {
    const calculateAndSetVisibleCount = () => {
      if (typeof window !== 'undefined') {
        const currentScreenWidth = window.innerWidth;
        setScreenWidth(currentScreenWidth);
        
        let newVisibleCount = 3; // Default
        if (currentScreenWidth >= 1920) {
          newVisibleCount = 6; // Show 6 products on very large screens (1920px+)
        } else if (currentScreenWidth >= 1440) {
          newVisibleCount = 5; // Show 5 products on large screens (1440px+)
        } else {
          newVisibleCount = 3; // Show 3 products on smaller screens (1366px and below)
        }
        
        setVisibleCount(newVisibleCount);
      }
    };

    // Set initial values
    calculateAndSetVisibleCount();

    // Add resize event listener
    window.addEventListener('resize', calculateAndSetVisibleCount);

    // Cleanup
    return () => window.removeEventListener('resize', calculateAndSetVisibleCount);
  }, []);

  // Fetch monitors data from database
  useEffect(() => {
    const fetchMonitors = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.certifurb.com/api/products');
        const data = await response.json();
        
        if (data.success) {
          // Filter monitor products (LCD, LED, Monitor) - same logic as Categories.jsx
          const monitorProducts = data.data
            .filter(product => {
              const category = product.ProductCategory?.toLowerCase();
              return category === 'lcd' || category === 'led' || category === 'monitor';
            });
          setMonitors(monitorProducts);
        } else {
          setError(data.message || 'Failed to fetch monitors');
        }
      } catch (error) {
        console.error('Error fetching monitors:', error);
        setError('Failed to load monitors');
      } finally {
        setLoading(false);
      }
    };

    fetchMonitors();
  }, []);

  // Re-render when currency changes
  useEffect(() => {
    console.log('Iphone: Currency changed to:', selectedCountry);
  }, [selectedCountry]);

  // Calculate discount percentage
  const calculateDiscount = (price) => {
    const originalPrice = price * 1.45; // Assuming 45% discount
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  // Navigation functions
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= monitors.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? monitors.length - 1 : prevIndex - 1
    );
  };

  // Get visible products based on screen size
  const getVisibleProducts = () => {
    const products = [];
    
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % monitors.length;
      products.push({ ...monitors[index], displayIndex: index });
    }
    
    return products;
  };

  return (
    <div className={`${font.className} bg-white dark:text-black px-4 md:px-8 lg:px-12 mb-8  md:mb-12 mt-8 w-full flex flex-col gap-4`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 pt-4">
        <h2 className="font-bold text-[20px] md:text-center pl-6 md:pl-0 text-left">Certifurb Renewed Monitors</h2>
        <Link href="/category?filter=Monitors">
          <button className="border hidden md:block border-gray-500 rounded-full px-3 py-1 text-sm hover:bg-gray-100 self-center sm:self-auto sm:mr-3">See All</button>
        </Link>
      </div>
      
      {/* Main Section */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-4">
        {/* Left Banner */}
        <div className={`relative ${screenWidth < 768 ? 'w-[350px] h-[300px] mx-auto' : 'w-[492px] h-[402px]'} rounded-xl overflow-hidden flex items-center justify-center`}>
          <img src="/banner-image2.png" alt="Laptops" className="absolute inset-0 w-full h-full object-cover" />
          
        </div>
        
        {/* Right Cards */}
        <div className="flex-1 flex items-center">
          <div className="relative flex items-center w-full px-6">
            {/* Left Arrow */}
            <CustomLeftArrow onClick={prevSlide} />

            <div className="flex gap-2 md:gap-3 lg:gap-3 overflow-hidden w-full">
              {loading ? (
                // Loading state
                [...Array(visibleCount)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 rounded-xl shadow pt-4 md:pt-6 pr-4 md:pr-6 pb-4 pl-2 md:pl-3 border border-gray-400 border-2 relative min-w-[160px] md:min-w-[180px] max-w-[180px] md:max-w-[200px] flex-shrink-0 animate-pulse"
                  >
                    <div className="w-full h-32 md:h-40 my-2 md:my-4 bg-gray-300 rounded"></div>
                    <div className="w-full pl-0">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))
              ) : error ? (
                // Error state
                <div className="flex items-center justify-center w-full h-32 text-red-500">
                  <p>Error loading monitors: {error}</p>
                </div>
              ) : monitors.length === 0 ? (
                // No monitors found
                <div className="flex items-center justify-center w-full h-32 text-gray-500">
                  <p>No monitors available</p>
                </div>
              ) : (
                // Display monitors using getVisibleProducts
                getVisibleProducts().map((monitor) => (
                  <Link key={`${monitor.ProductID}-${currentIndex}`} href={`/product/${monitor.ProductID}`}>
                    <div className="bg-white rounded-xl shadow pt-4 md:pt-6 pr-4 md:pr-6 pb-4 pl-2 md:pl-3 border border-gray-400 border-2 relative min-w-[160px] md:min-w-[180px] max-w-[180px] md:max-w-[200px] flex-shrink-0 hover:shadow-lg transition-shadow cursor-pointer">
                      {/* Discount Badge */}
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-xs md:text-sm font-medium mt-1 md:mt-2 ml-1 md:ml-2 py-1 px-2 md:px-3 rounded-full">
                        {calculateDiscount(monitor.ProductPrice)}% vs. new
                      </span>
                      
                      {/* Wishlist button */}
                      <div 
                        className="absolute top-2 right-2 mt-2 md:mt-3 mr-1 md:mr-0 text-black hover:text-red-500 text-sm md:text-base cursor-pointer z-10"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(monitor);
                        }}
                      >
                        {isFavorite(monitor.ProductID) ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart />
                        )}
                      </div>
                      
                      {/* Product Image */}
                      <img
                        src={monitor.ProductImageURL || '/monitor-1.png'}
                        alt={monitor.ProductName}
                        className="w-full h-32 md:h-40 my-2 md:my-4 object-contain px-2"
                      />
                      
                      {/* Content Container */}
                      <div className="w-full pl-0">
                        {/* Product Name */}
                        <h3 className="text-sm md:text-md font-bold text-gray-800 leading-tight text-left mb-1 overflow-hidden" style={{ 
                          display: '-webkit-box', 
                          WebkitLineClamp: 1, 
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {monitor.ProductName}
                        </h3>

                        {/* Product Description */}
                        <div className="text-xs text-gray-500 text-left mb-0 overflow-hidden" style={{ 
                          display: '-webkit-box', 
                          WebkitLineClamp: 1, 
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {monitor.ProductDesc}
                        </div>
                        
                        {/* Price */}
                        <p className="text-md font-semibold text-black mt-2 text-left">
                          {convertPriceString(`PKR ${monitor.ProductPrice}`)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
            
            {/* Right Arrow */}
            <CustomRightArrow onClick={nextSlide} screenWidth={screenWidth} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Iphone;