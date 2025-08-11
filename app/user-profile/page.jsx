"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../Components/Layout/Navbar";
import Footer from "../Components/Layout/Footer";
import { font } from "../Components/Font/font";
import { FaCcVisa, FaCcMastercard, FaShieldAlt, FaHeart } from "react-icons/fa";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";

const page = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const { convertPriceString, selectedCountry } = useCurrency();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("Account Overview");
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    nameOnCard: "",
    expiry: "",
    cvv: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [uploadedImages, setUploadedImages] = useState([]);
  
  // Review form states
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState({ type: "", text: "" });
  const [existingReview, setExistingReview] = useState(null);
  const [activeReviewTab, setActiveReviewTab] = useState("toReview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Dynamic data states
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // Bidding states
  const [userBids, setUserBids] = useState([]);
  const [isLoadingBids, setIsLoadingBids] = useState(false);
  const [bidFilters, setBidFilters] = useState({
    show: "Not Hidden",
    status: "All",
    sort: "Time left: ending soonest",
  });

  // Refund dialog state
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [selectedOrderForRefund, setSelectedOrderForRefund] = useState(null);
  const [refundReason, setRefundReason] = useState('');
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);

  // Shipment address states
  const [shipmentAddress, setShipmentAddress] = useState("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressMessage, setAddressMessage] = useState({ type: "", text: "" });

  // Add state for recent order
  const [recentOrder, setRecentOrder] = useState(null);
  const [isLoadingRecentOrder, setIsLoadingRecentOrder] = useState(false);

  // Add state for user orders
  const [userOrders, setUserOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [userReturns, setUserReturns] = useState([]);
  const [isLoadingReturns, setIsLoadingReturns] = useState(false);

  // Add flags to track if data has been loaded
  const [reviewsDataLoaded, setReviewsDataLoaded] = useState(false);

  // Function to clear review data
  const clearReviewData = () => {
    setPurchasedProducts([]);
    setUserReviews([]);
    setReviewsDataLoaded(false);
  };

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Reset data loaded flags when user changes
  useEffect(() => {
    clearReviewData();
  }, [user?.useremail]);

  // Re-render when currency changes
  useEffect(() => {
    console.log('User Profile: Currency changed to:', selectedCountry);
  }, [selectedCountry]);

  useEffect(() => {
    // Load saved card info when Payment Options is selected
    if (activeSection === "Payment Options") {
      loadSavedCardInfo();
    }
    // Clear review data when switching away from My Reviews
    if (activeSection !== "My Reviews" && reviewsDataLoaded) {
      clearReviewData();
    }

    // Load purchased products and reviews when My Reviews is selected
    if (
      activeSection === "My Reviews" &&
      user?.useremail &&
      !reviewsDataLoaded
    ) {
      loadPurchasedProducts();
      loadUserReviews();
      setReviewsDataLoaded(true);
    }
    // Load user orders when My Orders is selected
    if (activeSection === "My Orders" && user?.useremail) {
      loadUserOrders();
    }
    // Load user bids when My Bids is selected
    if (activeSection === "My Bids" && user?.useremail) {
      loadUserBids();
    }
    // Load shipment address when Shipping Address is selected
    if (activeSection === "Shipping Address" && user?.useremail) {
      loadShipmentAddress();
    }
    // Load shipment address and fetch recent order for Account Overview
    if (activeSection === "Account Overview" && user?.useremail) {
      loadShipmentAddress();
      loadUserOrders(); // Load user orders for Recent Orders section
      setIsLoadingRecentOrder(true);
      fetch(`https://api.certifurb.com/api/cms/orders/user/${user.useremail}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Orders API response:", data);
          if (
            data.success &&
            data.data &&
            Array.isArray(data.data) &&
            data.data.length > 0
          ) {
            // Filter out any invalid orders (those without proper order data)
            const validOrders = data.data.filter(
              (order) => order && order.id && order.date
            );

            if (validOrders.length > 0) {
              // Sort by date if available, else just take the first
              const sorted = validOrders.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
              );
              setRecentOrder(sorted[0]);
            } else {
              setRecentOrder(null);
            }
          } else {
            setRecentOrder(null);
          }
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
          setRecentOrder(null);
        })
        .finally(() => setIsLoadingRecentOrder(false));
    }
    if (activeSection === "My Returns" && user?.useremail) {
      loadUserReturns();
    }
  }, [activeSection, user]);

  const loadSavedCardInfo = async () => {
    try {
      console.log("Current user object:", user);
      console.log("User email being sent:", user?.useremail);
      const response = await fetch(
        `https://api.certifurb.com/api/get-card?userEmail=${user?.useremail}`
      );
      const data = await response.json();
      console.log("Received card data:", data);
      
      if (data.success && data.data) {
        setCardForm({
          cardNumber: data.data.cardNumber || "",
          nameOnCard: data.data.nameOnCard || "",
          expiry: data.data.expiry || "",
          cvv: data.data.cvv || "",
        });
      }
    } catch (error) {
      console.error("Error loading card info:", error);
    }
  };

  // Load user's purchased products
  const loadPurchasedProducts = async () => {
    setIsLoadingProducts(true);
    setPurchasedProducts([]); // Clear immediately when starting to load

    try {
      const response = await fetch(
        `https://api.certifurb.com/api/user-orders/${user?.useremail}`
      );
      const data = await response.json();

      console.log("Purchased products API response:", data);
      
      if (data.success) {
        setPurchasedProducts(data.data);

        // Debug: Check review status for each product
        data.data.forEach((product) => {
          console.log(
            `Product ${product.ProductName}: HasReview = ${product.HasReview}`
          );
        });
      } else {
        console.error("Error loading purchased products:", data.message);
        setPurchasedProducts([]);
      }
    } catch (error) {
      console.error("Error loading purchased products:", error);
      setPurchasedProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Load user's existing reviews
  const loadUserReviews = async () => {
    setIsLoadingReviews(true);
    setUserReviews([]); // Clear immediately when starting to load

    try {
      const response = await fetch(
        `https://api.certifurb.com/api/user-product-reviews/${user?.useremail}`
      );
      const data = await response.json();

      console.log("User reviews API response:", data);
      
      if (data.success) {
        setUserReviews(data.data);

        // Debug: Check reviews data
        data.data.forEach((review) => {
          console.log(
            `Review for Product ${
              review.ProductID
            }: ${review.ReviewText.substring(0, 50)}...`
          );
        });
      } else {
        console.error("Error loading user reviews:", data.message);
        setUserReviews([]);
      }
    } catch (error) {
      console.error("Error loading user reviews:", error);
      setUserReviews([]);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const getReturnStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "PROCESSED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getShipmentStatusColor = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Out for Delivery':
        return 'bg-orange-100 text-orange-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Load user's orders
  const loadUserOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const response = await fetch(
        `https://api.certifurb.com/api/user-orders-shipments/${user?.useremail}`
      );
      const data = await response.json();

      if (data.success) {
        setUserOrders(data.data);
      } else {
        console.error("Error loading user orders:", data.message);
        setUserOrders([]);
      }
    } catch (error) {
      console.error("Error loading user orders:", error);
      setUserOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // Load user's bidding data
  const loadUserBids = async () => {
    setIsLoadingBids(true);
    try {
      // Get user's username from localStorage
      const userData = localStorage.getItem("user");
      if (!userData) {
        setUserBids([]);
        return;
      }

      const user = JSON.parse(userData);
      const username = user?.username;

      if (!username) {
        console.error("No username found for user");
        setUserBids([]);
        return;
      }

      // Fetch user bids from API
      const response = await fetch(
        `https://api.certifurb.com/api/user-bids/${encodeURIComponent(
          username
        )}`
      );
      const data = await response.json();

      if (data.success) {
        setUserBids(data.data);
      } else {
        console.error("Error loading user bids:", data.message);
        setUserBids([]);
      }
    } catch (error) {
      console.error("Error loading user bids:", error);
      setUserBids([]);
    } finally {
      setIsLoadingBids(false);
    }
  };

  // Load user's shipment address
  const loadShipmentAddress = async () => {
    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://api.certifurb.com/api/shipment-address/${user?.useremail}`
      );
      const data = await response.json();

      if (data.success) {
        setShipmentAddress(data.data || "");
      } else {
        console.error("Error loading shipment address:", data.message);
        setShipmentAddress("");
      }
    } catch (error) {
      console.error("Error loading shipment address:", error);
      setShipmentAddress("");
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Update shipment address
  const handleUpdateAddress = async (e) => {
    e.preventDefault();

    if (!shipmentAddress.trim()) {
      setAddressMessage({
        type: "error",
        text: "Please enter a shipment address.",
      });
      return;
    }

    try {
      const response = await fetch(
        `https://api.certifurb.com/api/shipment-address/${user?.useremail}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ shipmentaddress: shipmentAddress }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setAddressMessage({
          type: "success",
          text: "Shipment address updated successfully!",
        });
        setShowAddressForm(false);
      } else {
        setAddressMessage({
          type: "error",
          text: data.message || "Failed to update address.",
        });
      }
    } catch (error) {
      console.error("Error updating address:", error);
      setAddressMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    }
  };

  // Cancel edit
  const handleCancelAddress = () => {
    setShowAddressForm(false);
    setAddressMessage({ type: "", text: "" });
  };

  // Test shipment address API
  const testShipmentAddressAPI = async () => {
    try {
      console.log("Testing database structure...");

      // Use existing users endpoint to check database structure
      const response = await fetch("https://api.certifurb.com/api/users");
      console.log("Users API Status:", response.status);

      if (!response.ok) {
        setAddressMessage({
          type: "error",
          text: `API server not reachable. Status: ${response.status}`,
        });
        return;
      }

      const data = await response.json();
      console.log("Users API Response:", data);

      if (data.success && data.data.length > 0) {
        // Check the first user's structure
        const firstUser = data.data[0];
        const columns = Object.keys(firstUser);

        // Find current user
        const currentUser = data.data.find(
          (u) => u.useremail === user?.useremail
        );

        let result = {
          userExists: !!currentUser,
          columns: columns,
          hasShipmentAddress: columns.includes("shipmentaddress"),
          currentUserShipmentAddress:
            currentUser?.shipmentaddress || "Not found",
        };

        console.log("Database structure analysis:", result);

        setAddressMessage({
          type: "success",
          text: `Analysis complete! User exists: ${result.userExists}, Has shipmentaddress column: ${result.hasShipmentAddress}, Current address: ${result.currentUserShipmentAddress}`,
        });
      } else {
        setAddressMessage({
          type: "error",
          text: `No users found in database`,
        });
      }
    } catch (error) {
      console.error("Test API Error:", error);
      setAddressMessage({
        type: "error",
        text: `Test error: ${error.message}`,
      });
    }
  };

  // Setup shipment address column
  const setupShipmentAddressColumn = async () => {
    try {
      console.log("Setting up shipment address column...");

      const response = await fetch(
        "https://api.certifurb.com/api/setup-shipment-address",
        {
          method: "POST",
        }
      );

      console.log("Setup API Status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        setAddressMessage({
          type: "error",
          text: `Setup failed: ${errorText}`,
        });
        return;
      }

      const data = await response.json();
      console.log("Setup API Response:", data);

      if (data.success) {
        setAddressMessage({
          type: "success",
          text: `Setup successful: ${data.message}`,
        });
        // Refresh the test after setup
        setTimeout(() => {
          testShipmentAddressAPI();
        }, 1000);
      } else {
        setAddressMessage({
          type: "error",
          text: `Setup failed: ${data.error}`,
        });
      }
    } catch (error) {
      console.error("Setup API Error:", error);
      setAddressMessage({
        type: "error",
        text: `Setup error: ${error.message}`,
      });
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveCard = async (e) => {
    e.preventDefault();

    if (
      !cardForm.cardNumber ||
      !cardForm.nameOnCard ||
      !cardForm.expiry ||
      !cardForm.cvv
    ) {
      setMessage({ type: "error", text: "Please fill in all card fields." });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      console.log("Sending card data:", {
        userEmail: user?.useremail,
        cardNumber: cardForm.cardNumber,
        nameOnCard: cardForm.nameOnCard,
        expiry: cardForm.expiry,
        cvv: cardForm.cvv,
      });

      const response = await fetch("https://api.certifurb.com/api/save-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: user?.useremail,
          cardNumber: cardForm.cardNumber,
          nameOnCard: cardForm.nameOnCard,
          expiry: cardForm.expiry,
          cvv: cardForm.cvv,
        }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        setMessage({
          type: "success",
          text: "Card information saved successfully!",
        });
        // Don't clear the form - keep the card info visible
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to save card information.",
        });
      }
    } catch (error) {
      console.error("Error saving card:", error);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map((file) => ({
        file: file,
        url: URL.createObjectURL(file),
        name: file.name,
        cloudinaryUrl: null, // Will be populated after upload
      }));
      setUploadedImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => {
      const newImages = [...prev];
      // Clean up object URL to prevent memory leaks
      URL.revokeObjectURL(newImages[index].url);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const triggerFileInput = () => {
    document.getElementById("imageUpload").click();
  };

  // Upload images to Cloudinary
  const uploadImagesToCloudinary = async () => {
    if (!uploadedImages.length) return [];

    setIsUploadingImages(true);
    const cloudinaryUrls = [];

    try {
      for (const image of uploadedImages) {
        if (image.cloudinaryUrl) {
          // Already uploaded
          cloudinaryUrls.push(image.cloudinaryUrl);
          continue;
        }

        const formData = new FormData();
        formData.append("image", image.file);
        formData.append("userId", user?.userId || "");
        formData.append("userEmail", user?.useremail || "");
        formData.append("productId", "review_image"); // You can change this to actual product ID
        formData.append(
          "context",
          JSON.stringify({
            uploadType: "user_review",
            userName: user?.username || "Anonymous",
          })
        );

        const response = await fetch(
          "https://api.certifurb.com/api/upload-image",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();

        if (result.success) {
          cloudinaryUrls.push(result.data.url);
          // Update the image object with Cloudinary URL
          image.cloudinaryUrl = result.data.url;
        } else {
          throw new Error(result.message || "Failed to upload image");
        }
      }

      setIsUploadingImages(false);
      return cloudinaryUrls;
    } catch (error) {
      setIsUploadingImages(false);
      console.error("Error uploading images:", error);
      setReviewMessage({ 
        type: "error",
        text: "Failed to upload images. Please try again.",
      });
      return [];
    }
  };

  // Save review to database
  const saveReviewToDatabase = async (imageUrls) => {
    try {
      if (!selectedProduct) {
        throw new Error("No product selected for review");
      }

      const response = await fetch(
        "https://api.certifurb.com/api/save-product-review",
        {
          method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: user?.useremail,
          productId: selectedProduct.ProductID,
          reviewText: reviewText,
          rating: rating,
            imageUrls: imageUrls, // Array of Cloudinary URLs
        }),
        }
      );

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error saving review to database:", error);
      throw error;
    }
  };

  // Handle complete review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewText.trim()) {
      setReviewMessage({ 
        type: "error",
        text: "Please write a review before submitting.",
      });
      return;
    }

    if (!user?.useremail) {
      setReviewMessage({ 
        type: "error",
        text: "Please log in to submit a review.",
      });
      return;
    }

    setIsSubmittingReview(true);
    setReviewMessage({ type: "", text: "" });

    try {
      // Step 1: Upload images to Cloudinary
      const cloudinaryUrls = await uploadImagesToCloudinary();

      // Step 2: Save review to database
      const result = await saveReviewToDatabase(cloudinaryUrls);

      if (result.success) {
        const isUpdate = userReviews.some(
          (review) => review.ProductID === selectedProduct.ProductID
        );
        
        setReviewMessage({ 
          type: "success",
          text: isUpdate
            ? "Review updated successfully!"
            : "Review submitted successfully!",
        });
        
        // Refresh the data
        clearReviewData();
        setTimeout(() => {
          loadPurchasedProducts();
          loadUserReviews();
          setReviewsDataLoaded(true);
        }, 100);
        
        // Close modal after a delay
        setTimeout(() => {
          closeReviewModal();
        }, 2000);
      } else {
        setReviewMessage({ 
          type: "error",
          text: result.message || "Failed to save review. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setReviewMessage({ 
        type: "error",
        text: "An error occurred while submitting your review. Please try again.",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const openReviewModal = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      
      // Check if user already has a review for this product
      const existingReview = userReviews.find(
        (review) => review.ProductID === product.ProductID
      );
      if (existingReview) {
        setReviewText(existingReview.ReviewText);
        setRating(existingReview.Rating || 5);
        
        // Load existing images if any
        if (existingReview.ImageUrls) {
          try {
            const imageUrls = JSON.parse(existingReview.ImageUrls);
            const existingImages = imageUrls.map((url, index) => ({
              file: null,
              url: url,
              name: `Existing Image ${index + 1}`,
              cloudinaryUrl: url,
            }));
            setUploadedImages(existingImages);
          } catch (e) {
            console.error("Error parsing existing images:", e);
          }
        }
      } else {
        // Reset form for new review
        setReviewText("");
        setRating(5);
        setUploadedImages([]);
      }
    }

    setIsModalOpen(true);
    setReviewMessage({ type: "", text: "" });
  };

  const closeReviewModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setReviewText("");
    setRating(5);
    setUploadedImages([]);
  };

  const sidebarItems = [
    "Account Overview",
    "My Orders",
    "My Returns",
    "My Bids",
    "Payment Options",
    "Refund & Return",
    "My Reviews",
    "Favorites",
    "Shipping Address",
    "Help center",
  ];

  // Handle refund dialog
  const openRefundDialog = (order) => {
    setSelectedOrderForRefund(order);
    setRefundReason('');
    setShowRefundDialog(true);
  };

  const closeRefundDialog = () => {
    setShowRefundDialog(false);
    setSelectedOrderForRefund(null);
    setRefundReason('');
    setIsSubmittingRefund(false);
  };

  const handleRefundSubmit = async (e) => {
    e.preventDefault();
    
    if (!refundReason.trim()) {
      alert('Please provide a reason for the return');
      return;
    }

    setIsSubmittingRefund(true);
    
    try {
      const response = await fetch('https://api.certifurb.com/api/user-refunds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: selectedOrderForRefund.id,
          userEmail: user?.useremail,
          productId: selectedOrderForRefund.product.id,
          refundReason: refundReason.trim(),
          refundAmount: parseFloat(selectedOrderForRefund.total.replace('PKR ', ''))
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Return request submitted successfully for order ${selectedOrderForRefund.orderNumber}`);
        closeRefundDialog();
        // Refresh user orders to show updated refund status
        if (activeSection === "My Orders") {
          loadUserOrders();
        }
      } else {
        if (response.status === 409) {
          alert('A return request already exists for this order. Please check "My Returns" section.');
        } else {
          alert(data.message || 'Error submitting refund request. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error submitting refund request:', error);
      alert('Error submitting refund request. Please try again.');
    } finally {
      setIsSubmittingRefund(false);
    }
  };

  const loadUserReturns = async () => {
    setIsLoadingReturns(true);
    try {
      const response = await fetch(
        `https://api.certifurb.com/api/user-returns/${user?.useremail}`
      );
      const data = await response.json();
      if (data.success) {
        setUserReturns(data.data);
      } else {
        console.error("Error loading user returns:", data.message);
        setUserReturns([]);
      }
    } catch (error) {
      console.error("Error loading user returns:", error);
      setUserReturns([]);
    } finally {
      setIsLoadingReturns(false);
    }
  };

  const getReturnButtonInfo = (order) => {
    const orderDate = new Date(order.date);
    const now = new Date();
    const diffInDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
    const canReturn = diffInDays <= 7;
    
    // Check if refund already exists
    if (order.refund?.status) {
      return {
        text: "Returned",
        disabled: true,
        className: "bg-gray-100 text-gray-400 cursor-not-allowed",
        onClick: null
      };
    }
    
    // Check if return period has expired
    if (!canReturn) {
      return {
        text: "Return Expired",
        disabled: true,
        className: "bg-gray-100 text-gray-400 cursor-not-allowed",
        onClick: null
      };
    }
    
    // Can return
    return {
      text: "Return Item",
      disabled: false,
      className: "bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer",
      onClick: () => openRefundDialog(order)
    };
  };

  return (
    <div className={`${font.className} min-h-screen bg-white`}>
      <Navbar />
        
      <div className="max-w-6xl mx-auto px-2 py-6">
          {/* Hello Header */}
          <div className="mb-4 md:mb-6">
            <h1 className="text-lg md:text-xl font-bold text-gray-900">
            Hello, {user?.username || "Username"}
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            {/* Sidebar - Mobile: Horizontal scroll, Desktop: Vertical */}
            <div className="w-full lg:w-56">
              {/* Mobile Navigation - Horizontal Scroll */}
              <div className="lg:hidden mb-4">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {sidebarItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSection(item)}
                      className={`px-3 py-2 text-xs font-medium rounded-full whitespace-nowrap flex-shrink-0 ${
                        activeSection === item
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop Sidebar */}
              <div className="hidden lg:block bg-gray-100 py-5 rounded-lg shadow-sm">
                {sidebarItems.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveSection(item)}
                    className={`px-4 py-3 text-sm cursor-pointer relative ${
                      activeSection === item
                      ? "text-black font-medium bg-white"
                      : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {activeSection === item && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-lg"></div>
                    )}
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Content based on active section */}
            {activeSection === "My Reviews" ? (
                <div>
                  {/* Reviews Tabs */}
                  <div className="flex mb-4">
                    <button 
                    onClick={() => setActiveReviewTab("toReview")}
                      className={`flex-1 lg:flex-none lg:px-6 py-2 text-xs md:text-sm font-medium rounded-tl-lg ${
                      activeReviewTab === "toReview"
                        ? "custom-green-bg text-white"
                        : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      To Review
                    </button>
                    <button 
                    onClick={() => setActiveReviewTab("reviewsByYou")}
                      className={`flex-1 lg:flex-none lg:px-6 py-2 text-xs md:text-sm font-medium rounded-tr-lg ${
                      activeReviewTab === "reviewsByYou"
                        ? "custom-green-bg text-white"
                        : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      Reviews By You
                    </button>
                  </div>

                  {/* Tab Content */}
                {activeReviewTab === "toReview" ? (
                    // To Review Tab Content
                  <div
                    key="toReview"
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6"
                  >
                      {isLoadingProducts ? (
                        <div className="p-8 text-center">
                        <div className="text-gray-500">
                          Loading your purchased products...
                        </div>
                        </div>
                      ) : purchasedProducts.length === 0 ? (
                        <div className="p-8 text-center">
                        <div className="text-gray-500">
                          No products available for review
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          Purchase products to leave reviews
                        </div>
                        </div>
                      ) : (
                        <>
                          {/* Mobile Layout */}
                          <div className="lg:hidden">
                            <div className="bg-gray-100 px-4 py-3">
                            <h3 className="text-sm font-medium text-gray-700">
                              Products to Review
                            </h3>
                            </div>
                            <div className="space-y-4">
                              {purchasedProducts.map((product, index) => (
                              <div
                                key={`${product.ProductID}-${index}`}
                                className="p-4 space-y-3 border-b border-gray-100 last:border-b-0"
                              >
                                  <div className="flex justify-between">
                                  <span className="text-xs text-gray-500">
                                    PRODUCT
                                  </span>
                                  <span className="text-xs font-medium">
                                    {product.ProductName}
                                  </span>
                                  </div>
                                  <div className="flex justify-between">
                                  <span className="text-xs text-gray-500">
                                    PRICE
                                  </span>
                                  <span className="text-xs">
                                    {convertPriceString(`PKR ${product.ProductPrice}`)}
                                  </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-500">
                                    IMAGE
                                  </span>
                                    <div className="w-8 h-8 bg-gray-100 rounded border">
                                      {product.ProductImageURL ? (
                                        <img 
                                          src={product.ProductImageURL} 
                                          alt={product.ProductName}
                                          className="w-full h-full object-cover rounded"
                                        />
                                      ) : (
                                      <svg
                                        className="w-full h-full text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                        </svg>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex justify-between">
                                  <span className="text-xs text-gray-500">
                                    STATUS
                                  </span>
                                  <span
                                    className={`text-xs font-medium ${
                                      product.HasReview
                                        ? "text-green-600"
                                        : "text-orange-600"
                                    }`}
                                  >
                                    {product.HasReview
                                      ? "Reviewed"
                                      : "Pending Reviews"}
                                    </span>
                                  </div>
                                  <button 
                                    onClick={() => openReviewModal(product)}
                                    className="w-full mt-3 px-4 py-2 custom-green-bg text-white text-xs font-medium rounded-full"
                                  >
                                  {product.HasReview
                                    ? "Edit Review"
                                    : "Give Feedback"}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden lg:block">
                            {/* Table Header */}
                            <div className="grid grid-cols-6 gap-4 px-6 py-5 bg-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wide">
                              <div>PRODUCT NAME</div>
                              <div>PRICE</div>
                              <div>IMAGE</div>
                              <div>REVIEW STATUS</div>
                              <div>ACTION</div>
                              <div></div>
                            </div>
                            
                            {/* Product Rows */}
                            {purchasedProducts.map((product, index) => (
                            <div
                              key={`${product.ProductID}-${index}`}
                              className="grid grid-cols-6 gap-4 px-6 py-4 items-center border-b border-gray-100 last:border-b-0"
                            >
                              <div className="text-sm text-gray-900">
                                {product.ProductName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {convertPriceString(`PKR ${product.ProductPrice}`)}
                              </div>
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-gray-100 rounded border">
                                    {product.ProductImageURL ? (
                                      <img 
                                        src={product.ProductImageURL} 
                                        alt={product.ProductName}
                                        className="w-full h-full object-cover rounded"
                                      />
                                    ) : (
                                    <svg
                                      className="w-full h-full text-gray-400"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                              <div
                                className={`text-sm font-medium ${
                                  product.HasReview
                                    ? "text-green-600"
                                    : "text-orange-600"
                                }`}
                              >
                                {product.HasReview
                                  ? "Reviewed"
                                  : "Pending Review"}
                                </div>
                                <div>
                                  <button 
                                    onClick={() => openReviewModal(product)}
                                    className="px-4 py-2 custom-green-bg text-white text-sm font-medium rounded-full"
                                  >
                                  {product.HasReview
                                    ? "Edit Review"
                                    : "Give Feedback"}
                                  </button>
                                </div>
                                <div></div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    // Reviews By You Tab Content  
                  <div
                    key="reviewsByYou"
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6"
                  >
                      {isLoadingReviews ? (
                        <div className="p-8 text-center">
                        <div className="text-gray-500">
                          Loading your reviews...
                        </div>
                        </div>
                      ) : userReviews.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="text-gray-500">No reviews yet</div>
                        <div className="text-xs text-gray-400 mt-2">
                          Write reviews for products you've purchased
                        </div>
                        </div>
                      ) : (
                        <>
                          {/* Mobile Layout */}
                          <div className="lg:hidden">
                            <div className="bg-gray-100 px-4 py-3">
                            <h3 className="text-sm font-medium text-gray-700">
                              Your Reviews
                            </h3>
                            </div>
                            <div className="space-y-4">
                              {userReviews.map((review, index) => (
                              <div
                                key={review.ReviewID}
                                className="p-4 space-y-4 border-b border-gray-100 last:border-b-0"
                              >
                                  <div>
                                  <div className="text-sm font-medium text-gray-900 mb-1">
                                    {review.ProductName}
                                  </div>
                                  <div className="text-xs text-gray-600 mb-1">
                                    Price: {convertPriceString(`PKR ${review.ProductPrice}`)}
                                  </div>
                                    <div className="text-xs text-gray-600 mb-3">
                                    Reviewed on:{" "}
                                    {new Date(
                                      review.CreatedAt
                                    ).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-700 mb-3">
                                      {review.ReviewText}
                                    </div>
                                    {review.ImageUrls && (
                                      <div className="flex items-center space-x-3 mb-3">
                                      {JSON.parse(review.ImageUrls)
                                        .slice(0, 3)
                                        .map((imageUrl, imgIndex) => (
                                          <div
                                            key={imgIndex}
                                            className="w-8 h-8 bg-gray-100 rounded border"
                                          >
                                            <img 
                                              src={imageUrl} 
                                              alt={`Review image ${
                                                imgIndex + 1
                                              }`}
                                              className="w-full h-full object-cover rounded"
                                            />
                                          </div>
                                        ))}
                                      {JSON.parse(review.ImageUrls).length >
                                        3 && (
                                          <div className="text-xs text-gray-500">
                                          +
                                          {JSON.parse(review.ImageUrls).length -
                                            3}{" "}
                                          more
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <button 
                                  onClick={() =>
                                    openReviewModal(
                                      purchasedProducts.find(
                                        (p) => p.ProductID === review.ProductID
                                      )
                                    )
                                  }
                                    className="w-full px-4 py-2 custom-green-bg text-white text-xs font-medium rounded-full"
                                  >
                                    Edit Review
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden lg:block">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-8 px-6 py-5 bg-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wide">
                              <div className="col-span-3">PRODUCT DETAILS</div>
                              <div className="col-span-6">YOUR REVIEW</div>
                              <div className="col-span-3">ACTION</div>
                            </div>
                            
                            {/* Review Rows */}
                            {userReviews.map((review, index) => (
                            <div
                              key={review.ReviewID}
                              className="grid grid-cols-12 gap-8 px-6 py-4 items-start border-b border-gray-100 last:border-b-0"
                            >
                                <div className="col-span-3">
                                <div className="text-sm font-medium text-gray-900 mb-1">
                                  {review.ProductName}
                                </div>
                                <div className="text-xs text-gray-600 mb-1">
                                  Price: {convertPriceString(`PKR ${review.ProductPrice}`)}
                                </div>
                                  <div className="text-xs text-gray-600">
                                  Reviewed:{" "}
                                  {new Date(
                                    review.CreatedAt
                                  ).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="col-span-6">
                                  <div className="text-sm text-gray-700 mb-3">
                                    {review.ReviewText.length > 150 
                                    ? `${review.ReviewText.substring(
                                        0,
                                        150
                                      )}...`
                                      : review.ReviewText}
                                  </div>
                                  {review.ImageUrls && (
                                    <div className="flex items-center space-x-3">
                                    {JSON.parse(review.ImageUrls)
                                      .slice(0, 4)
                                      .map((imageUrl, imgIndex) => (
                                        <div
                                          key={imgIndex}
                                          className="w-8 h-8 bg-gray-100 rounded border"
                                        >
                                          <img 
                                            src={imageUrl} 
                                            alt={`Review image ${imgIndex + 1}`}
                                            className="w-full h-full object-cover rounded"
                                          />
                                        </div>
                                      ))}
                                    {JSON.parse(review.ImageUrls).length >
                                      4 && (
                                        <div className="text-xs text-gray-500">
                                        +
                                        {JSON.parse(review.ImageUrls).length -
                                          4}{" "}
                                        more
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="col-span-3 flex justify-start">
                                  <button 
                                  onClick={() =>
                                    openReviewModal(
                                      purchasedProducts.find(
                                        (p) => p.ProductID === review.ProductID
                                      )
                                    )
                                  }
                                    className="px-4 py-2 custom-green-bg text-white text-sm font-medium rounded-full"
                                  >
                                    Edit Review
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
            ) : activeSection === "My Returns" ? (
                <div>
                  {/* My Returns Header */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                    <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900">
                        My Returns
                      </h2>
                    </div>

                    {/* My Returns Content */}
                    <div className="p-4 lg:p-6">
                      {isLoadingReturns ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                        </div>
                      ) : userReturns.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No return requests found.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {userReturns.map((returnItem, index) => (
                            <div key={returnItem.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                {/* Product Info */}
                                <div className="flex items-center gap-4">
                                  <div>
                                    <h3 className="font-medium text-gray-900">
                                      {returnItem.product?.name || `Product ID: ${returnItem.productId}`}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                      Order #{returnItem.orderNumber}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Requested: {new Date(returnItem.requestedAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>

                                {/* Return Details */}
                                <div className="flex flex-col items-end gap-2">
                                  <div className="text-right">
                                    <p className="font-medium text-gray-900">
                                      PKR {returnItem.refundAmount}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Refund Amount
                                    </p>
                                  </div>
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getReturnStatusColor(returnItem.status)}`}>
                                    {returnItem.status}
                                  </span>
                                </div>
                              </div>

                              {/* Refund Reason */}
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Reason:</span> {returnItem.refundReason}
                                </p>
                              </div>

                              {/* Admin Response (if available) */}
                              {returnItem.adminResponse && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Admin Response:</span> {returnItem.adminResponse}
                                  </p>
                                </div>
                              )}

                              {/* Processed Date (if available) */}
                              {returnItem.processedAt && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-500">
                                    Processed: {new Date(returnItem.processedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
            ) : activeSection === "Payment Options" ? (
                <div>
                  {/* Add Credit / Debit Card Information */}
                  <div className="bg-gray-100 rounded-lg shadow-sm p-4 lg:p-6">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 lg:mb-6">
                    <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-2 lg:mb-0">
                      Add Credit / Debit Card information
                    </h2>
                      <div className="flex items-center gap-2 text-green-600">
                        <FaShieldAlt className="text-sm" />
                      <span className="text-xs lg:text-sm font-medium">
                        Security Guaranteed
                      </span>
                      </div>
                    </div>

                    {/* Card Logos */}
                    <div className="flex items-center gap-3 mb-4 lg:mb-6">
                      <FaCcVisa className="text-2xl lg:text-3xl text-blue-600" />
                      <FaCcMastercard className="text-2xl lg:text-3xl text-red-500" />
                    </div>

                    {/* Message Display */}
                    {message.text && (
                    <div
                      className={`mb-4 p-3 rounded-lg ${
                        message.type === "success"
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-red-100 text-red-700 border border-red-300"
                      }`}
                    >
                        <div className="text-sm">{message.text}</div>
                      </div>
                    )}

                    {/* Card Form */}
                    <div className="space-y-4">
                      {/* Card Number */}
                      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4">
                        <input
                          type="text"
                          placeholder="Card Number"
                          name="cardNumber"
                          value={cardForm.cardNumber}
                          onChange={handleCardInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Name on Card"
                          name="nameOnCard"
                          value={cardForm.nameOnCard}
                          onChange={handleCardInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Expiry (MM/YY)"
                          name="expiry"
                          value={cardForm.expiry}
                          onChange={handleCardInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm"
                        />
                      </div>

                      {/* CVV */}
                      <div className="lg:grid lg:grid-cols-3 lg:gap-4">
                        <input
                          type="text"
                          placeholder="CVV"
                          name="cvv"
                          value={cardForm.cvv}
                          onChange={handleCardInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm"
                        />
                      </div>

                      {/* Save Card Button */}
                      <div className="pt-2">
                        <button
                          onClick={handleSaveCard}
                          disabled={isSubmitting}
                          className={`w-full lg:w-auto py-3 px-6 lg:px-8 rounded-lg font-bold transition duration-200 text-sm ${
                            isSubmitting
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "bg-gradient-to-b from-[#6adb4d] via-[#54b056] to-[#468e5d] text-white hover:from-[#468e5d] via-[#54b056] hover:to-[#6adb4d]"
                          }`}
                        >
                        {isSubmitting ? "SAVING..." : "SAVE CARD"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
            ) : activeSection === "My Bids" ? (
                <div>
                {/* Bidding Header */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                  <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Bidding
                    </h2>
                  </div>

                  {/* Filters and Controls */}
                  <div className="px-4 lg:px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-700">
                            Show:
                          </label>
                          <select
                            value={bidFilters.show}
                            onChange={(e) =>
                              setBidFilters((prev) => ({
                                ...prev,
                                show: e.target.value,
                              }))
                            }
                            className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                          >
                            <option value="Not Hidden">Not Hidden</option>
                            <option value="Hidden">Hidden</option>
                            <option value="All">All</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <button className="text-sm text-gray-600 hover:text-gray-800">
                            Hide
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-700">
                            Status:
                          </label>
                          <select
                            value={bidFilters.status}
                            onChange={(e) =>
                              setBidFilters((prev) => ({
                                ...prev,
                                status: e.target.value,
                              }))
                            }
                            className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                          >
                            <option value="All">All ({userBids.length})</option>
                            <option value="Winning">
                              Winning (
                              {
                                userBids.filter(
                                  (bid) => bid.status === "WINNING"
                                ).length
                              }
                              )
                            </option>
                            <option value="Outbid">
                              Outbid (
                              {
                                userBids.filter(
                                  (bid) => bid.status === "OUTBID"
                                ).length
                              }
                              )
                            </option>
                            <option value="Ended">
                              Ended (
                              {
                                userBids.filter(
                                  (bid) => bid.timeLeft === "Auction ended"
                                ).length
                              }
                              )
                            </option>
                          </select>
                      </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-700">
                            Sort:
                          </label>
                          <select
                            value={bidFilters.sort}
                            onChange={(e) =>
                              setBidFilters((prev) => ({
                                ...prev,
                                sort: e.target.value,
                              }))
                            }
                            className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                          >
                            <option value="Time left: ending soonest">
                              Time left: ending soonest
                            </option>
                            <option value="Time left: ending latest">
                              Time left: ending latest
                            </option>
                            <option value="Price: highest first">
                              Price: highest first
                            </option>
                            <option value="Price: lowest first">
                              Price: lowest first
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bidding Items */}
                  {isLoadingBids ? (
                    <div className="p-8 text-center">
                      <div className="text-gray-500">Loading your bids...</div>
                    </div>
                  ) : userBids.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="text-gray-500">No bids found</div>
                      <div className="text-xs text-gray-400 mt-2">
                        Start bidding on items to see them here
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {userBids
                        .filter((bid) => {
                          if (bidFilters.status === "All") return true;
                          if (bidFilters.status === "Winning")
                            return bid.status === "WINNING";
                          if (bidFilters.status === "Outbid")
                            return bid.status === "OUTBID";
                          if (bidFilters.status === "Ended")
                            return bid.timeLeft === "Auction ended";
                          return true;
                        })
                        .sort((a, b) => {
                          if (bidFilters.sort === "Time left: ending soonest") {
                            // Sort by time remaining (auctions ending soonest first)
                            const aTime =
                              a.timeLeft === "Auction ended"
                                ? Infinity
                                : a.timeLeft === "No time limit"
                                ? 0
                                : parseInt(a.timeLeft.split("h")[0]) * 60 +
                                  parseInt(
                                    a.timeLeft.split("h")[1]?.split("m")[0] || 0
                                  );
                            const bTime =
                              b.timeLeft === "Auction ended"
                                ? Infinity
                                : b.timeLeft === "No time limit"
                                ? 0
                                : parseInt(b.timeLeft.split("h")[0]) * 60 +
                                  parseInt(
                                    b.timeLeft.split("h")[1]?.split("m")[0] || 0
                                  );
                            return aTime - bTime;
                          } else if (
                            bidFilters.sort === "Time left: ending latest"
                          ) {
                            // Sort by time remaining (auctions ending latest first)
                            const aTime =
                              a.timeLeft === "Auction ended"
                                ? -Infinity
                                : a.timeLeft === "No time limit"
                                ? 0
                                : parseInt(a.timeLeft.split("h")[0]) * 60 +
                                  parseInt(
                                    a.timeLeft.split("h")[1]?.split("m")[0] || 0
                                  );
                            const bTime =
                              b.timeLeft === "Auction ended"
                                ? -Infinity
                                : b.timeLeft === "No time limit"
                                ? 0
                                : parseInt(b.timeLeft.split("h")[0]) * 60 +
                                  parseInt(
                                    b.timeLeft.split("h")[1]?.split("m")[0] || 0
                                  );
                            return bTime - aTime;
                          } else if (
                            bidFilters.sort === "Price: highest first"
                          ) {
                            return b.currentPrice - a.currentPrice;
                          } else if (
                            bidFilters.sort === "Price: lowest first"
                          ) {
                            return a.currentPrice - b.currentPrice;
                          }
                          return 0;
                        })
                        .map((bid, index) => (
                          <div key={bid.id} className="p-4 lg:p-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                              {/* Checkbox */}
                              <div className="flex items-start">
                                <input
                                  type="checkbox"
                                  className="mt-1 rounded"
                                />
                              </div>

                              {/* Item Image */}
                              <div className="flex-shrink-0">
                                <div className="w-20 h-20 bg-gray-100 rounded border overflow-hidden">
                                  <img
                                    src={bid.image}
                                    alt={bid.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src = "/laptop.png";
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Item Details */}
                              <div className="flex-1 flex flex-row gap-4 min-w-0">
                        <div>
                                  {/* Status */}
                                  <div className="mb-2">
                                    <span className="text-sm font-semibold text-green-600">
                                      {bid.status}
                                    </span>
                        </div>

                                  {/* Title */}
                                  <div className="mb-2">
                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                      {bid.title}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                      ({bid.id})
                                    </p>
                                    {bid.productSpecs &&
                                      bid.productSpecs.length > 0 && (
                                        <p className="text-xs text-gray-600 mt-1">
                                          {bid.productSpecs.join(" | ")}
                                        </p>
                                      )}
                                  </div>

                                  {/* Bid Info */}
                                  <div className="mb-2">
                                    <p className="text-sm text-gray-700">
                                      Your max bid:{" "}
                                      <span className="font-medium">
                                        {bid.currency} {bid.maxBid.toFixed(2)}
                                      </span>
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      * Converted from {bid.currency}{" "}
                                      {bid.originalBid.toFixed(2)} (+
                                      {bid.currency}{" "}
                                      {bid.bidIncrease.toFixed(2)})
                                    </p>
                                  </div>
                                </div>

                                {/* Time and Price */}
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                                  <div className="flex flex-col gap-4">
                                    <span className="text-sm font-semibold text-red-600">
                                      {bid.timeLeft}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      {bid.dateTime}
                                    </span>
                                  </div>
                                  <div className="flex flex-col gap-4">
                                    <span className="text-sm font-semibold text-green-600">
                                      {bid.currentPriceCurrency}{" "}
                                      {bid.currentPrice.toFixed(2)}*
                                    </span>
                                    <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                                      {bid.numBids} bids
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      +{bid.currentPriceCurrency}
                                      {bid.shippingCost.toFixed(2)}* Shipping
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-col gap-2 lg:items-center">
                                <button className="w-full lg:w-auto px-4 py-2 bg-[#6ee34c] text-white text-sm font-medium rounded-3xl hover:bg-blue-700 transition-colors">
                                  View seller's other items
                                </button>
                                <button className="w-full lg:w-auto px-4 py-2 border border-[#6ee34c] text-[#6ee34c] text-sm font-medium rounded-3xl hover:bg-blue-50 transition-colors">
                                  View similar items
                                </button>
                                <div className="relative">
                                  <button className="w-full lg:w-auto px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-3xl hover:bg-gray-50 transition-colors flex items-center gap-1">
                                    More actions
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                      />
                                    </svg>
                                  </button>
                                </div>
                                <button className="w-full lg:w-auto px-4 py-2 text-blue-600 text-sm font-medium hover:underline">
                                  Add note
                                </button>
                              </div>
                            </div>

                            {/* Important Note */}
                            <div className="mt-4 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                              <p className="text-xs text-gray-600">
                                * If you have been outbid, you may still become
                                the high bidder if, for example, the seller
                                cancels a bid received by another bidder or
                                lowers a reserve price.
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Pagination */}
                  <div className="px-4 lg:px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-gray-600">
                        Items per page:
                      </span>
                      <select className="text-sm border border-gray-300 rounded px-2 py-1 bg-white">
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeSection === "Favorites" ? (
                        <div>
                {/* Favorites Header */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                  <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      My Favorites ({favorites.length})
                    </h2>
                  </div>

                  {/* Favorites Content */}
                  {favorites.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="text-gray-500 mb-4">No favorites yet</div>
                      <div className="text-xs text-gray-400 mb-4">
                        Start adding products to your favorites to see them here
                      </div>
                      <button
                        onClick={() => (window.location.href = "/category")}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                      >
                        Browse Products
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 lg:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {favorites.map((favorite, index) => (
                          <div
                            key={favorite.id}
                            className="bg-white border border-gray-200 rounded-lg p-4 relative group hover:shadow-md transition-shadow h-80 flex flex-col"
                          >
                            {/* Remove from favorites button */}
                            <button
                              onClick={() => removeFromFavorites(favorite.id)}
                              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>

                            {/* Product Image */}
                            <div className="w-full h-32 mb-3 flex items-center justify-center bg-gray-50 rounded-lg flex-shrink-0">
                              <img
                                src={favorite.image}
                                alt={favorite.name}
                                className="w-full h-full object-contain p-2"
                                onError={(e) => {
                                  e.target.src = "/laptop.png";
                                }}
                              />
                            </div>

                            {/* Product Info */}
                            <div className="space-y-2 flex-grow">
                              <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                {favorite.name}
                              </h3>
                              {favorite.category && (
                                <p className="text-xs text-gray-500">
                                  {favorite.category}
                                </p>
                              )}
                              <p className="text-lg font-bold text-gray-900">
                                {favorite.price}
                              </p>
                              <p className="text-xs text-gray-400">
                                Added{" "}
                                {new Date(
                                  favorite.addedAt
                                ).toLocaleDateString()}
                              </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-auto space-y-2 flex-shrink-0">
                              <button
                                onClick={() =>
                                  (window.location.href = `/product/${favorite.id}`)
                                }
                                className="w-full bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition"
                              >
                                View Product
                              </button>
                              <button
                                onClick={() => {
                                  addToCart(favorite);
                                }}
                                className="w-full border border-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : activeSection === "Help center" ? (
              <div>
                {/* Help Center Header */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                  <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Help Center
                    </h2>
                  </div>

                  {/* Help Center Content */}
                  <div className="p-6">
                    <div className="text-center space-y-4">
                      <div className="text-gray-600">
                        <p className="text-lg mb-2">
                          Need help? We're here for you!
                        </p>
                        <p className="text-sm">
                          Contact us through any of the following methods:
                          </p>
                        </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-center space-x-2">
                          <svg
                            className="w-5 h-5 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-gray-700 font-medium">
                            Mail us at:{" "}
                            <a
                              href="mailto:info@certifurb.com"
                              className="text-green-600 hover:text-green-700"
                            >
                              info@certifurb.com
                            </a>
                          </span>
                        </div>

                        <div className="flex items-center justify-center space-x-2">
                          <svg
                            className="w-5 h-5 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span className="text-gray-700 font-medium">
                            Call us at:{" "}
                            <a
                              href="tel:+1-555-123-4567"
                              className="text-green-600 hover:text-green-700"
                            >
                              +1 (555) 123-4567
                            </a>
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                          Our support team is available Monday to Friday, 9:00
                          AM - 6:00 PM EST
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeSection === "My Orders" ? (
                        <div>
                {/* My Orders Header */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                  <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      My Orders
                    </h2>
                  </div>

                  {/* My Orders Content */}
                  <div>
                    {isLoadingOrders ? (
                      <div className="text-center py-8">
                        <div className="text-gray-500">
                          Loading your orders...
                        </div>
                      </div>
                    ) : userOrders.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-gray-500 mb-2">
                          No orders found
                        </div>
                        <div className="text-sm text-gray-400">
                          Start shopping to see your orders here
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Mobile Layout */}
                        <div className="lg:hidden">
                          {userOrders.map((order, index) => (
                            <div
                              key={order.id}
                              className="border border-gray-200 rounded-lg p-4 space-y-3"
                            >
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-500">
                                  ORDER #
                                </span>
                                <span className="text-xs font-medium">
                                  {order.orderNumber}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-500">
                                  PRODUCT
                                </span>
                                <span className="text-xs">
                                  {order.product.name}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-500">
                                  QUANTITY
                                </span>
                                <span className="text-xs">
                                  {order.quantity}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-500">
                                  TOTAL
                                </span>
                                <span className="text-xs font-medium">
                                  {order.total}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-500">
                                  DATE
                                </span>
                                <span className="text-xs">{order.date}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-500">
                                  STATUS
                                </span>
                                <span
                                  className={`text-xs font-medium px-2 py-1 rounded-full ${order.paymentStatus.color}`}
                                >
                                  {order.paymentStatus.text}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-500">
                                  SHIPMENT
                                </span>
                                <span
                                  className={`text-xs font-medium px-2 py-1 rounded-full ${getShipmentStatusColor(order.shipment.status)}`}
                                >
                                  {order.shipment.status}
                                </span>
                              </div>
                              {order.shipment.trackingNumber && order.shipment.trackingNumber !== "Not assigned" && (
                                <div className="flex justify-between">
                                  <span className="text-xs text-gray-500">
                                    TRACKING
                                  </span>
                                  <span className="text-xs font-medium">
                                    {order.shipment.trackingNumber}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between items-center pt-2">
                                <span className="text-xs text-gray-500">RETURN</span>
                                {(() => {
                                  const buttonInfo = getReturnButtonInfo(order);
                                  return (
                                    <button
                                      disabled={buttonInfo.disabled}
                                      className={`text-xs px-3 py-1 rounded-full font-medium ${buttonInfo.className}`}
                                      onClick={buttonInfo.onClick}
                                    >
                                      {buttonInfo.text}
                          </button>
                                  );
                                })()}
                        </div>
                      </div>
                          ))}
                    </div>

                        {/* Desktop Layout */}
                        <div className="hidden lg:block">
                          <div className="overflow-x-auto max-w-4xl">
                            <table className="w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order #
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                  </th>
                                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th> */}
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Shipment
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tracking
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Return
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {userOrders.map((order) => (
                                  <tr
                                    key={order.id}
                                    className="hover:bg-gray-50"
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {order.orderNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">
                                        {order.product.name}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {order.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {order.total}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {order.date}
                                    </td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap">
                                      <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.paymentStatus.color}`}
                                      >
                                        {order.paymentStatus.text}
                                      </span>
                                    </td> */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getShipmentStatusColor(order.shipment.status)}`}
                                      >
                                        {order.shipment.status}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {order.shipment.trackingNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      {(() => {
                                        const buttonInfo = getReturnButtonInfo(order);
                                        return (
                                          <button
                                            disabled={buttonInfo.disabled}
                                            className={`text-xs px-3 py-1 rounded-full font-medium ${buttonInfo.className}`}
                                            onClick={buttonInfo.onClick}
                                          >
                                            {buttonInfo.text}
                                          </button>
                                        );
                                      })()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : activeSection === "Refund & Return" ? (
              <div>
                {/* Refund & Return Header */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                  <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Refund & Return
                    </h2>
                    </div>

                  {/* Refund & Return Content */}
                  <div className="p-6">
                    <div className="text-center space-y-4">
                      <div className="text-gray-600">
                        <p className="text-lg mb-2">
                          Need to return or refund an item?
                        </p>
                        <p className="text-sm">
                          We're here to help you with your return and refund
                          requests.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-center space-x-2">
                          <svg
                            className="w-5 h-5 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-gray-700 font-medium">
                            Email us at:{" "}
                            <a
                              href="mailto:refunds@certifurb.com"
                              className="text-green-600 hover:text-green-700"
                            >
                              refunds@certifurb.com
                            </a>
                          </span>
                        </div>

                        <div className="flex items-center justify-center space-x-2">
                          <svg
                            className="w-5 h-5 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span className="text-gray-700 font-medium">
                            Call us at:{" "}
                            <a
                              href="tel:+1-555-123-4567"
                              className="text-green-600 hover:text-green-700"
                            >
                              +1 (555) 123-4567
                            </a>
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="space-y-3 text-sm text-gray-500">
                          <p>
                            <strong>Return Policy:</strong> 30-day return window
                            for most items
                          </p>
                          <p>
                            <strong>Refund Processing:</strong> 3-5 business
                            days after we receive your return
                          </p>
                          <p>
                            <strong>Support Hours:</strong> Monday to Friday,
                            9:00 AM - 6:00 PM EST
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeSection === "Shipping Address" ? (
              <div>
                {/* Shipping Address Header */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                  <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Shipping Address
                      </h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowAddressForm(true)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition"
                        >
                          {shipmentAddress ? "Edit Address" : "Add Address"}
                          </button>
                        </div>
                      </div>
                  </div>

                  {/* Message Display */}
                  {addressMessage.text && (
                    <div
                      className={`mx-4 lg:mx-6 mt-4 p-3 rounded-lg ${
                        addressMessage.type === "success"
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-red-100 text-red-700 border border-red-300"
                      }`}
                    >
                      <div className="text-sm">{addressMessage.text}</div>
                    </div>
                  )}

                  {/* Add/Edit Address Form */}
                  {showAddressForm && (
                    <div className="p-4 lg:p-6 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {shipmentAddress
                          ? "Edit Shipping Address"
                          : "Add Shipping Address"}
                      </h3>
                      <form
                        onSubmit={handleUpdateAddress}
                        className="space-y-4"
                      >
                          <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Shipping Address *
                          </label>
                          <textarea
                            value={shipmentAddress}
                            onChange={(e) => setShipmentAddress(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm resize-none"
                            placeholder="Enter your complete shipping address (street, city, province, postal code, etc.)"
                            rows={4}
                            required
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            className="bg-green-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition"
                          >
                            {shipmentAddress ? "Update Address" : "Add Address"}
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelAddress}
                            className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Current Address Display */}
                  <div className="p-4 lg:p-6">
                    {isLoadingAddress ? (
                      <div className="text-center py-8">
                        <div className="text-gray-500">Loading address...</div>
                      </div>
                    ) : shipmentAddress ? (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">
                              Current Shipping Address
                            </h4>
                            <div className="text-sm text-gray-600 whitespace-pre-wrap">
                              {shipmentAddress}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-500 mb-2">
                          No shipping address found
                        </div>
                        <div className="text-sm text-gray-400">
                          Add your shipping address to get started
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* Content Grid - Mobile: Stack, Desktop: Side by side */}
                <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4 lg:gap-6 mb-6">
                  {/* Personal Profile */}
                  <div className="lg:col-span-2 bg-gray-100 rounded-lg shadow-sm">
                    <div className="px-4 lg:px-6 py-4 border-b border-gray-300">
                      <h2 className="text-base lg:text-lg font-medium text-gray-900">
                        Personal Profile
                      </h2>
                    </div>
                    <div className="px-4 lg:px-6 py-4 space-y-3">
                      <div>
                        <p className="text-gray-900 font-medium text-sm lg:text-base">
                          {user?.username || "Username"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs lg:text-sm">
                          {user?.useremail
                            ? `${user.useremail.substring(0, 4)}${"*".repeat(
                                6
                              )}@${user.useremail.split("@")[1]}`
                            : "user****@gmail.com"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Address Book */}
                  <div className="lg:col-span-3 bg-gray-100 rounded-lg shadow-sm">
                    <div className="px-4 lg:px-6 py-4 border-b border-gray-300">
                      <h2 className="text-base lg:text-lg font-medium text-gray-900">
                        Address Book
                      </h2>
                    </div>
                    <div className="px-4 lg:px-6 py-4">
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                          SHIPMENT ADDRESS
                            </h4>
                            <div className="text-xs lg:text-sm text-gray-700 space-y-1">
                          {shipmentAddress ? (
                            <span className="whitespace-pre-line">
                              {shipmentAddress}
                            </span>
                          ) : (
                            <span className="text-gray-400">
                              No shipment address found. Set up one.
                            </span>
                          )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-gray-100 rounded-lg shadow-sm">
                    <div className="px-4 lg:px-6 py-4 border-b border-gray-300">
                    <h2 className="text-base lg:text-lg font-medium text-gray-900">
                      Recent Orders
                    </h2>
                    </div>
                    
                    {/* Mobile Layout */}
                    <div className="lg:hidden p-4">
                    {isLoadingRecentOrder ? (
                      <div className="text-gray-500">
                        Loading recent order...
                      </div>
                    ) : userOrders && userOrders.length > 0 ? (
                      <div className="space-y-3">
                        {userOrders
                          .slice(-3)
                          .reverse()
                          .map((order, idx) => (
                            <div key={order.id || idx} className="space-y-3">
                        <div className="flex justify-between">
                                <span className="text-xs text-gray-500">
                                  ORDER #
                                </span>
                                <span className="text-xs font-medium">
                                  {order.orderNumber || order.id || "-"}
                                </span>
                        </div>
                        <div className="flex justify-between">
                                <span className="text-xs text-gray-500">
                                  PLACED ON
                                </span>
                                <span className="text-xs">
                                  {order.product.name || "-"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-500">
                                  PLACED ON
                                </span>
                                <span className="text-xs">
                                  {order.date || "-"}
                                </span>
                        </div>
                        <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">
                                  ITEMS
                                </span>
                                <span className="text-xs">
                                  {order.quantity || 1}
                                </span>
                        </div>
                        <div className="flex justify-between">
                                <span className="text-xs text-gray-500">
                                  TOTAL
                                </span>
                                <span className="text-xs font-medium">
                                  {order.total || "PKR -"}
                                </span>
                        </div>
                              {idx <
                                userOrders.slice(-3).reverse().length - 1 && (
                                <div className="border-b border-gray-200 pt-2"></div>
                              )}
                      </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-6">
                        No orders found, Let's Do Some Shopping
                      </div>
                    )}
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:block px-6 py-4">
                    {isLoadingRecentOrder ? (
                      <div className="text-gray-500">
                        Loading recent order...
                      </div>
                    ) : userOrders && userOrders.length > 0 ? (
                      <>
                      {/* Table Header */}
                        <div className="grid grid-cols-5 gap-4 pb-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        <div>ORDER #</div>
                          <div>PRODUCT</div>
                        <div>PLACED ON</div>
                        <div>ITEMS</div>
                        <div>TOTAL</div>
                      </div>
                        {/* Show last 3 orders */}
                        {userOrders
                          .slice(-3)
                          .reverse()
                          .map((order, idx) => (
                            <div
                              key={order.id || idx}
                              className="grid grid-cols-5 gap-4 py-4 border-t border-gray-300 items-center"
                            >
                              <div className="text-sm font-medium text-gray-900">
                                {order.orderNumber || order.id || "-"}
                          </div>
                              <div className="text-sm text-gray-600">
                                {order.product.name || "-"}
                        </div>
                              <div className="text-sm text-gray-600">
                                {order.date || "-"}
                      </div>
                              <div className="text-sm font-medium text-gray-900">
                                {order.quantity || 1}
                    </div>
                              <div className="text-sm font-medium text-gray-900">
                                {order.total || "PKR -"}
                              </div>
                            </div>
                          ))}
                      </>
                    ) : (
                      <div className="text-center text-gray-500 py-6">
                        No orders found, Let's Do Some Shopping
                      </div>
                    )}
                  </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
      <Footer />

        {/* Review Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center custom-green-bg justify-between p-6 border-b border-gray-200">
                <div>
                <h2 className="text-xl font-bold text-white">
                  Write Your Review
                </h2>
                  {selectedProduct && (
                  <p className="text-sm text-green-100 mt-1">
                    {selectedProduct.ProductName}
                  </p>
                  )}
                </div>
                <button 
                  onClick={closeReviewModal}
                  className="text-white hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Review Message Display */}
                {reviewMessage.text && (
                <div
                  className={`mb-4 p-3 rounded-lg ${
                    reviewMessage.type === "success"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-red-100 text-red-700 border border-red-300"
                  }`}
                >
                    <div className="text-sm">{reviewMessage.text}</div>
                  </div>
                )}

                {/* Rating Selector */}

                {/* Text Area */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Type Your Message..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none text-sm text-gray-600 placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    disabled={isSubmittingReview}
                  />
                </div>

                {/* Image Upload Area */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Images (Optional)
                  </label>
                  
                  {/* Hidden file input */}
                  <input
                    type="file"
                    id="imageUpload"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploadingImages || isSubmittingReview}
                  />
                  
                  {/* Upload Area */}
                  <div 
                    onClick={triggerFileInput}
                    className={`border-2 border-dashed border-gray-300 rounded-lg py-12 text-center bg-gray-50 cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-colors ${
                    isUploadingImages || isSubmittingReview
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                    }`}
                  >
                    <div className="flex flex-col items-center">
                    <svg
                      className="w-8 h-8 text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                      </svg>
                      <p className="text-sm text-gray-500">
                      {isUploadingImages
                        ? "Uploading images..."
                        : "Click to Add Product Images"}
                      </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Support for PNG, JPG, JPEG files
                    </p>
                    </div>
                  </div>

                  {/* Display uploaded images */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-4">
                      <div className="grid grid-cols-4 gap-3">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.url}
                              alt={image.name}
                              className="w-full h-20 object-cover rounded-lg border border-gray-300"
                            />
                            
                            {/* Upload status indicator */}
                            {image.cloudinaryUrl && (
                              <div className="absolute top-1 left-1 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                                ✓
                              </div>
                            )}
                            
                            {/* Remove button */}
                            {!isSubmittingReview && (
                              <button
                                onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                            )}
                            
                            <div className="text-xs text-gray-500 mt-1 truncate">
                              {image.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={closeReviewModal}
                    className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    disabled={isSubmittingReview || isUploadingImages}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmitReview}
                  disabled={
                    isSubmittingReview ||
                    isUploadingImages ||
                    !reviewText.trim()
                  }
                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                    isSubmittingReview ||
                    isUploadingImages ||
                    !reviewText.trim()
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-b from-[#6adb4d] via-[#54b056] to-[#468e5d] text-white hover:from-[#468e5d] via-[#54b056] hover:to-[#6adb4d]"
                    }`}
                  >
                    {isSubmittingReview 
                    ? existingReview
                      ? "UPDATING REVIEW..."
                      : "SUBMITTING REVIEW..."
                      : isUploadingImages 
                    ? "UPLOADING IMAGES..."
                    : existingReview
                    ? "UPDATE REVIEW"
                    : "SUBMIT REVIEW"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Refund Dialog Modal */}
      {showRefundDialog && selectedOrderForRefund && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Return Request
              </h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Order:</strong> {selectedOrderForRefund.orderNumber}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Product:</strong> {selectedOrderForRefund.product.name}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Total:</strong> {selectedOrderForRefund.total}
                </p>
                
                <form onSubmit={handleRefundSubmit}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Return *
                  </label>
                  <textarea
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="Please describe why you want to return this item..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    required
                  />
                  
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      type="button"
                      onClick={closeRefundDialog}
                      disabled={isSubmittingRefund}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingRefund || !refundReason.trim()}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingRefund ? 'Submitting...' : 'Submit Return Request'}
                    </button>
    </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
