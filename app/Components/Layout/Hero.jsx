"use client";

import React, { useState, useEffect } from 'react';
import { font } from '../Font/font';
import Image from 'next/image';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const desktopImages = ['/goat.png','/main-1.png', '/main-2.png'];
  const mobileImages = ['/mobile-banner-2.png', '/mobile-banner-1.png', '/mobile-banner-3.png'];
  
  const images = isMobile ? mobileImages : desktopImages;

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Reset image index when switching between mobile/desktop
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [isMobile]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [images.length]);

  return (
    <div className={`${font.className}`}>
      <div className="relative w-full h-[28rem] overflow-hidden">
        {/* Image Slider */}
        <div className="relative w-full h-full">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              alt={`Hero Banner ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* <div className="absolute inset-0 mt-24 md:mt-0 flex flex-col justify-center lg:flex-row lg:justify-between lg:items-center px-6 lg:px-12 py-8 lg:py-0">
          <div className="text-white flex-1 text-center lg:text-left">
            <h1 className="text-3xl lg:text-6xl font-bold mb-2">Main Slider</h1>
            <p className="text-sm lg:text-lg max-w-md mb-6 lg:mb-0 mx-auto lg:mx-0">Subheading that sets up context, shares more info about the website, or generally gets people psyched to keep scrolling.</p>
            
            {/* Mobile Button - Below paragraph */}
            {/* <div className="lg:hidden">
              <button className="custom-green-bg text-white px-6 cursor-pointer py-2 rounded-full font-semibold hover:bg-gray-200 transition">
                Shop Now!
              </button>
            </div>
          </div> */}
          
          {/* Desktop Button - Right side */}
          {/* <div className="hidden lg:block">
            <button className="custom-green-bg text-white px-6 cursor-pointer py-2 mr-12 rounded-full font-semibold hover:bg-gray-200 transition">
              Shop Now!
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Hero;
