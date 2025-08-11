"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const addToFavorites = (product) => {
    const favoriteItem = {
      id: product.ProductID || product.id,
      name: product.ProductName || product.name,
      price: product.ProductPrice || product.price,
      image: product.ProductImageURL || product.image || '/mini-laptop.png',
      category: product.ProductCategory || product.category,
      brand: product.ProductBrand || product.brand,
      model: product.ProductModel || product.model,
      addedAt: new Date().toISOString()
    };

    setFavorites(prevFavorites => {
      // Check if product already exists in favorites
      const existingIndex = prevFavorites.findIndex(item => item.id === favoriteItem.id);
      
      if (existingIndex > -1) {
        // Product already in favorites, don't add duplicate
        return prevFavorites;
      } else {
        // Add new product to favorites
        return [...prevFavorites, favoriteItem];
      }
    });
  };

  const removeFromFavorites = (productId) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(item => item.id !== productId)
    );
  };

  const toggleFavorite = (product) => {
    const productId = product.ProductID || product.id;
    const isFavorite = favorites.some(item => item.id === productId);
    
    if (isFavorite) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(product);
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const getFavoritesCount = () => {
    return favorites.length;
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    getFavoritesCount
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}; 