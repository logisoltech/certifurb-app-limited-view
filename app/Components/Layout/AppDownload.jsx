"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const AppDownload = () => {
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <section className="relative w-full h-auto overflow-hidden">
      {/* Background Image */}
      <div className="relative w-full h-full">
        <img
          src={isMobile ? "/mobile-app-download.png" : "/app-banner.png"}
          alt="App Download Banner"
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Content - Only Download Buttons */}
        <div className="absolute hidden md:block inset-0">
          {/* Download Buttons positioned to align with banner text */}
          <div className="absolute left-[5%] lg:left-[8%] top-[60%] lg:top-[65%]">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Google Play Store Button */}
              <a 
                href="#" 
                className="inline-block hover:transform hover:scale-105 transition-transform duration-200 drop-shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/playstore-download.png"
                  alt="Get it on Google Play"
                  width={150}
                  height={45}
                  className="h-11 w-auto"
                />
              </a>
              
              {/* Apple App Store Button */}
              <a 
                href="#" 
                className="inline-block hover:transform hover:scale-105 transition-transform duration-200 drop-shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/apple-download.png"
                  alt="Download on the App Store"
                  width={150}
                  height={45}
                  className="h-11 w-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload; 