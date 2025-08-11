"use client";

import React, { useState, useEffect } from 'react'
import Navbar from '../Components/Layout/Navbar'
import Footer from '../Components/Layout/Footer'
import { font } from '../Components/Font/font'
import { FaCcVisa, FaCcMastercard } from 'react-icons/fa'
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { useCurrency } from '../context/CurrencyContext';

const page = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const router = useRouter();
  const { convertPriceString, selectedCountry } = useCurrency();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check authentication status
  useEffect(() => {
    const checkLoginState = () => {
      const userData = localStorage.getItem('user');
      
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          
          if (parsedUser && (parsedUser.userId || parsedUser.useremail || parsedUser.email)) {
            setUser(parsedUser);
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem('user');
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.log('Error parsing user data:', error);
          localStorage.removeItem('user');
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginState();

    // Listen for storage changes (login/logout)
    const handleStorageChange = () => {
      checkLoginState();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  // Re-render when currency changes
  useEffect(() => {
    console.log('View Cart: Currency changed to:', selectedCountry);
  }, [selectedCountry]);
  
  // If cart is empty, show the first item or a default message
  const displayItems = cartItems.length > 0 ? cartItems : [];
  
  const formatPrice = (price) => {
    return convertPriceString(`PKR ${price}`);
  };

  const formatSpecs = (item) => {
    const specs = [];
    if (item.specs.storage) specs.push(item.specs.storage);
    if (item.specs.ram) specs.push(item.specs.ram);
    if (item.specs.keyboard) specs.push(item.specs.keyboard);
    return specs.join(' / ');
  };

  const handleIncrement = (item) => {
    updateQuantity(item.id, item.specs, item.quantity + 1);
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.specs, item.quantity - 1);
    }
  };

  // Handle checkout click with authentication check
  const handleProceedToCheckout = () => {
    if (isLoggedIn) {
      // User is logged in, proceed to checkout
      router.push('/checkout');
    } else {
      // User is not logged in, redirect to login with return URL
      router.push('/Auth/login?returnUrl=/checkout');
    }
  };

  // If cart is empty, show empty state
  if (displayItems.length === 0) {
    return (
      <div className={`${font.className}`}>
        <Navbar/>
        <div className="w-[95%] mx-auto my-4 md:my-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <Link href="/" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

  return (
    <div className={`${font.className}`}>
        <Navbar/>
        
        {/* Cart Section */}
        <div className="w-[95%] mx-auto my-4 md:my-8">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-8">
            
            {/* Your Cart Section */}
            <div className="lg:col-span-2">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Your Cart</h2>
              
              {/* Cart Header - Hidden on mobile, shown on desktop */}
              <div className="hidden md:block bg-white p-4 rounded-t-lg border border-b-0 border-gray-300">
                <div className="grid grid-cols-12 p-4 pb-0 gap-4 text-sm font-bold text-black">
                  <div className='text-lg col-span-4'>Product</div>
                  <div className="text-center text-lg col-span-2">Price</div>
                  <div className="text-center text-lg col-span-2">Quantity</div>
                  <div className="text-center text-lg col-span-2">Total</div>
                  <div className="text-center text-lg col-span-2">Action</div>
                </div>
              </div>
              
              {/* Cart Items */}
              {displayItems.map((item, index) => (
                <div key={`${item.id}-${item.specs.storage}-${item.specs.ram}-${item.specs.keyboard}-${item.specs.screenSize}`} className="bg-white border border-gray-300 md:border-t-0 p-3 md:p-4 rounded-lg md:rounded-b-lg mb-4 last:mb-0">
                  <div className="bg-gray-100 p-3 md:p-4 rounded-lg">
                    
                    {/* Mobile Layout */}
                    <div className="block md:hidden">
                      <div className="flex gap-3 mb-4">
                        <img src={item.image} alt="Product" className="w-16 h-16 object-contain flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-bold text-sm text-black mb-1">{item.name}</h3>
                          <p className="text-xs text-gray-600 mb-1">{formatSpecs(item)}</p>
                          <p className="text-xs text-gray-600">Screen size: {item.specs.screenSize}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-black">Price:</span>
                        <span className="font-bold text-black">{formatPrice(item.price)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-black">Quantity:</span>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleDecrement(item)}
                            className="w-10 h-10 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center font-bold transition-colors duration-200"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-black text-lg">{item.quantity.toString().padStart(2, '0')}</span>
                          <button 
                            onClick={() => handleIncrement(item)}
                            className="w-10 h-10 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center font-bold transition-colors duration-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-black">Total:</span>
                        <span className="font-bold text-black text-lg">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                      
                      <div className="flex justify-center mt-3">
                        <button 
                          onClick={() => removeFromCart(item.id, item.specs)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                        >
                          Remove from Cart
                        </button>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                      
                      {/* Product Info */}
                      <div className="flex items-center gap-3 col-span-4">
                        <img src={item.image} alt="Product" className="w-16 h-16 object-contain" />
                        <div>
                          <h3 className="font-bold text-sm text-black">{item.name}</h3>
                          <p className="text-xs whitespace-nowrap text-gray-600">{formatSpecs(item)}</p>
                          <p className="text-xs text-gray-600">Screen size: {item.specs.screenSize}</p>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="text-center col-span-2">
                        <span className="font-bold text-black">{formatPrice(item.price)}</span>
                      </div>
                      
                      {/* Quantity */}
                      <div className="flex items-center justify-center gap-2 col-span-2">
                        <button 
                          onClick={() => handleDecrement(item)}
                          className="w-8 h-8 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center font-bold transition-colors duration-200"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-black">{item.quantity.toString().padStart(2, '0')}</span>
                        <button 
                          onClick={() => handleIncrement(item)}
                          className="w-8 h-8 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center font-bold transition-colors duration-200"
                        >
                          +
                        </button>
                      </div>
                      
                      {/* Total */}
                      <div className="text-center flex items-center justify-center gap-2 col-span-2">
                        <span className="font-bold text-black">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                      
                      {/* Remove Button */}
                      <div className="text-center flex items-center justify-center col-span-2">
                        <button 
                          onClick={() => removeFromCart(item.id, item.specs)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg transition-colors duration-200 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary Section */}
            <div className="lg:col-span-1 mt-6 lg:mt-0">
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Order Summary</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
                
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold">{formatPrice(getCartTotal())}</span>
                </div>
                
                {/* Checkout Button */}
                <button 
                  onClick={handleProceedToCheckout}
                  className="w-full bg-gradient-to-b from-[#6adb4d] via-[#54b056] to-[#468e5d] text-white font-bold py-3 md:py-4 px-4 rounded-lg shadow hover:from-[#468e5d] via-[#54b056] hover:to-[#6adb4d] transition mb-3 md:mb-4 text-sm md:text-base"
                >
                  PROCEED TO CHECK OUT
                </button>
                
                <p className="text-xs text-gray-700 mb-4 md:mb-6 text-center md:text-left">
                  Proceed to Checkout to select your Payment Method
                </p>
                
                {/* Security Badge */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-500 p-1.5 rounded">
                      <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-700">100% Secure Payment</span>
                  </div>
                  <div className="flex gap-1 md:gap-2">
                    <FaCcVisa className="text-2xl md:text-4xl text-blue-600" />
                    <FaCcMastercard className="text-2xl md:text-4xl text-red-500" />
                  </div>
                </div>
              </div>
              
              {/* Features - Outside the box */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="font-bold text-xs md:text-sm text-gray-800">Free</div>
                    <div className="text-xs text-gray-500">Delivery</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="font-bold text-xs md:text-sm text-gray-800">10 Days to</div>
                    <div className="text-xs text-gray-500">Return</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="font-bold text-xs md:text-sm text-gray-800">12 Months</div>
                    <div className="text-xs text-gray-500">Warranty</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Footer/>
    </div>
  )
}

export default page