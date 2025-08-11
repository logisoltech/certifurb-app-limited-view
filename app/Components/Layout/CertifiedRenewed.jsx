"use client";

import React, { useEffect, useRef } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { font } from '../Font/font';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const promotionItem = { id: 1, name: 'Promotion', image: '/tick.png', href:"#" };

const products = [
  { id: 2, name: 'Laptops', image: '/laptop.png', href:"/category?filter=Laptop" },
  { id: 3, name: 'Desktop PC', image: '/desktop-PC.png', href:"/category?filter=Desktop PC" },
  { id: 4, name: 'Mouse', image: '/mouse 1.png', href:"/category?filter=Mouse" },
  { id: 5, name: 'Keyboard', image: '/keyboard-1.png', href:"/category?filter=Keyboard" },
  { id: 6, name: 'Monitors', image: '/lcds.png', href:"/category?filter=Monitors" },
  { id: 7, name: 'Headphones', image: '/headphones.png', href:"/category?filter=Drive" },
  { id: 8, name: 'Network', image: '/routers.png', href:"/category?filter=Network" },
  { id: 11, name: 'Chargers', image: '/chargers.png', href:"/category?filter=Network" },
  { id: 9, name: 'Printer', image: '/printers.png', href:"/category?filter=Printer" },
  { id: 10, name: 'Tablet', image: '/tablet-img.png', href:"/category?filter=Tablet" },
];

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1280 }, items: 5, slidesToSlide: 1 },
  desktop: { breakpoint: { max: 1280, min: 1024 }, items: 3, slidesToSlide: 1 },
  tablet: { breakpoint: { max: 1024, min: 480 }, items: 2, slidesToSlide: 1 },
  mobile: { breakpoint: { max: 480, min: 0 }, items: 2, slidesToSlide: 1 }
};

const CertifiedRenewed = () => {
  const carouselRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const container = document.getElementById('certified-renewed-carousel');
      if (!container) return;
  
      const items = container.querySelectorAll('.react-multi-carousel-item');
      if (items.length > 0) {
        items.forEach((item) => {
          item.style.removeProperty('width'); // Only remove width
        });
        clearInterval(interval); // Done
      }
    }, 100);
  
    return () => clearInterval(interval);
  }, []);  

  const handlePrevious = () => {
    if (carouselRef.current) {
      carouselRef.current.previous();
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  return (
    <div className={`${font.className} bg-white dark:text-black px-12 pt-12`}>
      <div className="mb-2">
        <h1 className="font-extrabold text-[20px]">Shop Certified Renewed</h1>
      </div>

      {/* Main container with fixed promotion and carousel */}
      <div className="flex items-start gap-2 justify-center sm:justify-start">
        {/* COMPLETELY SEPARATE Promotion Item - NOT in carousel - HIDDEN ON MOBILE */}
        <div className="flex-shrink-0 hidden sm:block">
          <div className="p-1 sm:py-3 px-0">
            <Link href={promotionItem.href}>
              <div className="bg-gray-100 rounded-md shadow-md flex flex-col justify-center items-center h-[110px] sm:h-[144px] w-[120px] sm:w-[155px] overflow-hidden">
                <img
                  src={promotionItem.image}
                  alt={promotionItem.name}
                  className="w-[85px] sm:w-[109px] h-[60px] sm:h-[78px]"
                />
                <p className="mt-2 sm:mt-4 font-extrabold text-[14px] sm:text-[16px] text-center">{promotionItem.name}</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Carousel container - completely separate - responsive margin */}
        <div className="flex-1 ml-0 sm:ml-12 overflow-hidden relative">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition-colors duration-200"
            aria-label="Previous"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition-colors duration-200"
            aria-label="Next"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>

          <Carousel 
            ref={carouselRef}
            responsive={responsive} 
            infinite 
            autoPlay 
            autoPlaySpeed={3000} 
            arrows={false}
            containerClass="carousel-container"
            itemClass="carousel-item"
          >
            {products.map((product) => (
              <div key={product.id} className="p-1 sm:py-3 px-0">
                <Link href={product.href}>
                  <div className="bg-gray-100 rounded-md shadow-md flex flex-col justify-center items-center h-[110px] sm:h-[144px] w-[120px] sm:w-[155px] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-[85px] sm:w-[109px] h-[60px] sm:h-[78px]"
                    />
                    <p className="mt-2 sm:mt-4 font-extrabold text-[14px] sm:text-[16px] text-center">{product.name}</p>
                  </div>
                </Link>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );  
};

export default CertifiedRenewed;
