"use client";

import React, { useState } from 'react';
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaInstagram, FaPlus, FaMinus } from "react-icons/fa";
import { font } from '../Font/font';
import Link from 'next/link';

const aboutLinks = ["About Certifurb", "Shop", "Our Blog", "Become A Seller"];
const infoLinks = ["Help Center & FAQ", "Contact", "Terms & Conditions", "Legal Policy", "Privacy Policy", "Refund & Return Policy"];
const accountLinks = ["My Account", "Track Your Order", "Raise A Claim", "Track Your Claim"];

const Footer = () => {
  return (
    <footer className={`${font.className} w-full bg-[#232323] border-t-4 border-green-400 text-white pt-8 pb-4 px-6 md:px-12`}>
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Left Section - Company Info */}
        <div className="md:col-span-1">
          <div className="flex items-center mb-4">
            <img src="/secondary-logo.png" alt="Certifurb Logo" className="w-40" />
          </div>
          <p className="text-gray-300 text-sm mb-6 leading-relaxed">
            Certifurb is a Registered Tradename representing Glonect Trading LLC.
          </p>
          <div className='flex items-center mb-6 space-x-2'>
            <img src="/usa.jpeg" className='w-auto h-8'/>
            <img src="/uae.jpeg" className='w-auto h-8'/>
          </div>
          <button className="bg-green-400 hover:bg-green-500 text-white px-6 py-2 rounded text-sm font-medium mb-6">
            Auction
          </button>
         
        </div>

        {/* About Us */}
        <div>
          <h3 className="text-white font-semibold mb-4">About Us</h3>
          <ul className="space-y-3">
            {aboutLinks.map((link, i) => (
              <li key={i}>
                <a href="#" className="text-gray-300 text-sm hover:text-white transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Informations */}
        <div>
          <h3 className="text-white font-semibold mb-4">Informations</h3>
          <ul className="space-y-3">
            {infoLinks.map((link, i) => (
              <li key={i}>
                <a href="#" className="text-gray-300 text-sm hover:text-white transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* My Account */}
        <div>
          <h3 className="text-white font-semibold mb-4">My Account</h3>
          <ul className="space-y-3">
            {accountLinks.map((link, i) => (
              <li key={i}>
                {link === "Track Your Order" ? (
                  <Link href="/track-order" className="text-gray-300 text-sm hover:text-white transition-colors">
                    {link}
                  </Link>
                ) : (
                  <a href="#" className="text-gray-300 text-sm hover:text-white transition-colors">
                    {link}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Payment Methods */}
          <div className="mt-8">
            <div className="flex flex-wrap gap-2">
              <div className="bg-white rounded p-1">
                <img src="/easypaisa.png" alt="EasyPaisa" className="h-6 w-auto" onError={(e) => e.target.style.display = 'none'} />
              </div>
              <div className="bg-white rounded p-1">
                <img src="/sada.png" alt="Sada" className="h-6 w-auto" onError={(e) => e.target.style.display = 'none'} />
              </div>
              <div className="bg-white rounded p-1">
                <img src="/nayapay.png" alt="NayaPay" className="h-6 w-auto" onError={(e) => e.target.style.display = 'none'} />
              </div>
              <div className="bg-white rounded p-1">
                <img src="/mc.png" alt="Mastercard" className="h-6 w-auto" onError={(e) => e.target.style.display = 'none'} />
              </div>
              <div className="bg-white rounded p-1">
                <img src="/visa.png" alt="Visa" className="h-6 w-auto" onError={(e) => e.target.style.display = 'none'} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 pt-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Contact Info */}
          <div className="flex flex-col md:flex-col gap-4 md:gap-2 text-sm text-gray-300">
            <div>
              <span className="text-white">info@certifurb.me</span>
              <span className="text-gray-500 ml-2">(Reply within 1 business day)</span>
            </div>
            <div>
              <span className="text-white">+92-333-123-4567</span>
            </div>
            {/* <div>
              <span className="text-gray-500">Monday to Friday 9:30 am to 5:30 pm</span>
            </div> */}
          </div>

          {/* Social Media */}
          <div className="flex gap-4">
            <a href="#" className="bg-green-400 hover:bg-green-500 text-white p-2 rounded-full transition-colors">
              <FaFacebookF size={16} />
            </a>
            <a href="#" className="bg-green-400 hover:bg-green-500 text-white p-2 rounded-full transition-colors">
              <FaInstagram size={16} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-4 text-center text-gray-500 text-sm">
          © 2025 Certifurb All Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;