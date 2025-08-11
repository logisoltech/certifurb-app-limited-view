"use client";

import React, { useState, useEffect } from 'react';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { font } from '../Font/font';
import { formatPrice } from '../../utils/priceFormatter';
import { useCurrency } from '../../context/CurrencyContext';
import { useFavorites } from '../../context/FavoritesContext';
import Link from 'next/link';

const Samsung = () => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { convertPriceString, selectedCountry } = useCurrency();
  const [laptops, setLaptops] = useState([]);
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
        } else if (currentScreenWidth >= 1400) {
          newVisibleCount = 4; // Show 4 products on larger screens (1400px+)
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

  useEffect(() => {
    fetchLaptops();
  }, []);

  // Re-render when currency changes
  useEffect(() => {
    console.log('Samsung: Currency changed to:', selectedCountry);
  }, [selectedCountry]);

  const fetchLaptops = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.certifurb.com/api/products');
      const data = await response.json();
      
      if (data.success) {
        // Filter laptop products and take only first 12
        const laptopProducts = data.data
          .filter(product => product.ProductCategory?.toLowerCase() === 'laptop')
          .slice(0, 12);
        setLaptops(laptopProducts);
      } else {
        setError('Failed to fetch laptops');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching laptops:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate discount percentage
  const calculateDiscount = (price) => {
    const originalPrice = price * 1.45; // Assuming 45% discount
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  // Navigation functions for slider
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= laptops.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? laptops.length - 1 : prevIndex - 1
    );
  };

  // Get visible products based on screen size
  const getVisibleProducts = () => {
    const products = [];
    
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % laptops.length;
      products.push({ ...laptops[index], displayIndex: index });
    }
    
    return products;
  };

  if (loading) {
    return (
      <div className={`${font.className} px-4 md:px-8 lg:px-12 mb-8 md:mb-12 w-full flex flex-col gap-4`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 pt-4">
          <h2 className="font-bold text-[20px] text-center sm:text-left">Certifurb Renewed Laptops</h2>
          <button className="border border-gray-500 hidden md:block rounded-full px-3 py-1 text-sm hover:bg-gray-100 self-center sm:self-auto sm:mr-3">See All</button>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="text-lg text-gray-600">Loading laptops...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${font.className} px-4 md:px-8 lg:px-12 mb-8 md:mb-12 w-full flex flex-col gap-4`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 pt-4">
          <h2 className="font-bold text-[20px] text-center sm:text-left">Certifurb Renewed Laptops</h2>
          <button className="border border-gray-500 rounded-full px-3 py-1 text-sm hover:bg-gray-100 self-center sm:self-auto sm:mr-3">See All</button>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${font.className} bg-white dark:text-black px-4 md:px-8 lg:px-12 mb-8 md:mb-12 w-full flex flex-col gap-4`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 pt-4">
        <h2 className="font-bold text-[20px] text-left pl-6 md:pl-0 md:text-center sm:text-left">Certifurb Renewed Laptops</h2>
        <Link href="/category?filter=Laptop">
          <button className="border border-gray-500 hidden md:block rounded-full px-3 py-1 text-sm hover:bg-gray-100 self-center sm:self-auto sm:mr-3">See All</button>
        </Link>
      </div>
      
      {/* Main Section */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-4">
        {/* Cards Section with Slider */}
        <div className="flex-1 flex items-center order-1 lg:order-1">
          <div className="relative flex items-center w-full px-6">
            {/* Left Arrow */}
            <button 
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="absolute left-1 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-gray-500 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-6 md:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Products Container */}
            <div className="flex gap-3 md:gap-4 lg:gap-4 overflow-hidden w-full justify-center">
              {laptops.length > 0 ? (
                getVisibleProducts().map((laptop, index) => (
                  <Link key={laptop.ProductID || index} href={`/product/${laptop.ProductID}`}>
                    <div className="bg-white rounded-xl shadow pt-4 md:pt-6 pr-4 md:pr-6 pb-4 pl-2 md:pl-3 border border-gray-400 border-2 relative min-w-[180px] md:min-w-[200px] max-w-[200px] md:max-w-[220px] hover:shadow-lg transition-shadow cursor-pointer">
                      {/* Discount Badge */}
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-xs md:text-sm font-medium mt-1 md:mt-2 ml-1 md:ml-2 py-1 px-2 md:px-3 rounded-full z-10">
                        {calculateDiscount(laptop.ProductPrice)}% vs. new
                      </span>
                      
                      {/* Wishlist button */}
                      <div 
                        className="absolute top-2 right-2 mt-2 md:mt-3 mr-1 md:mr-0 text-black hover:text-red-500 text-sm md:text-base cursor-pointer z-10"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(laptop);
                        }}
                      >
                        {isFavorite(laptop.ProductID) ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart />
                        )}
                      </div>
                      
                      {/* Product Image */}
                      <img
                        src={laptop.ProductImageURL || `/laptop-${(index % 5) + 1}.png`}
                        alt={laptop.ProductName}
                        className="w-full h-32 md:h-36 my-2 md:my-3 object-contain px-2"
                        onError={(e) => {
                          console.log('Image error for:', laptop.ProductName, 'URL:', laptop.ProductImageURL);
                          e.target.src = `/laptop-${(index % 3) + 1}.png`;
                          e.target.onerror = () => {
                            e.target.src = "/laptop.png";
                            e.target.onerror = null;
                          };
                        }}
                        onLoad={() => {
                          console.log('Image loaded for:', laptop.ProductName, 'URL:', laptop.ProductImageURL);
                        }}
                      />
                      
                      {/* Content Container */}
                      <div className="w-full pl-0">
                        {/* Product Name */}
                        <h3 className="text-sm md:text-md font-bold text-gray-800 leading-tight text-left mb-1 overflow-hidden" style={{ 
                          display: '-webkit-box', 
                          WebkitLineClamp: 1, 
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {laptop.ProductName}
                        </h3>
                        
                        {/* Product Description */}
                        <div className="text-xs text-gray-500 text-left mb-0 overflow-hidden" style={{ 
                          display: '-webkit-box', 
                          WebkitLineClamp: 2, 
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {laptop.ProductDesc}
                        </div>
                        
                        {/* Price */}
                        <p className="text-md font-semibold text-black text-left mt-2">
                          {laptop.ProductPrice ? convertPriceString(`PKR ${laptop.ProductPrice}`) : 'Price not available'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex justify-center items-center h-40 w-full">
                  <div className="text-lg text-gray-600">No laptops available</div>
                </div>
              )}
            </div>
            
            {/* Right Arrow */}
            <button 
              onClick={nextSlide}
              disabled={currentIndex + 1 >= laptops.length}
              className={`absolute ${screenWidth <= 1366 ? 'right-2' : 'right-2'} top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-gray-500 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-6 md:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Banner Section */}
        <div className={`relative ${screenWidth < 768 ? 'w-[350px] h-[300px] mx-auto' : 'w-[492px] h-[402px]'} rounded-xl overflow-hidden flex items-center justify-center order-2 lg:order-2`}>
          <img src="/laptop-banner.png" alt="Samsung Banner" className="absolute inset-0 w-full h-full object-cover opacity-100" />
        </div>
      </div>
    </div>
  );
};

export default Samsung;