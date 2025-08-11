'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState('Pakistan');
  const [exchangeRates, setExchangeRates] = useState({
    'Pakistan': { currency: 'PKR', rate: 1, symbol: 'PKR' },
    'United States': { currency: 'USD', rate: 0.0035, symbol: '$' },
    'United Arab Emirates': { currency: 'AED', rate: 0.0129, symbol: 'AED' }
  });

  // Get current currency info
  const getCurrentCurrency = () => {
    return exchangeRates[selectedCountry] || exchangeRates['Pakistan'];
  };

  // Convert price from PKR to selected currency
  const convertPrice = (priceInPKR) => {
    if (!priceInPKR || isNaN(priceInPKR)) return '0';
    
    const currentCurrency = getCurrentCurrency();
    const convertedPrice = priceInPKR * currentCurrency.rate;
    
    // Format based on currency
    switch (currentCurrency.currency) {
      case 'USD':
        return `$${convertedPrice.toFixed(2)}`;
      case 'AED':
        return `AED ${convertedPrice.toFixed(2)}`;
      case 'PKR':
      default:
        return `PKR ${convertedPrice.toLocaleString()}`;
    }
  };

  // Convert price string (e.g., "PKR 1,000") to selected currency
  const convertPriceString = (priceString) => {
    if (!priceString) return '0';
    
    // Extract numeric value from price string
    const numericValue = parseFloat(priceString.replace(/[^\d.]/g, ''));
    if (isNaN(numericValue)) return '0';
    
    return convertPrice(numericValue);
  };

  // Save selected country to localStorage
  useEffect(() => {
    localStorage.setItem('selectedCountry', selectedCountry);
  }, [selectedCountry]);

  // Load selected country from localStorage on mount
  useEffect(() => {
    const savedCountry = localStorage.getItem('selectedCountry');
    if (savedCountry && exchangeRates[savedCountry]) {
      setSelectedCountry(savedCountry);
    }
  }, []);

  const value = {
    selectedCountry,
    setSelectedCountry,
    getCurrentCurrency,
    convertPrice,
    convertPriceString,
    exchangeRates
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}; 