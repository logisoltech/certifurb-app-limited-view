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

const CustomRightArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-white text-black border border-gray-500 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 shadow-lg"
    aria-label="Next"
  >
    <FaChevronRight size={14} />
  </button>
);

const Laptop = () => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { convertPriceString, selectedCountry } = useCurrency();
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch laptop data from database
  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.certifurb.com/api/products');
        const data = await response.json();
        
        if (data.success) {
          // Filter only laptop products and limit to 3
          const laptopProducts = data.data
            .filter(product => product.ProductCategory?.toLowerCase() === 'laptop')
            .slice(0, 3);
          setLaptops(laptopProducts);
        } else {
          setError(data.message || 'Failed to fetch laptops');
        }
      } catch (error) {
        console.error('Error fetching laptops:', error);
        setError('Failed to load laptops');
      } finally {
        setLoading(false);
      }
    };

    fetchLaptops();
  }, []);

  // Re-render when currency changes
  useEffect(() => {
    console.log('Laptop: Currency changed to:', selectedCountry);
  }, [selectedCountry]);

  // Calculate discount percentage
  const calculateDiscount = (price) => {
    const originalPrice = price * 1.45; // Assuming 45% discount
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  // Navigation functions
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

  return (
    <div className={`${font.className} px-4 md:px-8 lg:px-12 mb-8 md:mb-12 w-full flex flex-col gap-4`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 pt-4 mb-4 md:mb-8">
        <h2 className="font-bold text-[20px] text-center sm:text-left">Certifurb Renewed Laptops</h2>
        <Link href="/category?filter=Laptop">
          <button className="border border-gray-500 rounded-full px-3 py-1 text-sm hover:bg-gray-100 self-center sm:self-auto sm:mr-3">See All</button>
        </Link>
      </div>
      
      {/* Main Section */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-4">
        {/* Cards Section */}
        <div className="flex-1 flex items-center order-1 lg:order-1">
          
          <div className="relative flex items-center w-full px-6">
            {/* Left Arrow */}
            <CustomLeftArrow onClick={prevSlide} />

            <div className="flex gap-3 md:gap-4 lg:gap-4 overflow-hidden w-full">
              {loading ? (
                // Loading state
                [...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 rounded-xl shadow pt-4 md:pt-6 pr-4 md:pr-6 pb-4 pl-2 md:pl-3 border border-gray-400 border-2 relative min-w-[180px] md:min-w-[200px] max-w-[200px] md:max-w-[220px] flex-shrink-0 animate-pulse"
                  >
                    <div className="w-full h-32 md:h-40 my-2 md:my-4 bg-gray-300 rounded"></div>
                    <div className="w-full pl-0">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))
              ) : error ? (
                // Error state
                <div className="flex items-center justify-center w-full h-32 text-red-500">
                  <p>Error loading laptops: {error}</p>
                </div>
              ) : laptops.length === 0 ? (
                // No laptops found
                <div className="flex items-center justify-center w-full h-32 text-gray-500">
                  <p>No laptops available</p>
                </div>
              ) : (
                // Display laptops
                laptops.map((laptop) => (
                  <Link key={laptop.ProductID} href={`/product/${laptop.ProductID}`}>
                    <div className="bg-white rounded-xl shadow pt-4 md:pt-6 pr-4 md:pr-6 pb-4 pl-2 md:pl-3 border border-gray-400 border-2 relative min-w-[180px] md:min-w-[200px] max-w-[200px] md:max-w-[220px] flex-shrink-0 hover:shadow-lg transition-shadow cursor-pointer">
                      {/* Discount Badge */}
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-xs md:text-sm font-medium mt-1 md:mt-2 ml-1 md:ml-2 py-1 px-2 md:px-3 rounded-full">
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
                        src={laptop.ProductImageURL || '/laptop.png'}
                        alt={laptop.ProductName}
                        className="w-full h-32 md:h-40 my-2 md:my-4 object-contain px-2"
                      />
                      
                      {/* Content Container */}
                      <div className="w-full pl-0">
                        {/* Product Name */}
                        <h3 className="text-sm md:text-md font-bold text-gray-800 leading-tight text-left">
                          {laptop.ProductName}
                        </h3>
                        
                        {/* Description */}
                        <div className="text-xs md:text-sm text-gray-500 mb-2 text-left">
                          {laptop.ProductDesc || 'High-quality refurbished laptop'}
                        </div>
                        
                        {/* Price */}
                        <p className="text-md font-semibold text-black mt-2 text-left">
                {convertPriceString(`PKR ${laptop.ProductPrice}`)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
            
            {/* Right Arrow */}
            <CustomRightArrow onClick={nextSlide} />
          </div>
        </div>
        
        {/* Banner Section */}
       
      </div>
    </div>
  );
};

export default Laptop;