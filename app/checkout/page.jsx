"use client";

import React, { useState, useEffect } from 'react';
import Footer from '../Components/Layout/Footer';
import { font } from '../Components/Font/font';
import { FaHome, FaInfoCircle, FaTruck, FaUndo, FaShieldAlt, FaCcVisa, FaCcMastercard, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { formatPrice as formatPriceUtil } from '../utils/priceFormatter';
import { useCurrency } from '../context/CurrencyContext';

const CheckoutPage = () => {
  const [selectedCountry, setSelectedCountry] = useState('Pakistan');
  const { convertPriceString, selectedCountry: currencyCountry } = useCurrency();
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [billingAddress, setBillingAddress] = useState('same');
  
  // User and card state
  const [user, setUser] = useState(null);
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    nameOnCard: '',
    expiry: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form data state
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });
  
  // Billing address state
  const [billingFormData, setBillingFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: ''
  });
  
  // Shipment address state
  const [shipmentAddress, setShipmentAddress] = useState('');
  const [isLoadingShipmentAddress, setIsLoadingShipmentAddress] = useState(false);
  
  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);

  useEffect(() => {
    console.log('useEffect started');
    
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      
      // Debug: Check all localStorage keys
      console.log('All localStorage keys:', Object.keys(localStorage));
      console.log('Cart from localStorage:', localStorage.getItem('cart'));
      
      // Load cart data from localStorage
      console.log('About to call loadCartData()');
      loadCartData().catch(error => {
        console.error('Error in loadCartData:', error);
      });
    } catch (error) {
      console.error('Error in useEffect:', error);
    }
  }, []);

  // Re-render when currency changes
  useEffect(() => {
    console.log('Checkout: Currency changed to:', currencyCountry);
  }, [currencyCountry]);

  const loadCartData = async () => {
    console.log('loadCartData function started');
    try {
      console.log('Setting isLoadingCart to true');
      setIsLoadingCart(true);
      
      // Try multiple possible cart keys
      let cartData = localStorage.getItem('cart') || 
                    localStorage.getItem('shopping-cart') || 
                    localStorage.getItem('cartItems') ||
                    localStorage.getItem('shoppingCart');
      
      console.log('Raw cart data from localStorage:', cartData);
      
      // If no cart found, try to find any key containing 'cart'
      if (!cartData) {
        const allKeys = Object.keys(localStorage);
        console.log('All localStorage keys:', allKeys);
        const cartKeys = allKeys.filter(key => key.toLowerCase().includes('cart'));
        console.log('Keys containing "cart":', cartKeys);
        
        if (cartKeys.length > 0) {
          cartData = localStorage.getItem(cartKeys[0]);
          console.log(`Found cart data in key "${cartKeys[0]}":`, cartData);
        }
      }
      
      if (cartData) {
        const cart = JSON.parse(cartData);
        console.log('Parsed cart data:', cart);
        
        // Handle different cart data structures
        let cartItems = [];
        
        if (Array.isArray(cart)) {
          cartItems = cart;
        } else if (cart.items && Array.isArray(cart.items)) {
          cartItems = cart.items;
        } else {
          console.log('Unexpected cart structure:', cart);
          setCartItems([]);
          return;
        }
        
        console.log('Cart items to process:', cartItems);
        
        // Fetch full product details for each cart item
        const cartWithDetails = await Promise.all(
          cartItems.map(async (item) => {
            try {
              console.log('Processing cart item:', item);
              
              // Handle different item structures
              let productId = item.productId || item.product?.ProductID || item.ProductID || item.id;
              let quantity = item.quantity || 1;
              let existingProduct = item.product || item;
              
              // Validate cart item
              if (!productId) {
                console.error('Cart item missing product ID:', item);
                return null;
              }
              
              if (!quantity || quantity <= 0) {
                console.error('Cart item has invalid quantity:', item);
                return null;
              }
              
              // Convert cart item format to expected format
              if (existingProduct && existingProduct.name && !existingProduct.ProductName) {
                existingProduct = {
                  ProductID: existingProduct.id,
                  ProductName: existingProduct.name,
                  ProductPrice: parseFloat(existingProduct.price),
                  ProductImages: existingProduct.image ? `["${existingProduct.image}"]` : null,
                  ProductDesc: existingProduct.specs ? Object.entries(existingProduct.specs).map(([key, value]) => `${key}: ${value}`).join(', ') : existingProduct.category || 'Premium Quality Product'
                };
              }
              
              console.log('Product ID:', productId, 'Quantity:', quantity);
              
              if (productId) {
                console.log(`Fetching product from API: /api/products/${productId}`);
                const response = await fetch(`https://api.certifurb.com/api/products/${productId}`);
                console.log('API response status:', response.status);
                const data = await response.json();
                console.log('API response data:', data);
                
                if (data.success) {
                  console.log('API success, using API data:', data.data);
                  
                  // Merge API data with original cart image if API doesn't have image
                  const mergedProduct = { ...data.data };
                  if (!mergedProduct.ProductImages && !mergedProduct.images && !mergedProduct.image) {
                    // Use original cart item image
                    if (item.image) {
                      mergedProduct.ProductImages = JSON.stringify([item.image]);
                    } else if (item.product?.image) {
                      mergedProduct.ProductImages = JSON.stringify([item.product.image]);
                    }
                    console.log('Added original cart image to API data:', mergedProduct.ProductImages);
                  }
                  
                  return {
                    product: mergedProduct,
                    quantity: quantity
                  };
                } else {
                  console.log('API failed, using stored product data:', existingProduct);
                  return {
                    product: existingProduct,
                    quantity: quantity
                  };
                }
              } else {
                console.log('No product ID found, using stored product data:', existingProduct);
                return {
                  product: existingProduct,
                  quantity: quantity
                };
              }
            } catch (error) {
              console.error('Error fetching product details:', error);
              return {
                product: item.product || item,
                quantity: item.quantity || 1
              };
            }
          })
        );
        
        const validCartItems = cartWithDetails.filter(item => {
          if (!item) {
            console.log('Filtering out null item');
            return false;
          }
          
          const hasProduct = item.product && (item.product.ProductName || item.product.name);
          const hasProductId = item.product && item.product.ProductID;
          const hasValidQuantity = item.quantity && item.quantity > 0;
          
          console.log('Filtering item:', item, 'Has valid product:', hasProduct, 'Has ProductID:', hasProductId, 'Has valid quantity:', hasValidQuantity);
          
          return hasProduct && hasProductId && hasValidQuantity;
        });
        console.log('Valid cart items:', validCartItems);
        setCartItems(validCartItems);
      } else {
        console.log('No cart data found in localStorage');
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error loading cart data:', error);
      setCartItems([]);
    } finally {
      console.log('Setting isLoadingCart to false');
      setIsLoadingCart(false);
    }
  };

  useEffect(() => {
    // Load saved card info and shipment address when user is available
    if (user) {
      loadSavedCardInfo();
      loadShipmentAddress();
    }
  }, [user]);

  const loadSavedCardInfo = async () => {
    try {
      console.log('Loading saved card info for user:', user?.useremail);
      const response = await fetch(`https://api.certifurb.com/api/get-card?userEmail=${user?.useremail}`);
      const data = await response.json();
      console.log('Received card data:', data);
      
      if (data.success && data.data) {
        setCardForm({
          cardNumber: data.data.cardNumber || '',
          nameOnCard: data.data.nameOnCard || '',
          expiry: data.data.expiry || '',
          cvv: data.data.cvv || ''
        });
        console.log('Card form populated with saved data');
      }
    } catch (error) {
      console.error('Error loading card info:', error);
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBillingFormInputChange = (e) => {
    const { name, value } = e.target;
    setBillingFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Load user's shipment address
  const loadShipmentAddress = async () => {
    if (!user?.useremail) return;
    
    setIsLoadingShipmentAddress(true);
    try {
      const response = await fetch(
        `https://api.certifurb.com/api/shipment-address/${user.useremail}`
      );
      const data = await response.json();

      if (data.success && data.data) {
        setShipmentAddress(data.data);
        // Auto-fill delivery address with shipment address
        setFormData(prev => ({
          ...prev,
          address: data.data
        }));
      }
    } catch (error) {
      console.error("Error loading shipment address:", error);
    } finally {
      setIsLoadingShipmentAddress(false);
    }
  };

  const handleSaveCard = async () => {
    if (!user) {
      setMessage({ type: 'error', text: 'Please login to save card information.' });
      return false;
    }

    if (!cardForm.cardNumber || !cardForm.nameOnCard || !cardForm.expiry || !cardForm.cvv) {
      setMessage({ type: 'error', text: 'Please fill in all card fields.' });
      return false;
    }

    try {
      console.log('Saving card data:', {
        userEmail: user?.useremail,
        cardNumber: cardForm.cardNumber,
        nameOnCard: cardForm.nameOnCard,
        expiry: cardForm.expiry,
        cvv: cardForm.cvv
      });

      const response = await fetch('https://api.certifurb.com/api/save-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user?.useremail,
          cardNumber: cardForm.cardNumber,
          nameOnCard: cardForm.nameOnCard,
          expiry: cardForm.expiry,
          cvv: cardForm.cvv
        }),
      });

      const data = await response.json();
      console.log('Save card response:', data);

      if (data.success) {
        setMessage({ type: 'success', text: 'Card information saved successfully!' });
        return true;
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to save card information.' });
        return false;
      }
    } catch (error) {
      console.error('Error saving card:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
      return false;
    }
  };

  const saveOrderToDatabase = async () => {
    try {
      if (!user?.useremail) {
        throw new Error('User not logged in');
      }

      if (cartItems.length === 0) {
        throw new Error('No items in cart');
      }

      // Determine billing address based on selection
      const billingInfo = billingAddress === 'same' ? {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode
      } : {
        firstName: billingFormData.firstName,
        lastName: billingFormData.lastName,
        address: billingFormData.address,
        city: billingFormData.city,
        postalCode: billingFormData.postalCode
      };

      const orders = cartItems.map(item => {
        // Validate required fields
        if (!item.product.ProductID) {
          throw new Error(`Product ID missing for item: ${item.product.ProductName || 'Unknown product'}`);
        }
        
        if (!item.quantity || item.quantity <= 0) {
          throw new Error(`Invalid quantity for item: ${item.product.ProductName || 'Unknown product'}`);
        }
        
        const totalPrice = getItemTotal(item.product, item.quantity);
        if (!totalPrice || totalPrice <= 0) {
          throw new Error(`Invalid price for item: ${item.product.ProductName || 'Unknown product'}`);
        }

        return {
          userEmail: user.useremail,
          productId: item.product.ProductID,
          quantity: item.quantity,
          totalPrice: totalPrice,
          paymentMethod: selectedPayment,
          customerInfo: {
            email: formData.email || user.useremail,
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            phone: formData.phone
          },
          billingInfo: billingInfo
        };
      });

      console.log('Sending order data:', { orders });

      const response = await fetch('https://api.certifurb.com/api/save-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orders }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.success) {
        // Clear cart after successful order
        localStorage.removeItem('cart');
        return true;
      } else {
        throw new Error(result.message || 'Failed to save order');
      }
    } catch (error) {
      console.error('Error saving order:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        user: user?.useremail,
        cartItemsCount: cartItems.length
      });
      throw error;
    }
  };

  const handlePayNow = async () => {
    // Validate delivery form data
    if (!formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.phone) {
      setMessage({ type: 'error', text: 'Please fill in all required delivery information.' });
      return;
    }

    // Validate billing address if different billing address is selected
    if (billingAddress === 'different') {
      if (!billingFormData.firstName || !billingFormData.lastName || !billingFormData.address || !billingFormData.city) {
        setMessage({ type: 'error', text: 'Please fill in all required billing address information.' });
        return;
      }
    }

    if (!user) {
      setMessage({ type: 'error', text: 'Please login to place an order.' });
      return;
    }

    if (cartItems.length === 0) {
      setMessage({ type: 'error', text: 'Your cart is empty.' });
      return;
    }

    setIsProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      if (selectedPayment === 'card') {
        const cardSaved = await handleSaveCard();
        
        if (!cardSaved) {
          setIsProcessing(false);
          return;
        }
      }

      // Save order to database
      await saveOrderToDatabase();
      
      setMessage({ type: 'success', text: 'Order placed successfully! Redirecting to home page...' });
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (error) {
      console.error('Error processing payment:', error);
      setMessage({ type: 'error', text: error.message || 'Error processing order. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper functions
  const getProductImage = (product) => {
    console.log('getProductImage called with product:', product);
    
    if (!product) {
      console.log('No product, returning default laptop.png');
      return '/laptop.png';
    }
    
    // Handle different image property names
    const imageData = product.ProductImages || product.images || product.image;
    console.log('Image data found:', imageData, 'Type:', typeof imageData);
    
    if (imageData) {
      try {
        if (typeof imageData === 'string') {
          // Try to parse as JSON first
          try {
            const images = JSON.parse(imageData);
            console.log('Parsed images from JSON:', images);
            const finalImage = images[0] || '/laptop.png';
            console.log('Final image from JSON array:', finalImage);
            return finalImage;
          } catch (parseError) {
            // If JSON parse fails, check if it's a direct URL
            if (imageData.startsWith('http')) {
              console.log('Using direct URL:', imageData);
              return imageData;
            }
            console.log('Parse failed and not a URL, using default');
            return '/laptop.png';
          }
        } else if (Array.isArray(imageData)) {
          console.log('Image data is array:', imageData);
          const finalImage = imageData[0] || '/laptop.png';
          console.log('Final image from array:', finalImage);
          return finalImage;
        }
      } catch (e) {
        console.error('Error processing image data:', e);
        return '/laptop.png';
      }
    }
    
    console.log('No image data found, returning default');
    return '/laptop.png';
  };

  const getItemTotal = (product, quantity) => {
    if (!product) return 0;
    const price = product.ProductPrice || product.price || 0;
    return price * quantity;
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + getItemTotal(item.product, item.quantity);
    }, 0);
  };

  const getTotal = () => {
    return getSubtotal(); // Add shipping, taxes, discounts here if needed
  };

  const formatPrice = (price) => {
    return convertPriceString(`PKR ${price}`);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className={`${font.className} bg-[#fafbfc] min-h-screen`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Back Arrow */}
            <Link href="/view-cart">
              <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200">
                <FaArrowLeft className="text-gray-600 text-sm" />
              </button>
            </Link>
            
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center">
                <img src="/certifurb.png" alt="Certifurb" className="h-8" />
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {isLoadingCart ? (
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <div className="w-12 h-12 bg-gray-200 animate-pulse rounded"></div>
                <div className="text-sm">
                  <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-48"></div>
                  <div className="h-3 bg-gray-200 animate-pulse rounded mb-2 w-32"></div>
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-20"></div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-24"></div>
                </div>
              </div>
            ) : cartItems.length > 0 ? (
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <div className="flex -space-x-2">
                  {cartItems.slice(0, 3).map((item, index) => (
                    <img 
                      key={index}
                      src={getProductImage(item.product)} 
                      alt={item.product.ProductName} 
                      className="w-12 h-12 object-contain rounded-full border-2 border-white" 
                    />
                  ))}
                  {cartItems.length > 3 && (
                    <div className="w-12 h-12 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium">
                      +{cartItems.length - 3}
                    </div>
                  )}
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">
                    {cartItems.length === 1 
                      ? (cartItems[0].product.ProductName || cartItems[0].product.name || 'Product')
                      : `${cartItems.length} Items`}
                  </div>
                  <div className="text-gray-500">
                    {cartItems.length === 1 
                      ? (cartItems[0].product.ProductDesc || cartItems[0].product.description || 'Premium Quality Product')
                      : `${getTotalItems()} total items`}
                  </div>
                  <div className="text-gray-500">Your Cart</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{convertPriceString(`PKR ${getSubtotal()}`)}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Your cart is empty</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl bg-white  mx-auto px-4 py-8">

        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Forms */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Contact Section */}
            <div className="bg-white rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Contact</h2>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleFormInputChange}
                className="w-full p-2.5 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Delivery Section */}
            <div className="bg-white rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Delivery</h2>
              
              {/* Country Dropdown */}
              <div className="mb-3">
                <select 
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full p-2.5 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Pakistan">Pakistan</option>
                  <option value="India">India</option>
                  <option value="UAE">UAE</option>
                </select>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleFormInputChange}
                  className="p-2.5 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleFormInputChange}
                  className="p-2.5 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Address */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address
                </label>
                {isLoadingShipmentAddress ? (
                  <div className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg text-gray-500">
                    Loading shipment address...
                  </div>
                ) : shipmentAddress ? (
                  <div className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg">
                    <textarea
                      name="address"
                      placeholder="Enter your delivery address"
                      value={formData.address}
                      onChange={handleFormInputChange}
                      className="w-full bg-transparent border-none outline-none resize-none"
                      rows={3}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter your delivery address"
                    value={formData.address}
                    onChange={handleFormInputChange}
                    className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                )}
              </div>

              {/* City and Postal Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleFormInputChange}
                  className="p-2.5 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code (optional)"
                  value={formData.postalCode}
                  onChange={handleFormInputChange}
                  className="p-2.5 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Phone */}
              <div className="mb-3">
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number for order & delivery updates"
                    value={formData.phone}
                    onChange={handleFormInputChange}
                    className="w-full p-2.5 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <FaInfoCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              
            </div>

            {/* Shipping Section */}
            <div className="bg-white rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Shipping</h2>
              
              <div className="border border-gray-300 bg-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center  gap-3">
                    <input
                      type="radio"
                      id="standard"
                      name="shipping"
                      value="standard"
                      checked={selectedShipping === 'standard'}
                      onChange={(e) => setSelectedShipping(e.target.value)}
                      className="text-green-500  bg-gray-100"
                    />
                    <label htmlFor="standard" className="font-medium">Standard</label>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">FREE</div>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-600">
                Get it by: May 29 - Jun 1
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Payment</h2>
              
              <div className="space-y-3">
                <div className="border border-gray-300 bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex bg-gray-100 items-center gap-3">
                      <input
                        type="radio"
                        id="card"
                        name="payment"
                        value="card"
                        checked={selectedPayment === 'card'}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="text-green-500"
                      />
                      <label htmlFor="card" className="font-medium">Credit / Debit Card</label>
                    </div>
                    <div className="flex gap-2">
                      <FaCcVisa className="text-2xl text-blue-600" />
                      <FaCcMastercard className="text-2xl text-red-500" />
                    </div>
                  </div>
                  
                  {selectedPayment === 'card' && (
                    <div className="space-y-3">
                      {/* Card Number and Name on Card */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="Card Number"
                          value={cardForm.cardNumber}
                          onChange={handleCardInputChange}
                          className="p-2.5 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                          type="text"
                          name="nameOnCard"
                          placeholder="Name on Card"
                          value={cardForm.nameOnCard}
                          onChange={handleCardInputChange}
                          className="p-2.5 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      {/* Expiry and CVV */}
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          name="expiry"
                          placeholder="Expiry (MM/YY)"
                          value={cardForm.expiry}
                          onChange={handleCardInputChange}
                          className="p-2.5 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                          type="text"
                          name="cvv"
                          placeholder="CVV"
                          value={cardForm.cvv}
                          onChange={handleCardInputChange}
                          className="p-2.5 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="border bg-gray-100 border-gray-300 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="cod"
                      name="payment"
                      value="cod"
                      checked={selectedPayment === 'cod'}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="text-green-500"
                    />
                    <label htmlFor="cod" className="font-medium">Cash On Delivery</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Address Section */}
            <div className="bg-white rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Billing Address</h2>
              
              <div className="space-y-3">
                <div className="border bg-gray-100 border-gray-300 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="same-address"
                      name="billing"
                      value="same"
                      checked={billingAddress === 'same'}
                      onChange={(e) => setBillingAddress(e.target.value)}
                      className="text-green-500"
                    />
                    <label htmlFor="same-address" className="font-medium">Same as shipping address</label>
                  </div>
                </div>

                <div className="border bg-gray-100 border-gray-300 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="different-address"
                      name="billing"
                      value="different"
                      checked={billingAddress === 'different'}
                      onChange={(e) => setBillingAddress(e.target.value)}
                      className="text-green-500"
                    />
                    <label htmlFor="different-address" className="font-medium">Use a different billing address</label>
                  </div>
                </div>
              </div>

              {/* Billing Address Form - Only show when "different" is selected */}
              {billingAddress === 'different' && (
                <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Enter Billing Address</h3>
                  
                  {/* Billing Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={billingFormData.firstName}
                      onChange={handleBillingFormInputChange}
                      className="p-2.5 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={billingFormData.lastName}
                      onChange={handleBillingFormInputChange}
                      className="p-2.5 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {/* Billing Address */}
                  <div className="mb-3">
                    <textarea
                      name="address"
                      placeholder="Enter your billing address"
                      value={billingFormData.address}
                      onChange={handleBillingFormInputChange}
                      className="w-full p-2.5 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Billing City and Postal Code */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={billingFormData.city}
                      onChange={handleBillingFormInputChange}
                      className="p-2.5 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code (optional)"
                      value={billingFormData.postalCode}
                      onChange={handleBillingFormInputChange}
                      className="p-2.5 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Message Display */}
            {message.text && (
              <div className={`p-3 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}>
                {message.text}
              </div>
            )}

            {/* Pay Now Button */}
            <button 
              onClick={handlePayNow}
              disabled={isProcessing}
              className={`w-full font-bold py-3 rounded-lg text-lg transition duration-200 ${
                isProcessing
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-b from-[#6adb4d] via-[#54b056] to-[#468e5d] text-white hover:from-[#468e5d] via-[#54b056] hover:to-[#6adb4d]'
              }`}
            >
              {isProcessing 
                ? (selectedPayment === 'card' ? 'PROCESSING...' : 'PLACING YOUR ORDER...') 
                : (selectedPayment === 'card' ? 'PAY NOW' : 'ORDER NOW')
              }
            </button>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              
              {/* Cart Items */}
              {isLoadingCart ? (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-lg border border-gray-200"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-48"></div>
                      <div className="h-3 bg-gray-200 animate-pulse rounded mb-2 w-32"></div>
                      <div className="h-3 bg-gray-200 animate-pulse rounded w-24"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ) : cartItems.length > 0 ? (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="relative">
                          <img 
                            src={getProductImage(item.product)} 
                            alt={item.product.ProductName} 
                            className="w-16 h-16 object-contain rounded-lg border border-gray-200" 
                          />
                          <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm mb-1">
                            {item.product.ProductName || item.product.name || 'Product'}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {item.product.ProductDesc || item.product.description || 'Premium Quality Product'}
                          </p>
                          <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{convertPriceString(`PKR ${getItemTotal(item.product, item.quantity)}`)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="text-gray-500 text-sm text-center py-8">Your cart is empty</div>
                </div>
              )}

              {/* Discount Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Discount code or gift card"
                    className="flex-1 p-3 border bg-gray-100 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
                    Apply
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{convertPriceString(`PKR ${getSubtotal()}`)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{convertPriceString(`PKR ${getTotal()}`)}</span>
                </div>
              </div>

              {/* Savings */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                <div className="flex items-center gap-2 text-green-700 text-sm">
                  <span className="font-medium">TOTAL SAVINGS {convertPriceString(`PKR 500`)}</span>
                </div>
              </div>

              {/* Security & Payment Icons */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FaShieldAlt className="text-green-600" />
                    <span className="text-sm font-medium text-green-700">100% Secure Payment</span>
                  </div>
                  <div className="flex gap-2">
                    <FaCcVisa className="text-2xl text-blue-600" />
                    <FaCcMastercard className="text-2xl text-red-500" />
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center p-2">
                    <FaTruck className="text-gray-600 mb-1" />
                    <span className="text-xs text-gray-600">Free Delivery</span>
                  </div>
                  <div className="flex flex-col items-center p-2">
                    <FaUndo className="text-gray-600 mb-1" />
                    <span className="text-xs text-gray-600">10 Days to Return</span>
                  </div>
                  <div className="flex flex-col items-center p-2">
                    <FaShieldAlt className="text-gray-600 mb-1" />
                    <span className="text-xs text-gray-600">12 Months Warranty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;