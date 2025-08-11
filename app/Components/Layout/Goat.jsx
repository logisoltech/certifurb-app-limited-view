"use client";

import React, { useState, useEffect } from 'react';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { font } from '../Font/font';
import { font2 } from '../Font/font';
import Link from 'next/link';
import { formatPrice } from '../../utils/priceFormatter';
import { useFavorites } from '../../context/FavoritesContext';
import { useCurrency } from '../../context/CurrencyContext';

const Goat = () => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { convertPriceString, selectedCountry } = useCurrency();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [goatProducts, setGoatProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  // Calculate visible products based on screen size
  const calculateVisibleCount = () => {
    if (typeof window !== 'undefined') {
      const screenWidth = window.innerWidth;
      if (screenWidth < 768) {
        return 3; // Show 1 card on mobile only
      } else if (screenWidth >= 1920) {
        return 6; // Show 6 products on very large screens (1920px+)
      } else if (screenWidth >= 1440) {
        return 5; // Show 5 products on large screens (1440px+)
      } else if (screenWidth >= 1400) {
        return 4; // Show 4 products on larger screens (1400px+)
      } else {
        return 3; // Show 3 products on smaller screens (laptops and below)
      }
    }
    return 3; // Default for SSR
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newScreenWidth = window.innerWidth;
      setScreenWidth(newScreenWidth);
      setVisibleCount(calculateVisibleCount());
    };

    // Set initial values
    setScreenWidth(window.innerWidth);
    setVisibleCount(calculateVisibleCount());

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch GOAT products from database
  useEffect(() => {
    const fetchGoatProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.certifurb.com/api/products');
        const result = await response.json();
        
        if (result.success) {
          // Filter only GOAT Product category
          const goatProductsData = result.data.filter(product => 
            product.ProductCategory === 'GOAT Product'
          );
          setGoatProducts(goatProductsData);
        } else {
          setError(result.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching GOAT products:', error);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchGoatProducts();
  }, []);

  // Re-render when currency changes
  useEffect(() => {
    console.log('GOAT: Currency changed to:', selectedCountry);
  }, [selectedCountry]);

  // Calculate discount percentage
  const calculateDiscount = (price) => {
    const originalPrice = price * 1.45; // Assuming 45% discount
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  // Carousel navigation functions
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= goatProducts.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? goatProducts.length - 1 : prevIndex - 1
    );
  };

  // Get visible products based on screen size
  const getVisibleProducts = () => {
    const products = [];
    
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % goatProducts.length;
      products.push({ ...goatProducts[index], displayIndex: index });
    }
    
    return products;
  };

  return (
    <div className={`${font.className} px-4 bg-white dark:bg-white md:px-8 lg:px-12 mb-8 md:mb-12 w-full flex flex-col gap-4`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 pt-4 md:mt-4 mb-1 md:mb-2">
        <h1 className="font-extrabold text-[20px] text-left pl-6 md:pl-0">Shop <span className={`${font2.className} text-blue-800 font-bold`}>G.O.A.T</span> Products</h1>
        <Link href="/category?filter=GOAT%20Product">
          <button className="border border-gray-500 rounded-full px-3 py-1 text-sm hover:bg-gray-100 hidden md:block self-center sm:self-auto sm:mr-3">See All</button>
        </Link>
      </div>
      
      {/* Main Section */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-4">
        {/* Banner Section */}
        <div className={`relative ${screenWidth < 768 ? 'w-[350px] h-[300px] mx-auto' : 'w-[492px] h-[402px]'} rounded-xl overflow-hidden flex items-center justify-center order-1 lg:order-1`}>
          <img src="/goat-main.png" alt="GOAT Banner" className="absolute inset-0 w-full h-full object-cover" />
          
        </div>
        
        {/* Cards Section */}
        <div className="flex-1 flex items-center order-2 lg:order-2">
          {loading ? (
            <div className="flex items-center justify-center w-full h-40">
              <div className="text-gray-500">Loading GOAT products...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center w-full h-40">
              <div className="text-red-500">Error: {error}</div>
            </div>
          ) : goatProducts.length === 0 ? (
            <div className="flex items-center justify-center w-full h-40">
              <div className="text-gray-500">No GOAT products found</div>
            </div>
          ) : (
            <div className="relative flex items-center w-full px-6">
              {/* Left Arrow */}
              <button 
                onClick={prevSlide}
                className="absolute left-1 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-gray-500 hover:bg-gray-200 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-6 md:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex gap-2 md:gap-3 lg:gap-3 overflow-hidden w-full">
                {/* Display GOAT products from database in carousel */}
                {getVisibleProducts().map((product, index) => (
                  <Link key={`${product.ProductID}-${currentIndex}-${index}`} href={`/product/${product.ProductID}`}>
                    <div className={`bg-white rounded-xl shadow pt-4 md:pt-6 pr-4 md:pr-6 pb-4 pl-2 md:pl-3 border border-gray-400 border-2 relative ${screenWidth < 768 ? 'min-w-[180px] max-w-[100px]' : 'min-w-[140px] md:min-w-[200px] max-w-[160px] md:max-w-[200px]'} flex-shrink-0 hover:shadow-lg transition-shadow cursor-pointer`}>
                      {/* Discount Badge */}
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-xs md:text-sm font-medium mt-1 md:mt-2 ml-1 md:ml-2 py-1 px-2 md:px-3 rounded-full">
                        {calculateDiscount(product.ProductPrice)}% vs. new
                      </span>
                      
                      {/* Wishlist button */}
                      <div 
                        className="absolute top-2 right-2 mt-2 md:mt-3 mr-1 md:mr-0 text-black hover:text-red-500 text-sm md:text-base cursor-pointer z-10"
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
                      
                      {/* Product Image */}
                      <img
                        src={product.ProductImageURL || `/goat-${(product.displayIndex % 5) + 1}.png`}
                        alt={product.ProductName}
                        className="w-full h-32 md:h-40 my-2 md:my-4 object-contain px-2"
                      />
                      
                      {/* Content Container */}
                      <div className="w-full pl-0">
                        {/* Product Name */}
                        <h3 className="text-sm md:text-md font-bold text-black leading-tight text-left">
                          {product.ProductName}
                        </h3>
                        
                        {/* Specs */}
                        <div className="text-xs md:text-sm text-gray-500 mb-2 text-left">
                          {product.ProductDesc}
                        </div>
                        
                        {/* Price */}
                        <p className="text-md font-semibold text-black mt-2 text-left">
                          {convertPriceString(`PKR ${product.ProductPrice}`)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Right Arrow */}
              <button 
                onClick={nextSlide}
                className={`absolute ${screenWidth < 768 ? 'right-2' : screenWidth <= 1366 ? 'right-20' : 'right-3'} top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-gray-500 hover:bg-gray-200 flex items-center justify-center`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-6 md:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Goat;
