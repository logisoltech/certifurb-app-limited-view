"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product, selectedOptions = {}) => {
    // Provide default values if options are not provided
    const defaultOptions = {
      storage: selectedOptions.storage || 'Default',
      ram: selectedOptions.ram || 'Default',
      keyboard: selectedOptions.keyboard || 'Default',
      screenSize: selectedOptions.screenSize || 'Default'
    };

    const cartItem = {
      id: product.ProductID,
      name: product.ProductName,
      price: product.ProductPrice,
      image: product.ProductImageURL || '/mini-laptop.png',
      category: product.ProductCategory,
      specs: defaultOptions,
      quantity: 1
    };

    setCartItems(prevItems => {
      // Check if item with same specs already exists
      const existingItemIndex = prevItems.findIndex(item => 
        item.id === cartItem.id &&
        item.specs.storage === cartItem.specs.storage &&
        item.specs.ram === cartItem.specs.ram &&
        item.specs.keyboard === cartItem.specs.keyboard &&
        item.specs.screenSize === cartItem.specs.screenSize
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, cartItem];
      }
    });
  };

  const removeFromCart = (itemId, specs) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.id === itemId &&
          item.specs.storage === specs.storage &&
          item.specs.ram === specs.ram &&
          item.specs.keyboard === specs.keyboard &&
          item.specs.screenSize === specs.screenSize)
      )
    );
  };

  const updateQuantity = (itemId, specs, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, specs);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId &&
        item.specs.storage === specs.storage &&
        item.specs.ram === specs.ram &&
        item.specs.keyboard === specs.keyboard &&
        item.specs.screenSize === specs.screenSize
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 