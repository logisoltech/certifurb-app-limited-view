"use client";

import React from 'react';
import { font } from '../Components/Font/font';

const LaptopBanner = ({ categoryFilter, brandFilter }) => {
  // Get category-specific content
  const getCategoryContent = () => {
    switch(categoryFilter) {
      case 'Laptop':
        const laptopTitle = brandFilter 
          ? `Certifurb ${brandFilter} Laptops`
          : 'Certifurb Laptops';
        return {
          title: laptopTitle,
          description: 'Certified renewed devices · Inspected by Experts · Up to 70% cheaper than new.',
          image: '/macs-group.png'
        };
      case 'Desktop PC':
        return {
          title: 'Certifurb Desktop PCs',
          description: 'High-performance desktop computers · Professional grade · Perfect for work and gaming.',
          image: '/macs-group.png'
        };
      case 'Printer':
        return {
          title: 'Certifurb Printers',
          description: 'Quality printing solutions · Office and home use · Reliable and efficient.',
          image: '/macs-group.png'
        };
      case 'LCD':
        return {
          title: 'Certifurb LCD Monitors',
          description: 'Crystal clear displays · Professional quality · Perfect for work and entertainment.',
          image: '/macs-group.png'
        };
      case 'LED':
        return {
          title: 'Certifurb LED Monitors',
          description: 'Bright LED displays · Energy efficient · Superior viewing experience.',
          image: '/macs-group.png'
        };
      case 'Mouse':
        return {
          title: 'Certifurb Computer Mice',
          description: 'Precision pointing devices · Ergonomic designs · Enhanced productivity.',
          image: '/macs-group.png'
        };
      case 'Keyboard':
        return {
          title: 'Certifurb Keyboards',
          description: 'Comfortable typing experience · Mechanical and membrane options · Built to last.',
          image: '/macs-group.png'
        };
      case 'Tablet':
        return {
          title: 'Certifurb Tablets',
          description: 'Portable computing power · Touch-screen convenience · Perfect for mobility.',
          image: '/macs-group.png'
        };
      case 'Drive':
        return {
          title: 'Certifurb Storage Drives',
          description: 'Reliable data storage · Fast performance · Secure your important files.',
          image: '/macs-group.png'
        };
      case 'Network':
        return {
          title: 'Certifurb Network Equipment',
          description: 'Connect with confidence · Professional networking · Fast and reliable connections.',
          image: '/macs-group.png'
        };
      default:
        return {
          title: 'Certifurb Products',
          description: 'Quality technology products · Inspected by Experts · Up to 70% cheaper than new.',
          image: '/macs-group.png'
        };
    }
  };

  const content = getCategoryContent();

  return (
    <div className={`${font.className} w-[95%] mx-auto flex items-center rounded-xl overflow-hidden mt-4 mb-6`} style={{ minHeight: '150px', background: 'linear-gradient(90deg, #333 60%, #00e676 100%)' }}>
      <div className="flex-1 bg-[#333] py-8 pl-8 pr-4 flex flex-col justify-center h-full">
        <div className="text-white font-bold text-2xl md:text-3xl mb-4">{content.title}</div>
        <div className="text-white text-xs md:text-sm">{content.description}</div>
      </div>
      <div className="flex items-center justify-center rounded-bl-full py-3 flex-1 custom-green-bg h-full">
        <img src={content.image} alt={categoryFilter || 'Products'} className="h-24 md:h-32 object-contain" />
      </div>
    </div>
  );
};

export default LaptopBanner; 