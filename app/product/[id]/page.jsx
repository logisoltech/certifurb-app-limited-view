"use client";

import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../../Components/Layout/Navbar";
import Footer from "../../Components/Layout/Footer";
import {
  FaCheckCircle,
  FaBoxOpen,
  FaKeyboard,
  FaMemory,
  FaRegTimesCircle,
  FaRegHeart,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaTimes,
} from "react-icons/fa";
import { BsFillCpuFill } from "react-icons/bs";
import { font } from "../../Components/Font/font";
import { FaLaptop } from "react-icons/fa";
import { MdCable } from "react-icons/md";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { formatPrice } from "../../utils/priceFormatter";
import { useCurrency } from "../../context/CurrencyContext";
import dayjs from "dayjs";
import utc from "dayjs-plugin-utc";

const features = [
  {
    icon: <FaCheckCircle className="text-black text-xl " />,
    label: "Certified by Experts",
  },
  {
    icon: <BsFillCpuFill className="text-black text-xl mx-auto" />,
    label: "Windows 11",
  },
  {
    icon: <FaMemory className="text-black text-xl mx-auto" />,
    label: "12 Months Warranty",
  },
  {
    icon: <FaBoxOpen className="text-black text-xl mx-auto" />,
    label: "Free Delivery",
  },
];

const whatsIncluded = [
  {
    icon: <FaKeyboard className="text-black text-3xl mx-auto" />,
    label: "Charger",
  },
  {
    icon: <FaLaptop className="text-black text-3xl mx-auto" />,
    label: "Laptop",
  },
];

const technicalSpecs = [
  { label: "Model", value: "lenovo-thinkpad-t470" },
  { label: "Storage", value: "128 GB SSD, 256 GB SSD" },
  { label: "Graphics", value: "Intel" },
  { label: "Weight", value: "80oz" },
  { label: "Screen size (inches)", value: '14"' },
  { label: "CPU", value: "Core i5 - 6th Gen" },
  { label: "Resolution", value: "1366 by 768" },
  { label: "OS", value: "Windows" },
  { label: "RAM", value: "8 GB, 16 GB" },
  { label: "Battery", value: "Yes" },
  { label: "Graphics", value: "DDR4" },
  { label: "Bluetooth", value: "4.0 wireless technology" },
  {
    label: "Wifi",
    value: "802.11ac Wi-Fi wireless networking; IEEE 802.11a/b/g/n compatible",
  },
  { label: "Camera", value: "720p FaceTime HD camera" },
  {
    label: "Audio",
    value:
      "Stereo speakers | Dual microphones | 3.5 mm headphone jack | Support for Apple iPhone headset with remote and microphone",
  },
  { label: "Brand", value: "Lenovo" },
];

const similarProducts = Array(10).fill({
  name: "Lenovo Thinkpad-T470s Core-i7-7th-Gen",
  specs: '128 GB, 256 GB SSD - 14"',
  price: "PKR 130,000",
  discount: "45% vs. new",
  image: "/laptop.png",
});

const ProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = params.id;
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { convertPriceString, selectedCountry } = useCurrency();

  // Extend dayjs with UTC plugin
  dayjs.extend(utc);

  // Check if accessed from auction
  const [isFromAuction, setIsFromAuction] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const fromParam = urlParams.get("from");
      setIsFromAuction(fromParam === "auction");
    }
  }, []);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSpecs, setShowSpecs] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedRam, setSelectedRam] = useState("");
  const [selectedKeyboard, setSelectedKeyboard] = useState("");
  const [selectedScreenSize, setSelectedScreenSize] = useState("");
  const [addToCartNotification, setAddToCartNotification] = useState(false);

  // Bidding states
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [currentHighestBid, setCurrentHighestBid] = useState(0);

  // Timer state - starts at 1 hour (3600 seconds)
  const [timeLeft, setTimeLeft] = useState(3600);

  // Product images - handle both regular and auction products
  const productImages = useMemo(() => {
    if (!product) return ["/laptop.png"];

    if (isFromAuction) {
      return [product.image_url || "/laptop.png"];
    } else {
      const imageData = product.ProductImageURL;

      if (!imageData) return ["/laptop.png"];

      if (typeof imageData === "string" && imageData.startsWith("http")) {
        return [imageData];
      }

      try {
        const parsed = JSON.parse(imageData);
        return Array.isArray(parsed) && parsed.length > 0
          ? parsed
          : ["/laptop.png"];
      } catch (err) {
        console.error("Error parsing product images:", err);
        return ["/laptop.png"];
      }
    }
  }, [product, isFromAuction]);

  const visibleCount = 5;
  const maxIndex = similarProducts.length - visibleCount;
  const handlePrev = () => setCarouselIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setCarouselIndex((i) => Math.min(maxIndex, i + 1));

  // Add auction data calculation functions
  const getAuctionBidCount = () => {
    if (!product || !product.bids) return 0;
    try {
      let bids = [];
      if (typeof product.bids === "string") {
        try {
          bids = JSON.parse(product.bids);
        } catch (error) {
          console.error("Error parsing bids JSON:", error);
          return 0;
        }
      } else if (Array.isArray(product.bids)) {
        bids = product.bids;
      } else {
        return 0;
      }

      return Array.isArray(bids) ? bids.length : 0;
    } catch (error) {
      console.error("Error parsing bids:", error);
      return 0;
    }
  };

  const getAuctionTimeRemaining = () => {
    if (!product || !product.auction_timer)
      return { hours: 0, minutes: 0, seconds: 0 };

    try {
      let end;

      // Parse the auction_timer as UTC from the API (same as admin page)
      if (
        product.auction_timer.includes("T") &&
        product.auction_timer.includes("Z")
      ) {
        end = dayjs.utc(product.auction_timer);
      } else if (product.auction_timer.includes(" ")) {
        end = dayjs.utc(product.auction_timer, "YYYY-MM-DD HH:mm:ss");
      } else {
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      // Validate parsed date
      if (!end.isValid()) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      // Since the API's UTC time is based on PKT database time, adjust back to PKT
      // Subtract 5 hours (PKT offset from UTC) to get the intended PKT end time
      end = end.subtract(5, "hour");

      // Current time in local timezone (PKT)
      const now = dayjs();

      // Calculate difference
      const diff = end.diff(now);

      if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    } catch (error) {
      console.error("Error calculating auction time:", error);
      return { hours: 0, minutes: 0, seconds: 0 };
    }
  };

  const getAuctionEndDate = () => {
    if (!product || !product.auction_timer) return "Unknown";

    try {
      let end;

      if (
        product.auction_timer.includes("T") &&
        product.auction_timer.includes("Z")
      ) {
        end = dayjs.utc(product.auction_timer, "YYYY-MM-DD HH:mm:ss");
      } else if (product.auction_timer.includes(" ")) {
        end = dayjs.utc(product.auction_timer, "YYYY-MM-DD HH:mm:ss");
      } else {
        return "Unknown";
      }

      // Validate parsed date
      if (!end.isValid()) {
        return "Unknown";
      }

      return end.format("ddd, MMM D, h:mm A");
    } catch (error) {
      console.error("Error formatting auction end date:", error);
      return "Unknown";
    }
  };

  const getCurrentHighestBid = () => {
    if (!product || !product.bids) return parseFloat(product?.price || 0);

    try {
      let bids = [];
      if (typeof product.bids === "string") {
        try {
          bids = JSON.parse(product.bids);
        } catch (error) {
          console.error("Error parsing bids JSON:", error);
          return parseFloat(product?.price || 0);
        }
      } else if (Array.isArray(product.bids)) {
        bids = product.bids;
      } else {
        return parseFloat(product?.price || 0);
      }

      if (Array.isArray(bids) && bids.length > 0) {
        const highestBid = Math.max(
          ...bids.map((bid) => parseFloat(bid.amount) || 0)
        );
        return highestBid > 0 ? highestBid : parseFloat(product?.price || 0);
      }
    } catch (error) {
      console.error("Error calculating highest bid:", error);
    }

    return parseFloat(product?.price || 0);
  };

  const isAuctionEnded = () => {
    if (!product || !product.auction_timer) return true;

    try {
      let end;

      if (
        product.auction_timer.includes("T") &&
        product.auction_timer.includes("Z")
      ) {
        end = dayjs.utc(product.auction_timer);
      } else if (product.auction_timer.includes(" ")) {
        end = dayjs.utc(product.auction_timer, "YYYY-MM-DD HH:mm:ss");
      } else {
        return true;
      }

      // Validate parsed date
      if (!end.isValid()) {
        return true;
      }

      // Don't subtract 5 hours - the database time is already in the correct timezone
      // Current time in local timezone
      const now = dayjs();

      return end.isBefore(now) || product.auction_ended === 1;
    } catch (error) {
      console.error("Error checking auction status:", error);
      return true;
    }
  };

  // Fetch product data function
  const fetchProduct = async () => {
    try {
      setLoading(true);

      // Check if this is an auction product
      const isAuction = searchParams.get("from") === "auction";
      setIsFromAuction(isAuction);

      let data;

      if (isAuction) {
        // For auction products, fetch all auction products and find the specific one
        console.log("Fetching auction product with ID:", productId);
        const response = await fetch(
          "https://api.certifurb.com/api/auctionproducts"
        );
        const responseData = await response.json();

        if (responseData.success) {
          const foundProduct = responseData.data.find(
            (p) => p.productid == productId
          );
          if (foundProduct) {
            data = { success: true, data: foundProduct };
            console.log("Found auction product:", foundProduct);
          } else {
            throw new Error("Auction product not found");
          }
        } else {
          throw new Error(
            responseData.message || "Failed to fetch auction products"
          );
        }
      } else {
        // For regular products
        const response = await fetch(
          `https://api.certifurb.com/api/products/${productId}`
        );
        data = await response.json();
      }

      if (data.success) {
        setProduct(data.data);
        console.log("Raw product data:", data.data);

        // For auction products, set the current highest bid and parse bids
        if (isAuction && data.data) {
          // Handle bids data
          let bids = [];
          if (data.data.bids) {
            if (typeof data.data.bids === "string") {
              try {
                bids = JSON.parse(data.data.bids);
              } catch (error) {
                console.error("Error parsing bids JSON:", error);
                bids = [];
              }
            } else if (Array.isArray(data.data.bids)) {
              bids = data.data.bids;
            }
          }

          // Set current highest bid
          if (bids.length > 0) {
            const highestBid = Math.max(...bids.map((bid) => bid.amount));
            setCurrentHighestBid(highestBid);
            console.log("Setting current highest bid to:", highestBid);
          } else {
            setCurrentHighestBid(parseFloat(data.data.price));
            console.log(
              "Setting current highest bid to starting price:",
              data.data.price
            );
          }
        }

        // Set default selections based on product data or first available option
        // We'll set these after the state is updated, so we need to use the data directly
        const productCategory = data.data.ProductCategory;

        // Get options based on category
        let storageOptions = ["128GB", "256GB"]; // Default
        let ramOptions = ["8GB", "16GB"]; // Default
        let keyboardOptions = ["English"]; // Default
        let screenSizeOptions = ['14"']; // Default

        // Storage options
        if (
          productCategory === "Laptop" ||
          productCategory === "Desktop PC" ||
          productCategory === "Tablet"
        ) {
          storageOptions = ["128GB", "256GB", "512GB", "1TB", "2TB"];
        } else if (productCategory === "Drive") {
          storageOptions = [
            "128GB",
            "256GB",
            "512GB",
            "1TB",
            "2TB",
            "4TB",
            "8TB",
          ];
        } else if (productCategory === "Mouse") {
          storageOptions = ["None", "128MB", "256MB", "512MB", "1GB"];
        } else if (productCategory === "Printer") {
          storageOptions = ["A4", "A3", "Letter", "Legal", "Photo"];
        } else if (productCategory === "Network") {
          storageOptions = [
            "4 Ports",
            "8 Ports",
            "16 Ports",
            "24 Ports",
            "48 Ports",
          ];
        } else if (productCategory === "Keyboard") {
          storageOptions = ["Full Size", "TKL", "60%", "65%", "Compact"];
        } else if (productCategory === "LCD" || productCategory === "LED") {
          storageOptions = ["IPS", "VA", "TN", "OLED", "QLED"];
        }

        // RAM options
        if (productCategory === "Laptop" || productCategory === "Desktop PC") {
          ramOptions = ["4GB", "8GB", "16GB", "32GB", "64GB"];
        } else if (productCategory === "Tablet") {
          ramOptions = ["2GB", "4GB", "6GB", "8GB", "12GB"];
        } else if (productCategory === "Mouse") {
          ramOptions = [
            "800 DPI",
            "1200 DPI",
            "1600 DPI",
            "3200 DPI",
            "6400 DPI",
          ];
        } else if (productCategory === "Printer") {
          ramOptions = [
            "Black & White",
            "Color",
            "Photo Quality",
            "Draft Quality",
          ];
        } else if (productCategory === "Network") {
          ramOptions = [
            "10/100 Mbps",
            "Gigabit",
            "10 Gigabit",
            "Wi-Fi 5",
            "Wi-Fi 6",
          ];
        } else if (productCategory === "Keyboard") {
          ramOptions = ["Wired", "Wireless", "Bluetooth", "USB-C", "USB-A"];
        } else if (productCategory === "LCD" || productCategory === "LED") {
          ramOptions = ["HD", "Full HD", "4K", "8K", "Curved"];
        } else if (productCategory === "Drive") {
          ramOptions = [
            "SATA III",
            "NVMe",
            "USB 3.0",
            "USB 3.1",
            "Thunderbolt",
          ];
        }

        // Keyboard options
        if (productCategory === "Laptop" || productCategory === "Desktop PC") {
          keyboardOptions = [
            "English",
            "English & Arabic",
            "Backlit English",
            "Backlit English & Arabic",
          ];
        } else if (productCategory === "Keyboard") {
          keyboardOptions = [
            "Mechanical",
            "Membrane",
            "Wireless",
            "Gaming",
            "Ergonomic",
          ];
        } else if (productCategory === "Mouse") {
          keyboardOptions = [
            "Wired",
            "Wireless",
            "Gaming",
            "Ergonomic",
            "Optical",
          ];
        } else if (productCategory === "Printer") {
          keyboardOptions = [
            "Inkjet",
            "Laser",
            "All-in-One",
            "Photo Printer",
            "3D Printer",
          ];
        } else if (productCategory === "Network") {
          keyboardOptions = [
            "Router",
            "Switch",
            "Access Point",
            "Modem",
            "Network Card",
          ];
        } else if (productCategory === "Drive") {
          keyboardOptions = [
            "SSD",
            "HDD",
            "USB Drive",
            "External Drive",
            "M.2 SSD",
          ];
        } else if (productCategory === "Tablet") {
          keyboardOptions = [
            "Android",
            "iOS",
            "Windows",
            "Fire OS",
            "Chrome OS",
          ];
        } else if (productCategory === "LCD" || productCategory === "LED") {
          keyboardOptions = ["IPS", "VA", "TN", "OLED", "QLED"];
        }

        // Screen size options
        if (productCategory === "Laptop") {
          screenSizeOptions = ['13"', '14"', '15.6"', '17"'];
        } else if (productCategory === "Desktop PC") {
          screenSizeOptions = ["No Display", "Integrated Display"];
        } else if (productCategory === "LCD" || productCategory === "LED") {
          screenSizeOptions = ["60Hz", "75Hz", "120Hz", "144Hz", "240Hz"];
        } else if (productCategory === "Tablet") {
          screenSizeOptions = ['7"', '8"', '10"', '11"', '12.9"'];
        } else if (productCategory === "Mouse") {
          screenSizeOptions = [
            "Standard",
            "Ergonomic",
            "Ambidextrous",
            "Left-handed",
            "Gaming",
          ];
        } else if (productCategory === "Printer") {
          screenSizeOptions = [
            "USB",
            "Wi-Fi",
            "Ethernet",
            "Bluetooth",
            "All Connectivity",
          ];
        } else if (productCategory === "Network") {
          screenSizeOptions = ["10m", "50m", "100m", "300m", "1km"];
        } else if (productCategory === "Keyboard") {
          screenSizeOptions = [
            "RGB Backlit",
            "Single Backlit",
            "No Backlight",
            "Programmable",
            "Hot-swappable",
          ];
        } else if (productCategory === "Drive") {
          screenSizeOptions = [
            "Up to 1TB",
            "1TB - 4TB",
            "4TB - 8TB",
            "8TB+",
            "Various",
          ];
        }

        setSelectedStorage(data.data.ProductStorage || storageOptions[0]);
        setSelectedRam(data.data.ProductRam || ramOptions[0]);
        setSelectedKeyboard(data.data.ProductKeyboard || keyboardOptions[0]);
        setSelectedScreenSize(
          data.data.ProductScreenSize || screenSizeOptions[0]
        );
      } else {
        console.error("API returned error:", data);
        setError(data.message || "Product not found");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  // Fetch product data
  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId, searchParams]);

  // Update auction timer every second
  useEffect(() => {
    if (isFromAuction && product?.auction_timer) {
      const timer = setInterval(() => {
        // Force re-render to update timer
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isFromAuction, product?.auction_timer]);

  // Fetch reviews from database
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `https://api.certifurb.com/api/all-user-reviews?productId=${productId}`
        );
        const data = await response.json();

        if (data.success) {
          setReviews(data.data);
        } else {
          console.error("Failed to fetch reviews:", data.message);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  // Re-render when currency changes
  useEffect(() => {
    console.log("Product Detail: Currency changed to:", selectedCountry);
  }, [selectedCountry]);

  // Calculate suggested bid amounts (reasonable increments for PKR)
  const getSuggestedBids = () => {
    // For auction products, use the real current highest bid; for regular products, use ProductPrice
    const currentBid = isFromAuction
      ? getCurrentHighestBid()
      : product?.ProductPrice || 0;

    // Determine appropriate increments based on PKR price range
    let increment1, increment2, increment3;

    if (currentBid < 10000) {
      // For prices under 10k PKR, use 500, 1000, 2500 increments
      increment1 = 500;
      increment2 = 1000;
      increment3 = 2500;
    } else if (currentBid < 100000) {
      // For prices 10k-100k PKR, use 1000, 2500, 5000 increments
      increment1 = 1000;
      increment2 = 2500;
      increment3 = 5000;
    } else if (currentBid < 500000) {
      // For prices 100k-500k PKR, use 5000, 10000, 25000 increments
      increment1 = 5000;
      increment2 = 10000;
      increment3 = 25000;
    } else {
      // For prices over 500k PKR, use 10000, 25000, 50000 increments
      increment1 = 10000;
      increment2 = 25000;
      increment3 = 50000;
    }

    return [
      {
        amount: Number(currentBid) + increment1,
        label: `Bid PKR ${(Number(currentBid) + increment1).toLocaleString()}`,
      },
      {
        amount: Number(currentBid) + increment2,
        label: `Bid PKR ${(Number(currentBid) + increment2).toLocaleString()}`,
      },
      {
        amount: Number(currentBid) + increment3,
        label: `Bid PKR ${(Number(currentBid) + increment3).toLocaleString()}`,
      },
    ];
  };

  const handleSuggestedBid = (amount) => {
    setBidAmount(amount.toString());
  };

  const handleBidAmountChange = (e) => {
    const value = e.target.value;
    const currentBid = isFromAuction
      ? getCurrentHighestBid()
      : product?.ProductPrice || 0;
    const minBid = currentBid + 1;

    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      const numValue = parseFloat(value) || 0;

      // If user enters a value less than minimum, show warning but allow typing
      if (numValue > 0 && numValue <= currentBid) {
        // Still allow typing but will be validated on submit
        setBidAmount(value);
      } else {
        setBidAmount(value);
      }
    }
  };

  const handleBidSubmit = async () => {
    const currentBid = isFromAuction
      ? getCurrentHighestBid()
      : product?.ProductPrice || 0;

    if (!bidAmount) {
      alert("Please enter a bid amount.");
      return;
    }

    const bidValue = parseFloat(bidAmount);
    if (isNaN(bidValue) || bidValue <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    if (bidValue <= currentBid) {
      alert(
        `Your bid must be higher than the current bid of PKR ${currentBid.toLocaleString()}. Please enter PKR ${
          currentBid + 1
        } or more.`
      );
      return;
    }

    setIsSubmittingBid(true);
    try {
      // Get current user from localStorage or context
      const currentUser = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
      const userName =
        currentUser?.name || currentUser?.username || "Anonymous User";

      // For auction products, we need to use the auction product ID
      const auctionProductId = isFromAuction ? product.productid : null;

      console.log("Product data for bidding:", product);
      console.log("Is auction:", isFromAuction);
      console.log("Auction product ID:", auctionProductId);

      if (!auctionProductId) {
        alert("This product is not available for bidding.");
        return;
      }

      console.log("Submitting bid for auction product ID:", auctionProductId);
      console.log("Bid amount:", bidAmount);
      console.log("User name:", userName);

      console.log(
        "Making API call to:",
        `https://api.certifurb.com/api/auctionproducts/${auctionProductId}/bid`
      );
      console.log("Request body:", {
        bidAmount: parseFloat(bidAmount),
        userName: userName,
        productId: auctionProductId,
      });

      const response = await fetch(
        `https://api.certifurb.com/api/auctionproducts/${auctionProductId}/bid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bidAmount: parseFloat(bidAmount),
            userName: userName,
            productId: auctionProductId,
          }),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update the current highest bid immediately
        setCurrentHighestBid(parseFloat(bidAmount));

        // Update the product price in the UI immediately
        setProduct((prevProduct) => {
          // Parse existing bids
          let existingBids = [];
          try {
            if (prevProduct.bids) {
              existingBids =
                typeof prevProduct.bids === "string"
                  ? JSON.parse(prevProduct.bids)
                  : prevProduct.bids;
              if (!Array.isArray(existingBids)) {
                existingBids = [];
              }
            }
          } catch (error) {
            console.error("Error parsing existing bids:", error);
            existingBids = [];
          }

          // Add the new bid to the array
          const newBid = {
            amount: parseFloat(bidAmount),
            userName: userName,
          };
          const updatedBids = [...existingBids, newBid];

          return {
            ...prevProduct,
            price: parseFloat(bidAmount),
            bids: updatedBids,
          };
        });

        setBidAmount("");
        setShowBidModal(false);
        alert("Bid placed successfully!");

        // Refresh product data to get updated bid count and ensure sync
        fetchProduct();
      } else {
        console.error("Bid submission failed:", data);
        alert(data.message || "Failed to place bid");
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      console.error("Response status:", error.status);
      console.error("Response text:", error.message);
      alert(
        "Failed to place bid. Please try again. Check console for details."
      );
    } finally {
      setIsSubmittingBid(false);
    }
  };

  // Get storage options based on category
  const getStorageOptions = () => {
    if (
      product?.ProductCategory === "Laptop" ||
      product?.ProductCategory === "Desktop PC" ||
      product?.ProductCategory === "Tablet"
    ) {
      return ["128GB", "256GB", "512GB", "1TB", "2TB"];
    } else if (product?.ProductCategory === "Drive") {
      return ["128GB", "256GB", "512GB", "1TB", "2TB", "4TB", "8TB"];
    } else if (product?.ProductCategory === "Mouse") {
      return ["None", "128MB", "256MB", "512MB", "1GB"];
    } else if (product?.ProductCategory === "Printer") {
      return ["A4", "A3", "Letter", "Legal", "Photo"];
    } else if (product?.ProductCategory === "Network") {
      return ["4 Ports", "8 Ports", "16 Ports", "24 Ports", "48 Ports"];
    } else if (product?.ProductCategory === "Keyboard") {
      return ["Full Size", "TKL", "60%", "65%", "Compact"];
    } else if (
      product?.ProductCategory === "LCD" ||
      product?.ProductCategory === "LED"
    ) {
      return ['19"', '21.5"', '24"', '27"', '32"', '43"', '55"', '65"'];
    } else if (product?.ProductCategory === "GOAT Product") {
      return [
        "Premium Sound",
        "1.5M Length",
        "65W",
        "Compact Design",
        "Eco-Friendly",
      ];
    }
    return ["128GB", "256GB"]; // Default fallback
  };

  // Get RAM options based on category
  const getRamOptions = () => {
    if (
      product?.ProductCategory === "Laptop" ||
      product?.ProductCategory === "Desktop PC"
    ) {
      return ["4GB", "8GB", "16GB", "32GB", "64GB"];
    } else if (product?.ProductCategory === "Tablet") {
      return ["2GB", "4GB", "6GB", "8GB", "12GB"];
    } else if (product?.ProductCategory === "Mouse") {
      return ["800 DPI", "1200 DPI", "1600 DPI", "3200 DPI", "6400 DPI"];
    } else if (product?.ProductCategory === "Printer") {
      return ["Black & White", "Color", "Photo Quality", "Draft Quality"];
    } else if (product?.ProductCategory === "Network") {
      return ["10/100 Mbps", "Gigabit", "10 Gigabit", "Wi-Fi 5", "Wi-Fi 6"];
    } else if (product?.ProductCategory === "Keyboard") {
      return ["Wired", "Wireless", "Bluetooth", "USB-C", "USB-A"];
    } else if (
      product?.ProductCategory === "LCD" ||
      product?.ProductCategory === "LED"
    ) {
      return ["HD", "Full HD", "4K", "8K", "Curved"];
    } else if (product?.ProductCategory === "Drive") {
      return ["SATA III", "NVMe", "USB 3.0", "USB 3.1", "Thunderbolt"];
    } else if (product?.ProductCategory === "GOAT Product") {
      return [
        "Bluetooth 5.0",
        "USB-C",
        "Universal Compatible",
        "Noise Cancelling",
        "Bass Boosted",
      ];
    }
    return ["8GB", "16GB"]; // Default fallback
  };

  // Get keyboard options based on category
  const getKeyboardOptions = () => {
    if (
      product?.ProductCategory === "Laptop" ||
      product?.ProductCategory === "Desktop PC"
    ) {
      return [
        "English",
        "English & Arabic",
        "Backlit English",
        "Backlit English & Arabic",
      ];
    } else if (product?.ProductCategory === "Keyboard") {
      return ["Mechanical", "Membrane", "Wireless", "Gaming", "Ergonomic"];
    } else if (product?.ProductCategory === "Mouse") {
      return ["Wired", "Wireless", "Gaming", "Ergonomic", "Optical"];
    } else if (product?.ProductCategory === "Printer") {
      return ["Inkjet", "Laser", "All-in-One", "Photo Printer", "3D Printer"];
    } else if (product?.ProductCategory === "Network") {
      return ["Router", "Switch", "Access Point", "Modem", "Network Card"];
    } else if (product?.ProductCategory === "Drive") {
      return ["SSD", "HDD", "USB Drive", "External Drive", "M.2 SSD"];
    } else if (product?.ProductCategory === "Tablet") {
      return ["Android", "iOS", "Windows", "Fire OS", "Chrome OS"];
    } else if (
      product?.ProductCategory === "LCD" ||
      product?.ProductCategory === "LED"
    ) {
      return ["IPS", "VA", "TN", "OLED", "QLED"];
    } else if (product?.ProductCategory === "GOAT Product") {
      return ["Wireless", "Wired", "In-Ear", "Over-Ear", "Fast Charging"];
    }
    return ["English"]; // Default fallback
  };

  // Get screen size options based on category
  const getScreenSizeOptions = () => {
    if (product?.ProductCategory === "Laptop") {
      return ['13"', '14"', '15.6"', '17"'];
    } else if (product?.ProductCategory === "Desktop PC") {
      return ["No Display", "Integrated Display"];
    } else if (
      product?.ProductCategory === "LCD" ||
      product?.ProductCategory === "LED"
    ) {
      return ["60Hz", "75Hz", "120Hz", "144Hz", "240Hz"];
    } else if (product?.ProductCategory === "Tablet") {
      return ['7"', '8"', '10"', '11"', '12.9"'];
    } else if (product?.ProductCategory === "Mouse") {
      return ["Standard", "Ergonomic", "Ambidextrous", "Left-handed", "Gaming"];
    } else if (product?.ProductCategory === "Printer") {
      return ["USB", "Wi-Fi", "Ethernet", "Bluetooth", "All Connectivity"];
    } else if (product?.ProductCategory === "Network") {
      return ["10m", "50m", "100m", "300m", "1km"];
    } else if (product?.ProductCategory === "Keyboard") {
      return [
        "RGB Backlit",
        "Single Backlit",
        "No Backlight",
        "Programmable",
        "Hot-swappable",
      ];
    } else if (product?.ProductCategory === "Drive") {
      return ["Up to 1TB", "1TB - 4TB", "4TB - 8TB", "8TB+", "Various"];
    } else if (product?.ProductCategory === "GOAT Product") {
      return [
        "Sustainable",
        "Rechargeable",
        "Lightweight",
        "Durable",
        "Warranty Included",
      ];
    }
    return ['14"']; // Default fallback
  };

  // Get field labels based on category
  const getFieldLabels = () => {
    if (product?.ProductCategory === "Mouse") {
      return { field1: "Type", field2: "DPI" };
    } else if (product?.ProductCategory === "Printer") {
      return {
        field1: "Type",
        field2: "Print Quality",
        field3: "Paper Size",
        field4: "Connectivity",
      };
    } else if (product?.ProductCategory === "Network") {
      return {
        field1: "Device Type",
        field2: "Speed",
        field3: "Ports",
        field4: "Range",
      };
    } else if (product?.ProductCategory === "Keyboard") {
      return {
        field1: "Switch Type",
        field2: "Connectivity",
        field3: "Layout",
        field4: "Features",
      };
    } else if (
      product?.ProductCategory === "LCD" ||
      product?.ProductCategory === "LED"
    ) {
      return {
        field1: "Panel Type",
        field2: "Resolution",
        field3: "Screen Size",
        field4: "Refresh Rate",
      };
    } else if (product?.ProductCategory === "Drive") {
      return {
        field1: "Drive Type",
        field2: "Interface",
        field3: "Form Factor",
        field4: "Capacity Range",
      };
    } else if (product?.ProductCategory === "Tablet") {
      return {
        field1: "Operating System",
        field2: "RAM",
        field3: "Storage",
        field4: "Screen Size",
      };
    } else if (product?.ProductCategory === "Desktop PC") {
      return {
        field1: "Keyboard Type",
        field2: "RAM",
        field3: "Storage",
        field4: "Screen",
      };
    } else if (product?.ProductCategory === "Laptop") {
      return { field1: "CPU", field2: "RAM", field3: "Storage" };
    } else if (product?.ProductCategory === "GOAT Product") {
      return {
        field1: "Type",
        field2: "Technology",
        field3: "Features",
        field4: "Eco-Attributes",
      };
    }
    return {
      field1: "Keyboard",
      field2: "RAM",
      field3: "Storage",
      field4: "Screen Size",
    }; // Default fallback
  };

  // Get field values based on category - maps correct product fields to display
  const getFieldValues = () => {
    if (!product) return {};

    if (product.ProductCategory === "Mouse") {
      return {
        field1: product.ProductKeyboard, // Using as "Type" for mouse
        field2: product.ProductRam, // Using as "DPI" for mouse
      };
    } else if (product.ProductCategory === "Printer") {
      return {
        field1: product.ProductKeyboard, // Using as "Type" for printer
        field2: product.ProductRam, // Using as "Print Quality" for printer
        field3: product.ProductStorage, // Using as "Paper Size" for printer
        field4: product.ProductScreenSize, // Using as "Connectivity" for printer
      };
    } else if (product.ProductCategory === "Network") {
      return {
        field1: product.ProductKeyboard, // Using as "Device Type" for network
        field2: product.ProductRam, // Using as "Speed" for network
        field3: product.ProductStorage, // Using as "Ports" for network
        field4: product.ProductScreenSize, // Using as "Range" for network
      };
    } else if (product.ProductCategory === "Keyboard") {
      return {
        field1: product.ProductKeyboard, // Using as "Switch Type" for keyboard
        field2: product.ProductRam, // Using as "Connectivity" for keyboard
        field3: product.ProductStorage, // Using as "Layout" for keyboard
        field4: product.ProductScreenSize, // Using as "Features" for keyboard
      };
    } else if (
      product.ProductCategory === "LCD" ||
      product.ProductCategory === "LED"
    ) {
      return {
        field1: product.ProductKeyboard, // Using as "Panel Type" for monitor
        field2: product.ProductResolution || product.ProductRam, // Resolution or fallback to RAM field
        field3: product.ProductScreenSize, // Screen Size for monitor
        field4: product.ProductStorage, // Using as "Refresh Rate" for monitor
      };
    } else if (product.ProductCategory === "Drive") {
      return {
        field1: product.ProductKeyboard, // Using as "Drive Type" for drive
        field2: product.ProductRam, // Using as "Interface" for drive
        field3: product.ProductStorage, // Using as "Form Factor" for drive
        field4: product.ProductScreenSize, // Using as "Capacity Range" for drive
      };
    } else if (product.ProductCategory === "Tablet") {
      return {
        field1: product.ProductKeyboard, // Using as "Operating System" for tablet
        field2: product.ProductRam, // RAM for tablet
        field3: product.ProductStorage, // Storage for tablet
        field4: product.ProductScreenSize, // Screen Size for tablet
      };
    } else if (product.ProductCategory === "Desktop PC") {
      return {
        field1: product.ProductKeyboard, // Keyboard Type for desktop
        field2: product.ProductRam, // RAM for desktop
        field3: product.ProductStorage, // Storage for desktop
        field4: product.ProductScreenSize, // Screen for desktop
      };
    } else if (product.ProductCategory === "Laptop") {
      return {
        field1: product.ProductCpu, // CPU for laptop
        field2: product.ProductRam, // RAM for laptop
        field3: product.ProductStorage, // Storage for laptop
      };
    } else if (product.ProductCategory === "GOAT Product") {
      return {
        field1: product.ProductKeyboard, // Using as "Type" for GOAT product
        field2: product.ProductRam, // Using as "Technology" for GOAT product
        field3: product.ProductStorage, // Using as "Features" for GOAT product
        field4: product.ProductScreenSize, // Using as "Eco-Attributes" for GOAT product
      };
    }

    // Default fallback for laptops and other devices
    return {
      field1: product.ProductKeyboard,
      field2: product.ProductRam,
      field3: product.ProductStorage,
      field4: product.ProductScreenSize,
    };
  };

  // Helper function to determine how many fields to show for each category
  const getFieldCount = () => {
    if (!product) return 0;

    // Special handling for laptops - show only 3 fields (CPU, RAM, Storage)
    if (product.ProductCategory === "Laptop") {
      return 3;
    }

    // Count how many fields have values for other categories
    let count = 0;
    if (product.ProductField1) count++;
    if (product.ProductField2) count++;
    if (product.ProductField3) count++;
    if (product.ProductField4) count++;

    return count;
  };

  // Create technical specifications from database data
  const getTechnicalSpecs = () => {
    if (!product) return [];

    const specs = [];

    // Add common specs for all products
    if (product.ProductModel)
      specs.push({ label: "Model", value: product.ProductModel });
    if (product.ProductBrand)
      specs.push({ label: "Brand", value: product.ProductBrand });

    // Add category-specific specs with appropriate labels
    if (
      product.ProductCategory === "LCD" ||
      product.ProductCategory === "LED"
    ) {
      // Monitor-specific specifications
      if (product.ProductKeyboard)
        specs.push({ label: "Panel Type", value: product.ProductKeyboard });
      if (product.ProductRam)
        specs.push({ label: "Resolution", value: product.ProductRam });
      if (product.ProductScreenSize)
        specs.push({ label: "Refresh Rate", value: product.ProductScreenSize });
      if (product.ProductStorage)
        specs.push({
          label: "Display Technology",
          value: product.ProductStorage,
        });
      if (product.ProductWeight)
        specs.push({ label: "Weight", value: product.ProductWeight });
      if (product.ProductResolution)
        specs.push({
          label: "Native Resolution",
          value: product.ProductResolution,
        });
    } else if (product.ProductCategory === "Mouse") {
      // Mouse-specific specifications
      if (product.ProductKeyboard)
        specs.push({ label: "Mouse Type", value: product.ProductKeyboard });
      if (product.ProductRam)
        specs.push({ label: "DPI", value: product.ProductRam });
      if (product.ProductStorage)
        specs.push({ label: "Connection Type", value: product.ProductStorage });
      if (product.ProductWeight)
        specs.push({ label: "Weight", value: product.ProductWeight });
    } else if (product.ProductCategory === "Keyboard") {
      // Keyboard-specific specifications
      if (product.ProductKeyboard)
        specs.push({ label: "Switch Type", value: product.ProductKeyboard });
      if (product.ProductRam)
        specs.push({ label: "Connectivity", value: product.ProductRam });
      if (product.ProductStorage)
        specs.push({ label: "Layout", value: product.ProductStorage });
      if (product.ProductScreenSize)
        specs.push({ label: "Features", value: product.ProductScreenSize });
      if (product.ProductWeight)
        specs.push({ label: "Weight", value: product.ProductWeight });
    } else if (product.ProductCategory === "Printer") {
      // Printer-specific specifications
      if (product.ProductKeyboard)
        specs.push({ label: "Printer Type", value: product.ProductKeyboard });
      if (product.ProductRam)
        specs.push({ label: "Print Quality", value: product.ProductRam });
      if (product.ProductStorage)
        specs.push({ label: "Paper Size", value: product.ProductStorage });
      if (product.ProductScreenSize)
        specs.push({ label: "Connectivity", value: product.ProductScreenSize });
      if (product.ProductWeight)
        specs.push({ label: "Weight", value: product.ProductWeight });
    } else if (product.ProductCategory === "Network") {
      // Network device specifications
      if (product.ProductKeyboard)
        specs.push({ label: "Device Type", value: product.ProductKeyboard });
      if (product.ProductRam)
        specs.push({ label: "Speed", value: product.ProductRam });
      if (product.ProductStorage)
        specs.push({ label: "Ports", value: product.ProductStorage });
      if (product.ProductScreenSize)
        specs.push({ label: "Range", value: product.ProductScreenSize });
      if (product.ProductWeight)
        specs.push({ label: "Weight", value: product.ProductWeight });
    } else if (product.ProductCategory === "Drive") {
      // Drive specifications
      if (product.ProductKeyboard)
        specs.push({ label: "Drive Type", value: product.ProductKeyboard });
      if (product.ProductRam)
        specs.push({ label: "Interface", value: product.ProductRam });
      if (product.ProductStorage)
        specs.push({ label: "Capacity", value: product.ProductStorage });
      if (product.ProductScreenSize)
        specs.push({ label: "Form Factor", value: product.ProductScreenSize });
      if (product.ProductWeight)
        specs.push({ label: "Weight", value: product.ProductWeight });
    } else if (product.ProductCategory === "Tablet") {
      // Tablet specifications
      if (product.ProductKeyboard)
        specs.push({
          label: "Operating System",
          value: product.ProductKeyboard,
        });
      if (product.ProductRam)
        specs.push({ label: "RAM", value: product.ProductRam });
      if (product.ProductStorage)
        specs.push({ label: "Storage", value: product.ProductStorage });
      if (product.ProductScreenSize)
        specs.push({ label: "Screen Size", value: product.ProductScreenSize });
      if (product.ProductCpu)
        specs.push({ label: "Processor", value: product.ProductCpu });
      if (product.ProductWeight)
        specs.push({ label: "Weight", value: product.ProductWeight });
      if (product.ProductBattery)
        specs.push({ label: "Battery", value: product.ProductBattery });
      if (product.ProductCamera)
        specs.push({ label: "Camera", value: product.ProductCamera });
    } else if (product.ProductCategory === "GOAT Product") {
      // GOAT Product specifications
      if (product.ProductKeyboard)
        specs.push({ label: "Product Type", value: product.ProductKeyboard });
      if (product.ProductRam)
        specs.push({ label: "Technology", value: product.ProductRam });
      if (product.ProductStorage)
        specs.push({ label: "Features", value: product.ProductStorage });
      if (product.ProductScreenSize)
        specs.push({
          label: "Eco-Attributes",
          value: product.ProductScreenSize,
        });
      if (product.ProductWeight)
        specs.push({ label: "Weight", value: product.ProductWeight });
    } else {
      // Default for Laptop and Desktop PC
      if (product.ProductCpu)
        specs.push({ label: "CPU", value: product.ProductCpu });
      if (product.ProductRam)
        specs.push({ label: "RAM", value: product.ProductRam });
      if (product.ProductStorage)
        specs.push({ label: "Storage", value: product.ProductStorage });
      if (product.ProductGraphics)
        specs.push({ label: "Graphics", value: product.ProductGraphics });
      if (product.ProductScreenSize)
        specs.push({ label: "Screen Size", value: product.ProductScreenSize });
      if (product.ProductResolution)
        specs.push({ label: "Resolution", value: product.ProductResolution });
      if (product.ProductOs)
        specs.push({ label: "Operating System", value: product.ProductOs });
      if (product.ProductWeight)
        specs.push({ label: "Weight", value: product.ProductWeight });
      if (product.ProductBattery)
        specs.push({ label: "Battery", value: product.ProductBattery });
      if (product.ProductKeyboard)
        specs.push({ label: "Keyboard", value: product.ProductKeyboard });
      if (product.ProductBluetooth)
        specs.push({ label: "Bluetooth", value: product.ProductBluetooth });
      if (product.ProductWifi)
        specs.push({ label: "WiFi", value: product.ProductWifi });
      if (product.ProductCamera)
        specs.push({ label: "Camera", value: product.ProductCamera });
      if (product.ProductAudio)
        specs.push({ label: "Audio", value: product.ProductAudio });
    }

    return specs;
  };

  const handleAddToCart = () => {
    console.log("Add to cart clicked");
    console.log("Product category:", product.ProductCategory);

    // Get field values from product data
    const values = getFieldValues();
    console.log("Field values from product:", values);

    // Create selected options with fallbacks for missing values
    const selectedOptions = {
      field1: values.field1 || "Default",
      field2: values.field2 || "Default",
      field3: getFieldCount() > 2 ? values.field3 || "Default" : "Default",
      field4: getFieldCount() > 3 ? values.field4 || "Default" : "Default",
      // Keep legacy format for compatibility
      storage: getFieldCount() > 2 ? values.field3 || "Default" : "Default",
      ram: values.field2 || "Default",
      keyboard: values.field1 || "Default",
      screenSize: getFieldCount() > 3 ? values.field4 || "Default" : "Default",
    };

    console.log("📦 About to call addToCart with:", {
      product,
      selectedOptions,
    });

    try {
      addToCart(product, selectedOptions);
      console.log("✅ addToCart function called successfully");

      // Show notification
      console.log("📢 Setting notification to true");
      setAddToCartNotification(true);
      setTimeout(() => {
        console.log("📢 Setting notification to false");
        setAddToCartNotification(false);
      }, 3000);

      console.log("🎉 Add to cart process completed!");
    } catch (error) {
      console.error("❌ Error in addToCart:", error);
    }
  };

  if (loading) {
    return (
      <div
        className={`${font.className} bg-[#fafbfc] min-h-screen flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            Loading product...
          </div>
          <div className="text-gray-600">
            Please wait while we fetch the product details
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        className={`${font.className} bg-[#fafbfc] min-h-screen flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">
            Product Not Found
          </div>
          <div className="text-gray-600 mb-4">
            {error || "The product you are looking for does not exist"}
          </div>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`${font.className} min-h-screen`}>
      <Navbar />

      {/* Add to Cart Success Notification */}
      {addToCartNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <FaCheckCircle />
          <span>Product added to cart successfully!</span>
        </div>
      )}

      <div className="max-w-[1300px] mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Debug info - remove this after testing */}
        {/* <div className="bg-yellow-100 border border-yellow-400 p-2 rounded text-sm">
          <strong>Debug:</strong> Product Category = "{product.ProductCategory}" (length: {product.ProductCategory?.length}) | 
          Trimmed/Lower = "{product.ProductCategory?.toLowerCase().trim()}" |
          Layout = {product.ProductCategory?.toLowerCase().trim() === 'mobile' ? 'Mobile (Vertical)' : 'Laptop (Side-by-side)'}
        </div> */}

        {/* Conditional Layout based on Product Category */}
        {product.ProductCategory?.toLowerCase().trim() === "mobile" ? (
          // Mobile Layout - Same as laptop layout (side by side)
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8">
            <div className="w-full md:w-[55%] lg:w-[700px] flex flex-col gap-4">
              <div className="bg-white rounded-xl border border-gray-500 p-2 md:p-4 flex flex-col md:flex-row gap-4 md:gap-8 items-start min-h-[360px]">
                <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto justify-center md:justify-start">
                  <span className="left-0 bg-[#00e676] mb-2 md:mb-4 text-white text-sm font-bold py-1 px-3 rounded-full z-10 whitespace-nowrap min-w-[110px] text-center">
                    -45% vs. new
                  </span>
                  <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                    {productImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Product Thumbnail"
                        className={`w-16 h-16 md:w-20 lg:w-24 md:h-20 lg:h-24 object-contain rounded-lg border-2 p-1 md:p-2 cursor-pointer flex-shrink-0 ${
                          selectedImage === idx
                            ? "border-[#00e676]"
                            : "border-gray-500"
                        }`}
                        onClick={() => setSelectedImage(idx)}
                      />
                    ))}
                  </div>
                </div>
                <div className="relative flex items-center bg-gray-100 justify-center min-h-[300px] md:min-h-[450px] w-full">
                  <img
                    src={productImages[selectedImage]}
                    alt={product.ProductName}
                    className="object-contain h-[250px] md:h-[320px] mx-auto"
                  />
                  <img
                    src="/certified-badge.png"
                    alt="Certified Badge"
                    className="absolute top-0 right-0 w-16 h-16 md:w-20 lg:w-24 md:h-20 lg:h-24 object-contain"
                    style={{ transform: "translate(10%,-10%)" }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-2">
                {!isFromAuction && (
                  <>
                    {features.map((f, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl border border-gray-300 flex flex-col items-center justify-center py-4 md:py-6 px-2 text-center"
                      >
                        {f.icon}
                        <span className="text-xs md:text-sm font-semibold mt-2 text-black">
                          {f.label}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
              {/* Reviews Section */}
              {!isFromAuction && (
                <div className="mt-4 md:mt-6">
                  <div className="bg-white rounded-xl p-4 md:p-6">
                    {/* Reviews Header */}
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <h2 className="text-lg md:text-xl font-bold text-gray-900">
                        Reviews ({reviews.length})
                      </h2>
                      <button className="text-[#00e676] text-sm font-medium hover:underline">
                        View All
                      </button>
                    </div>

                    {/* Reviews List */}
                    {isLoadingReviews ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-gray-500">Loading reviews...</div>
                      </div>
                    ) : reviews.length === 0 ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-gray-500">
                          No reviews yet. Be the first to review!
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {reviews.map((review, index) => (
                          <div
                            key={index}
                            className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200 last:border-b-0"
                          >
                            <div className="flex-1">
                              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                                {review.reviewText}
                              </p>
                              <span className="text-xs text-gray-400">
                                {review.userName || "Anonymous User"}
                              </span>
                            </div>

                            {/* Display user images */}
                            <div className="flex items-center gap-2">
                              {review.imageUrls &&
                              review.imageUrls.length > 0 ? (
                                <>
                                  {/* First image */}
                                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded border overflow-hidden">
                                    <img
                                      src={review.imageUrls[0]}
                                      alt="Review image"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>

                                  {/* Additional images indicator */}
                                  {review.imageUrls.length > 1 && (
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded border flex items-center justify-center">
                                      <span className="text-gray-400 text-xs font-bold">
                                        +{review.imageUrls.length - 1}
                                      </span>
                                    </div>
                                  )}
                                </>
                              ) : (
                                // Fallback icon if no images
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded border flex items-center justify-center">
                                  <FaLaptop className="text-gray-400 text-sm md:text-lg" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1 md:ml-4 lg:ml-8 max-w-full md:max-w-[45%] lg:max-w-[600px] flex flex-col gap-4 self-stretch">
              <div className=" rounded-xl border border-gray-500 p-4 md:p-6 flex flex-col gap-4 relative">
                <div>
                  <div className="font-bold text-lg md:text-xl text-gray-900 mb-1">
                    {isFromAuction
                      ? product?.product_name || product?.ProductName
                      : product?.ProductName}
                  </div>
                  <div className="text-base font-bold text-gray-900 mb-4">
                    {isFromAuction
                      ? convertPriceString(`PKR ${getCurrentHighestBid()}`)
                      : convertPriceString(`PKR ${product?.ProductPrice}`)}
                    <span className="text-gray-400 font-normal line-through ml-2 text-sm md:text-base">
                      {isFromAuction
                        ? convertPriceString(
                            `PKR ${Math.round(getCurrentHighestBid() * 1.2)}`
                          )
                        : convertPriceString(
                            `PKR ${Math.round(product?.ProductPrice * 1.2)}`
                          )}
                    </span>
                  </div>
                  {!isFromAuction && (
                    <>
                      {/* Field 1 */}
                      <div className="mb-3">
                        <p>This Product Is </p>
                        <div className="font-bold text-gray-700 text-sm mb-1">
                          {getFieldLabels().field1}:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {getFieldValues().field1 && (
                            <button
                              className="bg-[#e6f9f0] border-[#00e676] text-[#00e676] flex-1 min-w-0 md:flex-initial md:min-w-[80px] lg:min-w-[100px] px-2 md:px-3 lg:px-4 py-2 md:py-3 rounded-lg border text-xs md:text-sm font-bold"
                              disabled
                            >
                              {getFieldValues().field1}
                            </button>
                          )}
                        </div>
                      </div>
                      {/* Field 2 */}
                      <div className="mb-3">
                        <div className="font-bold text-gray-700 text-sm mb-1">
                          {getFieldLabels().field2}:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {getFieldValues().field2 && (
                            <button
                              className="bg-[#e6f9f0] border-[#00e676] text-[#00e676] flex-1 min-w-0 md:flex-initial md:min-w-[80px] lg:min-w-[100px] px-2 md:px-4 lg:px-6 py-2 md:py-3 rounded-lg border text-xs md:text-sm font-bold"
                              disabled
                            >
                              {getFieldValues().field2}
                            </button>
                          )}
                        </div>
                      </div>
                      {/* Field 3 */}
                      {getFieldCount() > 2 && (
                        <div className="mb-3">
                          <div className="font-bold text-gray-700 text-sm mb-1">
                            {getFieldLabels().field3}:
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {getFieldValues().field3 && (
                              <button
                                className="bg-[#e6f9f0] border-[#00e676] text-[#00e676] flex-1 min-w-0 md:flex-initial md:min-w-[80px] lg:min-w-[100px] px-2 md:px-4 lg:px-6 py-2 md:py-3 rounded-lg border text-xs md:text-sm font-bold"
                                disabled
                              >
                                {getFieldValues().field3}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                      {/* Field 4 */}
                      {getFieldCount() > 3 && (
                        <div className="mb-4">
                          <div className="font-bold text-gray-700 text-sm mb-1">
                            {getFieldLabels().field4}:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {getFieldValues().field4 && (
                              <button
                                className="bg-[#e6f9f0] border-[#00e676] text-[#00e676] flex-1 min-w-0 md:flex-initial md:min-w-[80px] lg:min-w-[100px] px-2 md:px-4 lg:px-6 py-2 md:py-3 rounded-lg border text-xs md:text-sm font-bold"
                                disabled
                              >
                                {getFieldValues().field4}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Conditional buttons based on auction context */}
                {isFromAuction ? (
                  <>
                    {/* --- Redesigned Auction Info Section --- */}
                    <div className=" rounded-xl p-4 flex flex-col gap-4 shadow-md">
                      {/* Price, Bids, End Time */}
                      <div className="flex flex-col gap-1 mt-2">
                        <div className="text-3xl font-bold text-gray-900">
                          PKR {getCurrentHighestBid().toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
                          <span
                            className="text-blue-600 hover:underline cursor-pointer"
                            onClick={() =>
                              router.push(`/auction/${product.productid}/bids`)
                            }
                          >
                            {getAuctionBidCount()} bids
                          </span>
                          <span className="text-gray-400">·</span>
                          <span>
                            {(() => {
                              if (isAuctionEnded()) {
                                return "Auction ended";
                              }
                              const timeRemaining = getAuctionTimeRemaining();
                              if (
                                timeRemaining.hours === 0 &&
                                timeRemaining.minutes === 0 &&
                                timeRemaining.seconds === 0
                              ) {
                                return "Auction ended";
                              }
                              return `Ends in ${timeRemaining.hours}h ${String(
                                timeRemaining.minutes
                              ).padStart(2, "0")}m`;
                            })()}
                          </span>
                          <span className="text-gray-400">·</span>
                          <span>{getAuctionEndDate()}</span>
                        </div>
                      </div>

                      {/* Condition */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-semibold text-gray-700">
                          Condition:
                        </span>
                        <span className="text-green-700 font-bold">New</span>
                      </div>

                      {/* Place Bid Button - Only show if auction is active */}
                      {!isAuctionEnded() ? (
                        <div className="flex space-x-2 justify-center">
                          <button
                            onClick={() => setShowBidModal(true)}
                            className="w-[50%] mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow transition text-lg flex items-center justify-center"
                          >
                            Place bid
                          </button>

                          {/* Add to Watchlist */}
                          <button className="w-[50%] mt-2 border border-blue-600 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2 py-3 px-4 text-lg">
                            <svg
                              width="18"
                              height="18"
                              fill="none"
                              viewBox="0 0 24 24"
                              className="flex-shrink-0"
                            >
                              <path
                                d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span>Add to Watchlist</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2 justify-center">
                          <div className="w-full mt-2 bg-red-100 text-red-700 font-bold py-3 px-4 rounded-lg flex items-center justify-center text-lg">
                            Auction Ended
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Delivery, Return, and Payments Sections */}
                    <div className="mt-4 md:mt-6 space-y-3">
                      {/* Delivery Section */}
                      <div className="bg-white rounded-xl border border-gray-300 shadow p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">
                            Delivery
                          </span>
                          <span className="text-gray-700">Varies</span>
                        </div>
                      </div>

                      {/* Return Section */}
                      <div className="bg-white rounded-xl border border-gray-300 shadow p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">
                            Return
                          </span>
                          <span className="text-red-600 font-medium">
                            No return!
                          </span>
                        </div>
                      </div>

                      {/* Payments Section */}
                      <div className="bg-white rounded-xl border border-gray-300 shadow p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">
                            Payments
                          </span>
                          <div className="flex gap-2">
                            <div className="bg-white rounded p-1 border">
                              <img
                                src="/easypaisa.png"
                                alt="EasyPaisa"
                                className="h-5 w-auto"
                                onError={(e) =>
                                  (e.target.style.display = "none")
                                }
                              />
                            </div>
                            <div className="bg-white rounded p-1 border">
                              <img
                                src="/sada.png"
                                alt="Sada"
                                className="h-5 w-auto"
                                onError={(e) =>
                                  (e.target.style.display = "none")
                                }
                              />
                            </div>
                            <div className="bg-white rounded p-1 border">
                              <img
                                src="/nayapay.png"
                                alt="NayaPay"
                                className="h-5 w-auto"
                                onError={(e) =>
                                  (e.target.style.display = "none")
                                }
                              />
                            </div>
                            <div className="bg-white rounded p-1 border">
                              <img
                                src="/mc.png"
                                alt="Mastercard"
                                className="h-5 w-auto"
                                onError={(e) =>
                                  (e.target.style.display = "none")
                                }
                              />
                            </div>
                            <div className="bg-white rounded p-1 border">
                              <img
                                src="/visa.png"
                                alt="Visa"
                                className="h-5 w-auto"
                                onError={(e) =>
                                  (e.target.style.display = "none")
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Shop with Confidence Section */}
                      <div className="pt-4 mt-4">
                        <div className="flex items-start gap-2">
                          <svg
                            className="mt-0.5 text-gray-600"
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="m9 12 2 2 4-4"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              Shop with confidence
                            </p>
                            <p className="text-sm text-gray-600">
                              Certifurb Money Back Guarantee – Get the item you
                              ordered or your money back.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Regular store buttons */}
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-gradient-to-b from-[#6adb4d] via-[#54b056] to-[#468e5d] text-white font-bold py-3 rounded-lg shadow hover:from-[#468e5d] via-[#54b056] hover:to-[#6adb4d] transition text-base md:text-lg"
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={() =>
                        router.push(`/comparison?product1=${product.ProductID}`)
                      }
                      className="w-full mt-3 bg-gradient-to-b from-[#6adb4d] via-[#54b056] to-[#468e5d] text-white font-bold py-3 rounded-lg shadow hover:from-[#468e5d] via-[#54b056] hover:to-[#6adb4d] transition text-base md:text-lg"
                    >
                      Compare Product
                    </button>
                  </>
                )}
              </div>

              {!isFromAuction && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-white rounded-lg border border-gray-200 flex flex-row items-center justify-center py-3 px-3 text-center hover:border-gray-300 transition-colors">
                    <span className="text-green-600 text-sm font-medium mr-2">✓</span>
                    <span className="text-xs font-medium text-gray-700">
                      What's Included
                    </span>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 flex flex-row items-center justify-center py-3 px-3 text-center hover:border-gray-300 transition-colors">
                    <MdCable className="text-gray-600 text-lg mr-2" />
                    <span className="text-xs font-medium text-gray-700">
                      Charger
                    </span>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 flex flex-row items-center justify-center py-3 px-3 text-center hover:border-gray-300 transition-colors">
                    <FaLaptop className="text-gray-600 text-lg mr-2" />
                    <span className="text-xs font-medium text-gray-700">
                      {product.ProductCategory}
                    </span>
                  </div>
                </div>
              )}

              {/* Technical Specifications - Always show for all products (Mobile Layout) */}
              {!isFromAuction && (
                <div className="mt-4 md:mt-6">
                  <div className="bg-white rounded-xl border border-gray-300 shadow p-4 md:p-6">
                    <button
                      className="flex items-center justify-between w-full font-bold text-base md:text-lg text-gray-900 focus:outline-none"
                      onClick={() => setShowSpecs((s) => !s)}
                    >
                      Technical Specifications
                      <FaChevronUp
                        className={`ml-2 transition-transform duration-200 ${
                          showSpecs ? "" : "rotate-180"
                        }`}
                      />
                    </button>
                    {showSpecs && (
                      <div className="mt-4 flex flex-col gap-y-1 text-xs">
                        {getTechnicalSpecs().length > 0 ? (
                          getTechnicalSpecs().map((spec, i) => (
                            <div key={i} className="flex gap-2 mb-1">
                              <span className="font-bold text-gray-900 min-w-[120px]">
                                {spec.label}
                              </span>
                              <span className="text-gray-700">
                                {spec.value}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 text-sm italic py-2">
                            Technical specifications will be updated soon.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Laptop Layout - Side by Side (Current layout)
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8">
            <div className="w-full md:w-[55%] lg:w-[700px] flex flex-col gap-4">
              <div className="rounded-xl p-2 md:p-8 flex flex-col md:flex-row gap-4 md:gap-8 items-start min-h-[360px]">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row gap-4">
                    <div className="flex bg-white flex-row md:flex-col gap-2 w-full md:w-auto justify-center md:justify-start">
                      <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                        {productImages.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt="Product Thumbnail"
                            className={`w-16 h-16 md:w-20 lg:w-24 md:h-20 lg:h-24 object-contain rounded-lg border-2 p-1 md:p-2 cursor-pointer flex-shrink-0 ${
                              selectedImage === idx
                                ? "border-[#00e676]"
                                : "border-gray-500"
                            }`}
                            onClick={() => setSelectedImage(idx)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="relative flex flex-col bg-white items-start justify-start min-h-[300px] md:min-h-[450px] w-full">
                      <span className="left-0 ml-4 bg-[#00e676] mb-2 md:mb-4 text-white text-sm font-bold py-1 px-3 rounded-full z-10 whitespace-nowrap min-w-[110px] text-center">
                        -45% vs. new
                      </span>
                      <img
                        src={productImages[selectedImage]}
                        alt={product.ProductName}
                        className="object-contain h-[250px] md:h-[320px] mx-auto"
                      />
                      <img
                        src="/certified-badge.png"
                        alt="Certified Badge"
                        className="absolute top-0 right-0 w-16 h-16 md:w-20 lg:w-24 md:h-20 lg:h-24 object-contain"
                        style={{ transform: "translate(10%,-10%)" }}
                      />
                    </div>
                  </div>

                  <div>
                    {isFromAuction && (
                      <div className="bg-gray-100 p-4">
                        <div className="flex flex-col items-center">
                          <svg
                            className="w-8 h-8 text-gray-800 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M20 12V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4"
                            />
                          </svg>
                          <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            What's Included
                          </h2>
                        </div>
                        <div className="bg-white border rounded-lg p-4 max-w-xl mx-auto shadow-sm text-sm space-y-3 text-gray-800">
                          <ul className="list-disc list-inside text-gray-700">
                            {Array.isArray(product.included_items) && product.included_items.length > 0 ? (
                              product.included_items.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))
                            ) : (
                              <>
                                <li>Charger</li>
                                <li>Laptop</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 mt-2 gap-2">
                {!isFromAuction && (
                  <>
                    {features.map((f, i) => (
                      <div
                        key={i}
                        className="bg-white space-x-2 rounded-xl border border-gray-300 flex flex-row items-center justify-center py-4 px-2 text-center"
                      >
                        <div className="">
                          {f.icon}
                        </div>
                        <span className="text-xs font-semibold text-black">
                          {f.label}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Reviews Section */}
              {!isFromAuction && (
                <div className="mt-4 md:mt-6">
                  <div className="bg-white rounded-xl p-4 md:p-6">
                    {/* Reviews Header */}
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <h2 className="text-lg md:text-xl font-bold text-gray-900">
                        Reviews ({reviews.length})
                      </h2>
                      <button className="text-[#00e676] text-sm font-medium hover:underline">
                        View All
                      </button>
                    </div>

                    {/* Reviews List */}
                    {isLoadingReviews ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-gray-500">Loading reviews...</div>
                      </div>
                    ) : reviews.length === 0 ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-gray-500">
                          No reviews yet. Be the first to review!
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {reviews.map((review, index) => (
                          <div
                            key={index}
                            className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200 last:border-b-0"
                          >
                            <div className="flex-1">
                              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                                {review.reviewText}
                              </p>
                              <span className="text-xs text-gray-400">
                                {review.userName || "Anonymous User"}
                              </span>
                            </div>

                            {/* Display user images */}
                            <div className="flex items-center gap-2">
                              {review.imageUrls &&
                              review.imageUrls.length > 0 ? (
                                <>
                                  {/* First image */}
                                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded border overflow-hidden">
                                    <img
                                      src={review.imageUrls[0]}
                                      alt="Review image"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>

                                  {/* Additional images indicator */}
                                  {review.imageUrls.length > 1 && (
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded border flex items-center justify-center">
                                      <span className="text-gray-400 text-xs font-bold">
                                        +{review.imageUrls.length - 1}
                                      </span>
                                    </div>
                                  )}
                                </>
                              ) : (
                                // Fallback icon if no images
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded border flex items-center justify-center">
                                  <FaLaptop className="text-gray-400 text-sm md:text-lg" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1 md:ml-4 lg:ml-8 max-w-full md:max-w-[45%] lg:max-w-[600px] flex flex-col gap-4 self-stretch">
              <div className=" rounded-xl  p-4 md:p-6 flex flex-col gap-4 relative">
                <div>
                  <div className="font-bold text-lg md:text-xl text-gray-900 mb-1">
                    {isFromAuction
                      ? product?.product_name || product?.ProductName
                      : product?.ProductName}
                  </div>
                  <div className="text-base font-bold text-gray-900 mb-4">
                    {!isFromAuction &&
                      convertPriceString(`PKR ${product?.ProductPrice}`)}
                    <span className="text-gray-400 font-normal line-through ml-2 text-sm md:text-base">
                      {!isFromAuction &&
                        convertPriceString(
                          `PKR ${Math.round(product?.ProductPrice * 1.2)}`
                        )}
                    </span>
                  </div>
                  {!isFromAuction && (
                    <>
                      {/* Field 1 */}
                      <div className="mb-3">
                        <p>This product is refurbished by Certified Experts at Certifurb, Here are the main specs <span className="text-xl">&darr;</span></p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="font-bold text-gray-700 text-sm min-w-[80px]">
                            {getFieldLabels().field1}:
                          </div>
                          <div className="flex-1">
                            {getFieldValues().field1 && (
                              <button
                                className="bg-[#e6f9f0] border-[#00e676] text-[#00e676] px-3 py-2 rounded-lg border text-sm font-bold w-24"
                                disabled
                              >
                                {getFieldValues().field1}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Field 2 */}
                      <div className="mb-3">
                        <div className="flex items-center gap-3">
                          <div className="font-bold text-gray-700 text-sm min-w-[80px]">
                            {getFieldLabels().field2}:
                          </div>
                          <div className="flex-1">
                            {getFieldValues().field2 && (
                              <button
                                className="bg-[#e6f9f0] border-[#00e676] text-[#00e676] px-3 py-2 rounded-lg border text-sm font-bold w-24"
                                disabled
                              >
                                {getFieldValues().field2}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Field 3 */}
                      {getFieldCount() > 2 && (
                        <div className="mb-3">
                          <div className="flex items-center gap-3">
                            <div className="font-bold text-gray-700 text-sm min-w-[80px]">
                              {getFieldLabels().field3}:
                            </div>
                            <div className="flex-1">
                              {getFieldValues().field3 && (
                                <button
                                  className="bg-[#e6f9f0] border-[#00e676] text-[#00e676] px-3 py-2 rounded-lg border text-sm font-bold w-24"
                                  disabled
                                >
                                  {getFieldValues().field3}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Field 4 */}
                      {getFieldCount() > 3 && (
                        <div className="mb-4">
                          <div className="font-bold text-gray-700 text-sm mb-1">
                            {getFieldLabels().field4}:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {getFieldValues().field4 && (
                              <button
                                className="bg-[#e6f9f0] border-[#00e676] text-[#00e676] flex-1 w-full md:flex-initial px-2 md:px-4 lg:px-6 py-2 md:py-3 rounded-lg border text-xs md:text-sm font-bold"
                                disabled
                              >
                                {getFieldValues().field4}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Conditional buttons based on auction context */}
                {isFromAuction ? (
                  <>
                    {/* --- Redesigned Auction Info Section --- */}
                    <div className=" rounded-xl flex flex-col gap-4">
                      {/* Price, Bids, End Time */}
                      <div className="flex flex-col gap-1 mt-2">
                        <div className="text-3xl font-bold text-gray-900">
                          PKR {getCurrentHighestBid().toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
                          <span
                            className="text-blue-600 hover:underline cursor-pointer"
                            onClick={() =>
                              router.push(`/auction/${product.productid}/bids`)
                            }
                          >
                            {getAuctionBidCount()} bids
                          </span>
                          <span className="text-gray-400">·</span>
                          <span>
                            {(() => {
                              if (isAuctionEnded()) {
                                return "Auction ended";
                              }
                              const timeRemaining = getAuctionTimeRemaining();
                              if (
                                timeRemaining.hours === 0 &&
                                timeRemaining.minutes === 0 &&
                                timeRemaining.seconds === 0
                              ) {
                                return "Auction ended";
                              }
                              return `Ends in ${timeRemaining.hours}h ${String(
                                timeRemaining.minutes
                              ).padStart(2, "0")}m`;
                            })()}
                          </span>
                          <span className="text-gray-400">·</span>
                          <span>{getAuctionEndDate()}</span>
                        </div>
                      </div>

                      {/* Condition */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-semibold text-gray-700">
                          Condition:
                        </span>
                        <span className="text-green-700 font-bold">New</span>
                      </div>

                      {/* Place Bid Button - Only show if auction is active */}
                      {!isAuctionEnded() ? (
                        <div className="flex space-x-2 justify-center">
                          <button
                            onClick={() => setShowBidModal(true)}
                            className="w-[50%] mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow transition text-lg flex items-center justify-center"
                          >
                            Place bid
                          </button>

                          {/* Add to Watchlist */}
                          <button className="w-[50%] mt-2 border border-blue-600 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2 py-3 px-4 text-lg">
                            <svg
                              width="18"
                              height="18"
                              fill="none"
                              viewBox="0 0 24 24"
                              className="flex-shrink-0"
                            >
                              <path
                                d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span>Add to Watchlist</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2 justify-center">
                          <div className="w-full mt-2 bg-red-100 text-red-700 font-bold py-3 px-4 rounded-lg flex items-center justify-center text-lg">
                            Auction Ended
                          </div>
                        </div>
                      )}

                      {/* Delivery, Return, and Payments Sections */}
                      <div className="mt-4 md:mt-6 space-y-3">
                        {/* Delivery Section */}
                        <div>
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-gray-900 text-sm">
                              Delivery
                            </p>
                            <p className="text-gray-700 text-sm">Varies</p>
                          </div>
                        </div>

                        {/* Return Section */}
                        <div>
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-gray-900 text-sm">
                              Return
                            </p>
                            <p className="text-red-600 font-medium text-sm">
                              No return!
                            </p>
                          </div>
                        </div>

                        {/* Payments Section */}
                        <div>
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-gray-900 text-sm">
                              Payments
                            </p>
                            <div className="flex gap-2">
                              <div className="bg-white rounded p-1 border">
                                <img
                                  src="/easypaisa.png"
                                  alt="EasyPaisa"
                                  className="h-5 w-auto"
                                  onError={(e) =>
                                    (e.target.style.display = "none")
                                  }
                                />
                              </div>
                              <div className="bg-white rounded p-1 border">
                                <img
                                  src="/sada.png"
                                  alt="Sada"
                                  className="h-5 w-auto"
                                  onError={(e) =>
                                    (e.target.style.display = "none")
                                  }
                                />
                              </div>
                              <div className="bg-white rounded p-1 border">
                                <img
                                  src="/nayapay.png"
                                  alt="NayaPay"
                                  className="h-5 w-auto"
                                  onError={(e) =>
                                    (e.target.style.display = "none")
                                  }
                                />
                              </div>
                              <div className="bg-white rounded p-1 border">
                                <img
                                  src="/mc.png"
                                  alt="Mastercard"
                                  className="h-5 w-auto"
                                  onError={(e) =>
                                    (e.target.style.display = "none")
                                  }
                                />
                              </div>
                              <div className="bg-white rounded p-1 border">
                                <img
                                  src="/visa.png"
                                  alt="Visa"
                                  className="h-5 w-auto"
                                  onError={(e) =>
                                    (e.target.style.display = "none")
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Shop with Confidence Section */}
                      <div className="pt-4 mt-4">
                        <div className="flex items-start gap-2">
                          <svg
                            className="mt-0.5 text-gray-600"
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="m9 12 2 2 4-4"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              Shop with confidence
                            </p>
                            <p className="text-sm text-gray-600">
                              Certifurb Money Back Guarantee – Get the item you
                              ordered or your money back.{" "}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* People want this */}
                      {/* <div className="flex items-center gap-2 mt-2 bg-gray-50 rounded p-2 text-gray-700 text-sm">
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="9"
                            cy="7"
                            r="4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M23 21v-2a4 4 0 0 0-3-3.87"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M16 3.13a4 4 0 0 1 0 7.75"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>
                          People want this.{" "}
                          <span className="font-bold">32</span> people are
                          watching this.
                        </span>
                      </div> */}
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center space-x-2 items-center">
                    {/* Regular store buttons */}
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-gradient-to-b from-[#6adb4d] via-[#54b056] to-[#468e5d] text-white font-bold py-2 rounded-lg shadow hover:from-[#468e5d] via-[#54b056] hover:to-[#6adb4d] transition text-base md:text-lg"
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={() =>
                        router.push(`/comparison?product1=${product.ProductID}`)
                      }
                      className="w-full bg-gradient-to-b from-[#6adb4d] via-[#54b056] to-[#468e5d] text-white font-bold py-2 rounded-lg shadow hover:from-[#468e5d] via-[#54b056] hover:to-[#6adb4d] transition text-base md:text-lg"
                    >
                      Compare Product
                    </button>
                  </div>
                )}
              </div>
              {!isFromAuction && (
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="bg-white rounded-xl border border-gray-300 flex flex-row items-center justify-center py-4 px-3 text-center hover:border-gray-300 transition-colors">
                    <span className="text-green-600 text-sm font-medium mr-2">✓</span>
                    <span className="text-sm font-medium text-black">
                      What's Included
                    </span>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-300 flex flex-row items-center justify-center py-3 px-3 text-center hover:border-gray-300 transition-colors">
                    <MdCable className="text-black text-lg mr-2" />
                    <span className="text-sm font-medium text-black">
                      Charger
                    </span>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-300 flex flex-row items-center justify-center py-3 px-3 text-center hover:border-gray-300 transition-colors">
                    <FaLaptop className="text-black text-lg mr-2" />
                    <span className="text-sm font-medium text-black">
                      {product.ProductCategory}
                    </span>
                  </div>
                </div>
              )}
              {/* Technical Specifications - Always show for all products */}
              {!isFromAuction && (
                <div className="mt-4 md:mt-6">
                  <div className="bg-white border border-gray-300 rounded-xl p-4 md:px-6">
                    <button
                      className="flex items-center justify-between w-full font-bold text-base md:text-lg text-gray-900 focus:outline-none"
                      onClick={() => setShowSpecs((s) => !s)}
                    >
                      Technical Specifications
                      <FaChevronUp
                        className={`ml-2 transition-transform duration-200 ${
                          showSpecs ? "" : "rotate-180"
                        }`}
                      />
                    </button>
                    {showSpecs && (
                      <div className="mt-4 flex flex-col gap-y-1 text-xs">
                        {getTechnicalSpecs().length > 0 ? (
                          getTechnicalSpecs().map((spec, i) => (
                            <div key={i} className="flex gap-2 mb-1">
                              <span className="font-bold text-gray-900 min-w-[120px]">
                                {spec.label}
                              </span>
                              <span className="text-gray-700">
                                {spec.value}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 text-sm italic py-2">
                            Technical specifications will be updated soon.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="w-full flex flex-col items-center justify-center mt-6 md:mt-10">
          <div className="mx-auto max-w-[1200px] w-full">
            <div className="font-bold text-2xl md:text-3xl ml-4 md:ml-10 mb-4 text-left">
              Similar Products
            </div>
            <div className="flex items-center justify-center px-2 md:px-0">
              <button
                onClick={handlePrev}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white shadow mr-2 disabled:opacity-50"
                disabled={carouselIndex === 0}
              >
                <FaChevronLeft />
              </button>
              <div className="flex gap-2 md:gap-4 overflow-hidden justify-center">
                {similarProducts
                  .slice(carouselIndex, carouselIndex + visibleCount)
                  .map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-gray-300 p-3 md:p-6 relative flex flex-col min-w-[150px] md:min-w-[200px] max-w-[180px] md:max-w-[220px] w-[160px] md:w-[210px] h-full shadow-sm"
                    >
                      <span className="absolute top-2 left-2 bg-green-400 text-white text-xs font-bold py-1 px-2 md:px-3 rounded-full z-10">
                        {item.discount}
                      </span>
                      <div
                        className="absolute top-2 right-2 text-black hover:text-red-500 cursor-pointer z-10"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(item);
                        }}
                      >
                        {isFavorite(item.id) ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart />
                        )}
                      </div>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-20 md:h-28 object-contain my-2"
                      />
                      <h3 className="text-xs md:text-sm font-bold text-gray-800 mt-2 mb-1 line-clamp-2 min-h-[32px] md:min-h-[38px]">
                        {item.name}
                      </h3>
                      <div className="text-xs text-gray-500 mb-1">
                        {item.specs}
                      </div>
                      <p className="text-sm md:text-md font-bold text-black mt-auto">
                        {item.price}
                      </p>
                    </div>
                  ))}
              </div>
              <button
                onClick={handleNext}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white shadow ml-2 disabled:opacity-50"
                disabled={carouselIndex === maxIndex}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Certifurb-Style Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Place bid</h3>
              <button
                onClick={() => setShowBidModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Current Bid Info */}
            <div className="mb-6">
              <div className="text-lg font-bold text-gray-900 mb-1">
                PKR{" "}
                {(
                  currentHighestBid ||
                  (isFromAuction ? product?.price : product?.ProductPrice) ||
                  0
                ).toLocaleString()}{" "}
                current bid
              </div>
              <div className="text-sm text-gray-500 mb-4">
                (approx. US $
                {(
                  (currentHighestBid ||
                    (isFromAuction ? product?.price : product?.ProductPrice) ||
                    0) * 0.0036
                ).toFixed(2)}
                )
              </div>
              <div className="text-sm text-gray-600">
                {product?.bids?.length || 0} bids -{" "}
                {Math.floor(timeLeft / 3600)}h{" "}
                {String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0")}m
                left
              </div>
            </div>

            {/* Suggested Bid Buttons */}
            <div className="space-y-3 mb-6">
              {getSuggestedBids().map((suggestedBid, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedBid(suggestedBid.amount)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition text-left"
                >
                  <div className="text-lg">{suggestedBid.label}</div>
                  <div className="text-sm opacity-90">
                    (approx. US ${(suggestedBid.amount * 0.0036).toFixed(2)})
                  </div>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 mb-6 pt-4">
              <div className="text-center text-gray-500 mb-4">or</div>
            </div>

            {/* Manual Bid Input */}
            <div className="mb-6">
              <div className="text-sm font-semibold text-gray-700 mb-2">
                Your max bid
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 font-semibold">
                  PKR
                </span>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={handleBidAmountChange}
                  placeholder=""
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold ${
                    bidAmount &&
                    parseFloat(bidAmount) <=
                      (currentHighestBid ||
                        (isFromAuction
                          ? product?.price
                          : product?.ProductPrice) ||
                        0)
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300"
                  }`}
                  min={
                    currentHighestBid
                      ? currentHighestBid + 1
                      : (isFromAuction
                          ? product?.price
                          : product?.ProductPrice || 0) + 1
                  }
                />
              </div>
              <div
                className={`text-xs mt-2 ${
                  bidAmount &&
                  parseFloat(bidAmount) <=
                    (currentHighestBid ||
                      (isFromAuction
                        ? product?.price
                        : product?.ProductPrice) ||
                      0)
                    ? "text-red-500 font-semibold"
                    : "text-gray-500"
                }`}
              >
                {bidAmount &&
                parseFloat(bidAmount) <=
                  (currentHighestBid ||
                    (isFromAuction ? product?.price : product?.ProductPrice) ||
                    0)
                  ? `Bid must be higher than PKR ${(
                      currentHighestBid ||
                      (isFromAuction
                        ? product?.price
                        : product?.ProductPrice) ||
                      0
                    ).toLocaleString()}`
                  : `Enter PKR ${
                      (currentHighestBid ||
                        (isFromAuction
                          ? product?.price
                          : product?.ProductPrice) ||
                        0) + 1
                    } or more.`}
              </div>
            </div>

            {/* Bid Button */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowBidModal(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBidSubmit}
                disabled={
                  isSubmittingBid ||
                  !bidAmount ||
                  parseFloat(bidAmount) <=
                    (currentHighestBid ||
                      (isFromAuction
                        ? product?.price
                        : product?.ProductPrice) ||
                      0) ||
                  parseFloat(bidAmount) <= 0
                }
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
              >
                {isSubmittingBid ? "Submitting..." : "Bid"}
              </button>
            </div>

            {/* Commitment Text */}
            <div className="text-xs text-gray-500 mt-4 text-center">
              By clicking Bid, you are committing to buy this item if you are
              the winning bidder.
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductPage;
