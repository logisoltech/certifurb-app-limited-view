"use client";

import React, { useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FaStar, FaUserCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { font } from '../Font/font';

const testimonials = Array(4).fill({
  name: 'John Doe',
  review: 'Was good. This the second laptop I have....',
  description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
});

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1280 }, items: 4 },
  desktop: { breakpoint: { max: 1280, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
  mobile: { breakpoint: { max: 640, min: 0 }, items: 1 }
};

// Custom Arrow Components
const CustomLeftArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-1 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-white text-black border border-gray-500 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 shadow-lg"
    aria-label="Previous"
  >
    <FaChevronLeft size={14} />
  </button>
);

const CustomRightArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-1 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-white text-black border border-gray-500 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 shadow-lg"
    aria-label="Next"
  >
    <FaChevronRight size={14} />
  </button>
);

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= testimonials.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className={`${font.className} bg-white dark:text-black w-full px-12 py-6 mt-8`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold pl-6 md:pl-0 text-[20px]">What Customers Have To Say</h2>
        <button className="border border-gray-300 hidden md:block rounded-full px-4 py-1 text-xs hover:bg-gray-100">See All</button>
      </div>
      
      <div className="relative px-6">
        <Carousel 
          responsive={responsive} 
          infinite 
          autoPlay 
          autoPlaySpeed={4000} 
          arrows={true}
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
        >
          {testimonials.map((item, idx) => (
            <div key={idx} className="px-3 pt-8">
              <div className="bg-purple-100 rounded-xl p-6 pt-12 min-w-[270px] max-w-[300px] w-[270px] h-[320px] flex flex-col shadow-md relative">
                {/* User icon at top center, half inside/outside card */}
                <div className="absolute -top-8 left-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center shadow-lg">
                    <FaUserCircle className="text-green-500 text-4xl" />
                  </div>
                </div>
                
                <div>
                  <div className="font-bold text-lg mb-1">{item.name}</div>
                  <div className="flex items-center mb-2">
                    {Array(5).fill(0).map((_, i) => (
                      <FaStar key={i} className="text-green-500 mr-1 text-sm" />
                    ))}
                  </div>
                  <div className="text-sm font-medium mb-2 text-green-600">{item.review}</div>
                  <div className="text-sm text-gray-700 leading-relaxed">{item.description}</div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Testimonials;