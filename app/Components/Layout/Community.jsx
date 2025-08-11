"use client";

import React, { useState, useEffect } from 'react';
import { FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { font } from '../Font/font';

const videoData = Array(12).fill({ image: '/clock.jpg' }); // Increased to have enough cards for larger screens

const Community = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  // Handle window resize
  useEffect(() => {
    const calculateAndSetVisibleCount = () => {
      if (typeof window !== 'undefined') {
        const currentScreenWidth = window.innerWidth;
        setScreenWidth(currentScreenWidth);
        
        let newVisibleCount = 4; // Default for 1366px and below
        if (currentScreenWidth >= 1920) {
          newVisibleCount = 8; // Show 8 cards on very large screens (1920px+)
        } else if (currentScreenWidth >= 1440) {
          newVisibleCount = 6; // Show 6 cards on large screens (1440px+)
        } else {
          newVisibleCount = 4; // Show 4 cards on smaller screens (1366px and below)
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

  // Navigation functions
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= videoData.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? videoData.length - 1 : prevIndex - 1
    );
  };

  // Get visible cards based on screen size
  const getVisibleCards = () => {
    const cards = [];
    
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % videoData.length;
      cards.push({ ...videoData[index], displayIndex: index });
    }
    
    return cards;
  };

  return (
    <div className={`${font.className} bg-gray-50 dark:text-black w-full px-4 md:px-8 lg:px-12 py-4 md:py-6 mt-8 md:mt-12`}>
      {/* Header */}
      {/* <h2 className="font-bold text-[20px] mb-4 md:mb-6 md:text-center pl-6 md:pl-0 text-left">Certifurb Community</h2> */}
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-stretch">
        {/* Banner */}
        <div className="rounded-xl hidden md:block w-[300px] h-[402px] flex items-center justify-center bg-gradient-to-br from-green-500 to-green-700 p-6 md:p-8 order-1 lg:order-1">
          <span className="text-white text-lg md:text-xl lg:text-2xl font-bold leading-tight text-center drop-shadow-lg">
            Join the<br />Certifurb<br />Community
          </span>
        </div>
        
        {/* Video Cards */}
        <div className="flex-1 flex items-center order-2 lg:order-2">
          <div className="relative flex items-center w-full px-6">
            {/* Left Arrow */}
            <button 
              onClick={prevSlide}
              className="absolute left-1 top-1/2 transform -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-black hover:bg-gray-100 flex-shrink-0"
            >
              <FaChevronLeft className="text-sm md:text-base" />
            </button>
            
            {/* Video Cards Container */}
            <div className="flex gap-2 md:gap-3 lg:gap-3 overflow-hidden w-full">
              {getVisibleCards().map((item, idx) => (
                <div 
                  key={`${currentIndex}-${idx}`}
                  className="relative rounded-xl overflow-hidden min-w-[120px] md:min-w-[140px] lg:min-w-[160px] max-w-[140px] md:max-w-[160px] lg:max-w-[180px] h-64 md:h-72 lg:h-80 bg-gray-200 flex items-center justify-center flex-shrink-0"
                >
                  <img 
                    src={item.image} 
                    alt="Community Video" 
                    className="w-full h-full object-cover opacity-70" 
                  />
                  <button className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white bg-opacity-80 rounded-full p-3 md:p-4 shadow-lg">
                      <FaPlay className="text-xl md:text-2xl lg:text-3xl text-gray-700" />
                    </span>
                  </button>
                </div>
              ))}
            </div>
            
            {/* Right Arrow */}
            <button 
              onClick={nextSlide}
              className={`absolute ${screenWidth < 768 ? 'right-0' : screenWidth <= 1366 ? 'right-[132px]' : 'right-3'} top-1/2 transform -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-black hover:bg-gray-100 flex-shrink-0`}
            >
              <FaChevronRight className="text-sm md:text-base" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;