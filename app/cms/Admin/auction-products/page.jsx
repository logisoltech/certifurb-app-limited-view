"use client";
import React, { useEffect, useState } from "react";
import Layout from "../../Components/Layout/Layout";
import { font } from "../../../Components/Font/font";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrophyIcon,
  UserIcon,
  ChevronDownIcon,
  PhotoIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import utc from "dayjs-plugin-utc";

dayjs.extend(utc);

const AuctionProductsAdminPage = () => {
  const [auctionProducts, setAuctionProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [endingAuction, setEndingAuction] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form states for editing
  const [editForm, setEditForm] = useState({
    product_name: '',
    price: '',
    image_url: '',
    auction_timer: '',
    product_specs: []
  });

  // Technical specification fields
  const [editTechSpecs, setEditTechSpecs] = useState({
    model: '',
    graphics: '',
    weight: '',
    cpu: '',
    resolution: '',
    os: '',
    battery: '',
    bluetooth: '',
    wifi: '',
    camera: '',
    audio: '',
    brand: ''
  });

  // Product specification fields
  const [editProductSpecs, setEditProductSpecs] = useState({
    keyboard: '',
    ram: '',
    storage: '',
    screenSize: ''
  });

  const [productCategory, setProductCategory] = useState('');

  // Helper functions for form options
  const getStorageOptions = () => {
    if (productCategory === 'Laptop' || productCategory === 'Desktop PC' || productCategory === 'Tablet') {
      return ['128GB', '256GB', '512GB', '1TB', '2TB'];
    } else if (productCategory === 'Drive') {
      return ['128GB', '256GB', '512GB', '1TB', '2TB', '4TB', '8TB'];
    }
    return [];
  };

  const getRamOptions = () => {
    if (productCategory === 'Laptop' || productCategory === 'Desktop PC') {
      return ['4GB', '8GB', '16GB', '32GB', '64GB'];
    } else if (productCategory === 'Tablet') {
      return ['2GB', '4GB', '6GB', '8GB', '12GB'];
    }
    return [];
  };

  const getKeyboardOptions = () => {
    if (productCategory === 'Laptop' || productCategory === 'Desktop PC') {
      return ['English', 'English & Arabic', 'Backlit English', 'Backlit English & Arabic'];
    } else if (productCategory === 'Keyboard') {
      return ['Mechanical', 'Membrane', 'Wireless', 'Gaming', 'Ergonomic'];
    }
    return [];
  };

  const getScreenSizeOptions = () => {
    if (productCategory === 'Laptop') {
      return ['13"', '14"', '15.6"', '17"'];
    } else if (productCategory === 'Desktop PC') {
      return ['No Display', 'Integrated Display'];
    } else if (productCategory === 'LCD' || productCategory === 'LED' || productCategory === 'Monitors') {
      return ['19"', '21.5"', '24"', '27"', '32"', '43"', '55"', '65"'];
    } else if (productCategory === 'Tablet') {
      return ['7"', '8"', '10"', '11"', '12.9"'];
    }
    return [];
  };

  const getField1Options = () => {
    if (productCategory === 'Mouse') {
      return ['Wired', 'Wireless', 'Gaming', 'Ergonomic', 'Optical'];
    } else if (productCategory === 'Printer') {
      return ['Inkjet', 'Laser', 'All-in-One', 'Photo Printer', '3D Printer'];
    } else if (productCategory === 'Network') {
      return ['Router', 'Switch', 'Access Point', 'Modem', 'Network Card'];
    } else if (productCategory === 'Drive') {
      return ['SSD', 'HDD', 'USB Drive', 'External Drive', 'M.2 SSD'];
    } else if (productCategory === 'Tablet') {
      return ['Android', 'iOS', 'Windows', 'Fire OS', 'Chrome OS'];
    } else if (productCategory === 'LCD' || productCategory === 'LED' || productCategory === 'Monitors') {
      return ['IPS', 'VA', 'TN', 'OLED', 'QLED'];
    } else if (productCategory === 'GOAT Product') {
      return ['Wireless', 'Wired', 'In-Ear', 'Over-Ear', 'Fast Charging'];
    }
    return getKeyboardOptions();
  };

  const getField2Options = () => {
    if (productCategory === 'Mouse') {
      return ['800 DPI', '1200 DPI', '1600 DPI', '3200 DPI', '6400 DPI'];
    } else if (productCategory === 'Printer') {
      return ['Black & White', 'Color', 'Photo Quality', 'Draft Quality'];
    } else if (productCategory === 'Network') {
      return ['10/100 Mbps', 'Gigabit', '10 Gigabit', 'Wi-Fi 5', 'Wi-Fi 6'];
    } else if (productCategory === 'Keyboard') {
      return ['Wired', 'Wireless', 'Bluetooth', 'USB-C', 'USB-A'];
    } else if (productCategory === 'LCD' || productCategory === 'LED' || productCategory === 'Monitors') {
      return ['HD', 'Full HD', '4K', '8K', 'Curved'];
    } else if (productCategory === 'Drive') {
      return ['SATA III', 'NVMe', 'USB 3.0', 'USB 3.1', 'Thunderbolt'];
    } else if (productCategory === 'GOAT Product') {
      return ['Bluetooth 5.0', 'USB-C', 'Universal Compatible', 'Noise Cancelling', 'Bass Boosted'];
    }
    return getRamOptions();
  };

  const getField3Options = () => {
    if (productCategory === 'Mouse') {
      return ['None', '128MB', '256MB', '512MB', '1GB'];
    } else if (productCategory === 'Printer') {
      return ['A4', 'A3', 'Letter', 'Legal', 'Photo'];
    } else if (productCategory === 'Network') {
      return ['4 Ports', '8 Ports', '16 Ports', '24 Ports', '48 Ports'];
    } else if (productCategory === 'Keyboard') {
      return ['Full Size', 'TKL', '60%', '65%', 'Compact'];
    } else if (productCategory === 'LCD' || productCategory === 'LED' || productCategory === 'Monitors') {
      return ['19"', '21.5"', '24"', '27"', '32"', '43"', '55"', '65"'];
    } else if (productCategory === 'Drive') {
      return ['2.5"', '3.5"', 'M.2', 'mSATA', 'USB Stick'];
    } else if (productCategory === 'GOAT Product') {
      return ['Premium Sound', '1.5M Length', '65W', 'Compact Design', 'Eco-Friendly'];
    }
    return getStorageOptions();
  };

  const getField4Options = () => {
    if (productCategory === 'Mouse') {
      return ['Standard', 'Ergonomic', 'Ambidextrous', 'Left-handed', 'Gaming'];
    } else if (productCategory === 'Printer') {
      return ['USB', 'Wi-Fi', 'Ethernet', 'Bluetooth', 'All Connectivity'];
    } else if (productCategory === 'Network') {
      return ['10m', '50m', '100m', '300m', '1km'];
    } else if (productCategory === 'Keyboard') {
      return ['RGB Backlit', 'Single Backlit', 'No Backlight', 'Programmable', 'Hot-swappable'];
    } else if (productCategory === 'LCD' || productCategory === 'LED' || productCategory === 'Monitors') {
      return ['60Hz', '75Hz', '120Hz', '144Hz', '240Hz'];
    } else if (productCategory === 'Drive') {
      return ['Up to 1TB', '1TB - 4TB', '4TB - 8TB', '8TB+', 'Various'];
    } else if (productCategory === 'GOAT Product') {
      return ['Sustainable', 'Rechargeable', 'Lightweight', 'Durable', 'Warranty Included'];
    }
    return getScreenSizeOptions();
  };

  const getFieldLabels = () => {
    if (productCategory === 'Mouse') {
      return { field1: 'Type', field2: 'DPI' };
    } else if (productCategory === 'Printer') {
      return { field1: 'Type', field2: 'Print Quality', field3: 'Paper Size', field4: 'Connectivity' };
    } else if (productCategory === 'Network') {
      return { field1: 'Device Type', field2: 'Speed', field3: 'Ports', field4: 'Range' };
    } else if (productCategory === 'Keyboard') {
      return { field1: 'Switch Type', field2: 'Connectivity', field3: 'Layout', field4: 'Features' };
    } else if (productCategory === 'LCD' || productCategory === 'LED' || productCategory === 'Monitors') {
      return { field1: 'Panel Type', field2: 'Resolution', field3: 'Screen Size', field4: 'Refresh Rate' };
    } else if (productCategory === 'Drive') {
      return { field1: 'Drive Type', field2: 'Interface', field3: 'Form Factor', field4: 'Capacity Range' };
    } else if (productCategory === 'GOAT Product') {
      return { field1: 'Type', field2: 'Technology', field3: 'Features', field4: 'Eco-Attributes' };
    } else if (productCategory === 'Tablet') {
      return { field1: 'Operating System', field2: 'RAM', field3: 'Storage', field4: 'Screen Size' };
    } else if (productCategory === 'Desktop PC') {
      return { field1: 'Keyboard Type', field2: 'RAM', field3: 'Storage', field4: 'Screen' };
    } else if (productCategory === 'Laptop') {
      return { field1: 'Keyboard', field2: 'RAM', field3: 'Storage', field4: 'Screen Size' };
    }
    return { field1: 'Field 1', field2: 'Field 2', field3: 'Field 3', field4: 'Field 4' };
  };

  const getFieldCount = () => {
    if (productCategory === 'Mouse') {
      return 2;
    }
    return 4;
  };

  const handleProductClick = (product) => {
    setEditingProduct(product);
    setProductCategory(product.product_category || 'Laptop'); // Default to Laptop if not set
    
    // Parse product specs
    let specs = [];
    try {
      if (product.product_specs) {
        specs = typeof product.product_specs === 'string' 
          ? JSON.parse(product.product_specs) 
          : product.product_specs;
      }
    } catch (error) {
      console.error('Error parsing product specs:', error);
      specs = [];
    }

    // Set form data
    setEditForm({
      product_name: product.product_name || '',
      price: product.price || '',
      image_url: product.image_url || '',
      auction_timer: product.auction_timer ? formatDateTimeForInput(product.auction_timer) : '',
      product_specs: specs
    });

    // Set product specs (first 4 items)
    setEditProductSpecs({
      keyboard: specs[0] || '',
      ram: specs[1] || '',
      storage: specs[2] || '',
      screenSize: specs[3] || ''
    });

    // Parse technical specs from product_specs (items 5+)
    setEditTechSpecs({
      model: specs[4] || '',
      graphics: specs[5] || '',
      weight: specs[6] || '',
      cpu: specs[7] || '',
      resolution: specs[8] || '',
      os: specs[9] || '',
      battery: specs[10] || '',
      bluetooth: specs[11] || '',
      wifi: specs[12] || '',
      camera: specs[13] || '',
      audio: specs[14] || '',
      brand: specs[15] || ''
    });

    setShowEditDialog(true);
  };

  const formatDateTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    try {
      // Convert UTC datetime to local datetime for input field
      const date = new Date(dateTimeString);
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      return localDate.toISOString().slice(0, 16);
    } catch (error) {
      console.error('Error formatting datetime:', error);
      return '';
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    setIsUpdating(true);

    try {
      // Combine all specs
      const allSpecs = [
        editProductSpecs.keyboard,
        editProductSpecs.ram,
        editProductSpecs.storage,
        editProductSpecs.screenSize,
        editTechSpecs.model,
        editTechSpecs.graphics,
        editTechSpecs.weight,
        editTechSpecs.cpu,
        editTechSpecs.resolution,
        editTechSpecs.os,
        editTechSpecs.battery,
        editTechSpecs.bluetooth,
        editTechSpecs.wifi,
        editTechSpecs.camera,
        editTechSpecs.audio,
        editTechSpecs.brand
      ].filter(spec => spec && spec.trim() !== '');

      // Convert local datetime to UTC
      let formattedUTC = null;
      if (editForm.auction_timer.trim()) {
        const localDate = new Date(editForm.auction_timer);
        const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
        formattedUTC = utcDate.toISOString().slice(0, 19).replace('T', ' ');
      }

      const updateData = {
        product_name: editForm.product_name,
        price: editForm.price,
        image_url: editForm.image_url,
        product_specs: allSpecs,
        auction_timer: formattedUTC
      };

      const response = await fetch(`https://api.certifurb.com/api/auctionproducts/${editingProduct.productid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Product updated successfully!');
        setShowEditDialog(false);
        fetchAuctionProducts(); // Refresh the list
      } else {
        alert(`Failed to update product: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCategoryChange = (newCategory) => {
    setProductCategory(newCategory);
    // Reset product specs when category changes
    setEditProductSpecs({
      keyboard: '',
      ram: '',
      storage: '',
      screenSize: ''
    });
  };

  const fetchAuctionProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://api.certifurb.com/api/auctionproducts"
      );
      const data = await response.json();
      if (data.success) {
        console.log("Fetched auction products:", data.data);
        setAuctionProducts(data.data);
      } else {
        setError(data.message || "Failed to fetch auction products");
      }
    } catch (err) {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctionProducts();
  }, []);

  const handleEndAuction = async (productId) => {
    if (
      !window.confirm(
        "Are you sure you want to end this auction? This action cannot be undone."
      )
    ) {
      return;
    }

    setEndingAuction(productId);
    try {
      const response = await fetch(
        `https://api.certifurb.com/api/cms/auctionproducts/${productId}/end`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        if (data.winner) {
          alert(
            `Auction ended successfully! Winner: ${data.winner} with bid: PKR ${data.amount}`
          );
        } else {
          alert(`Auction ended successfully! No bids were received.`);
        }
        // Refresh the auction products list
        setRefreshing(true);
        try {
          await fetchAuctionProducts();
          console.log("Auction products refreshed after ending auction");
        } catch (refreshError) {
          console.error("Error refreshing auction products:", refreshError);
        } finally {
          setRefreshing(false);
        }
      } else {
        alert(`Failed to end auction: ${data.message}`);
      }
    } catch (error) {
      console.error("Error ending auction:", error);
      alert("Error ending auction. Please try again.");
    } finally {
      setEndingAuction(null);
    }
  };

  const getAuctionStatus = (product) => {
    const now = new Date();
    const auctionEnd = product.auction_timer
      ? new Date(product.auction_timer)
      : null;
    const isManuallyEnded = product.auction_ended === 1;
    const isTimeExpired = auctionEnd && auctionEnd < now;
    const isEnded = isManuallyEnded || isTimeExpired;

    if (isEnded) {
      return { status: "Ended", color: "text-red-600", bgColor: "bg-red-100" };
    } else {
      return {
        status: "Active",
        color: "text-green-600",
        bgColor: "bg-green-100",
      };
    }
  };

  const getWinnerInfo = (product) => {
    try {
      // Handle bids - it could be an array, JSON string, or null
      let bids = [];
      if (Array.isArray(product.bids)) {
        bids = product.bids;
      } else if (typeof product.bids === "string" && product.bids.trim()) {
        bids = JSON.parse(product.bids);
      } else {
        bids = product.bids || [];
      }

      if (bids.length === 0) return null;

      const highestBid = bids.reduce(
        (max, bid) => (bid.amount > max.amount ? bid : max),
        bids[0]
      );
      return highestBid;
    } catch (error) {
      console.error("Error getting winner info:", error);
      return null;
    }
  };

  const formatTimeRemaining = (auctionTimer) => {
    if (!auctionTimer || typeof auctionTimer !== "string") return "No timer set";
  
    try {
      let end;
  
      // Parse the auction_timer as UTC from the API
      if (auctionTimer.includes("T") && auctionTimer.includes("Z")) {
        end = dayjs.utc(auctionTimer);
      } else if (auctionTimer.includes(" ")) {
        end = dayjs.utc(auctionTimer, "YYYY-MM-DD HH:mm:ss");
      } else {
        return "Invalid timer format";
      }
  
      // Validate parsed date
      if (!end.isValid()) {
        return "Invalid Date";
      }
  
      // Since the API's UTC time is based on PKT database time, adjust back to PKT
      // Subtract 5 hours (PKT offset from UTC) to get the intended PKT end time
      end = end.subtract(5, "hour");
  
      // Current time in local timezone (PKT)
      const now = dayjs();
  
      // Calculate difference
      const diff = end.diff(now);
  
      // Debug logging
      console.log("Timer debug:", {
        auctionTimer,
        now: now.toISOString(),
        nowLocal: now.format("YYYY-MM-DD HH:mm:ss"),
        end: end.toISOString(),
        endLocal: end.format("YYYY-MM-DD HH:mm:ss"),
        diff: diff / (1000 * 60 * 60), // hours
        diffMinutes: diff / (1000 * 60), // minutes
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
  
      if (diff <= 0) return "Auction Ended";
  
      // Calculate days, hours, minutes
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
      if (days > 0) return `${days}d ${hours}h`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className={`${font.className} p-6`}>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading auction products...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={`${font.className} p-6 bg-gray-50 min-h-screen`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Auction Products</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchAuctionProducts}
              disabled={refreshing}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <Link
              href="/cms/Admin/add-auction-product"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Auction Product
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading auction products...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Product ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Image
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Timer
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Bids
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Winner
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auctionProducts.map((product) => {
                  const status = getAuctionStatus(product);
                  const winner = getWinnerInfo(product);
                  const isEnded = status.status === "Ended";

                  return (
                    <tr key={product.productid} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-blue-700 hover:underline hover:cursor-pointer" onClick={() => handleProductClick(product)}>
                        {product.productid}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 font-medium">
                        {product.product_name}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        PKR {product.price}
                      </td>
                      <td className="px-4 py-2">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.product_name}
                            className="w-12 h-12 object-cover rounded border"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">
                            No image
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}
                        >
                          {status.status === "Active" && (
                            <ClockIcon className="w-3 h-3 mr-1" />
                          )}
                          {status.status === "Ended" && (
                            <CheckCircleIcon className="w-3 h-3 mr-1" />
                          )}
                          {status.status === "Expired" && (
                            <XCircleIcon className="w-3 h-3 mr-1" />
                          )}
                          {status.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {product.auction_timer ? (
                          <div>
                            <div className="font-medium">
                              {formatTimeRemaining(product.auction_timer)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {(() => {
                                try {
                                  let date;
                                  if (
                                    product.auction_timer.includes("T") &&
                                    product.auction_timer.includes("Z")
                                  ) {
                                    // Already in ISO format with timezone
                                    date = new Date(product.auction_timer);
                                  } else if (
                                    product.auction_timer.includes(" ")
                                  ) {
                                    // MySQL DATETIME format - parse as local time
                                    date = new Date(product.auction_timer);
                                  } else {
                                    return "Invalid Date";
                                  }

                                  if (isNaN(date.getTime())) {
                                    return "Invalid Date";
                                  }
                                  return date.toLocaleDateString();
                                } catch (error) {
                                  return "Invalid Date";
                                }
                              })()}
                            </div>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {(() => {
                          try {
                            let bids = [];
                            if (Array.isArray(product.bids)) {
                              bids = product.bids;
                            } else if (
                              typeof product.bids === "string" &&
                              product.bids.trim()
                            ) {
                              bids = JSON.parse(product.bids);
                            } else {
                              bids = product.bids || [];
                            }
                            return Array.isArray(bids) ? bids.length : 0;
                          } catch {
                            return 0;
                          }
                        })()}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {winner && isEnded ? (
                          <div className="flex items-center text-green-600">
                            <TrophyIcon className="w-4 h-4 mr-1" />
                            <div>
                              <div className="font-medium">
                                {winner.userName}
                              </div>
                              <div className="text-xs text-gray-500">
                                PKR {winner.amount}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <div className="flex items-center space-x-2">
                          {/* <Link href={`/cms/Admin/edit-auction-product/${product.productid}`} className="text-blue-600 hover:underline">Edit</Link> */}
                          {/* <Link href={`/auction/${product.productid}`} className="text-green-600 hover:underline">View</Link> */}
                          {!isEnded && (
                            <button
                              onClick={() =>
                                handleEndAuction(product.productid)
                              }
                              disabled={endingAuction === product.productid}
                              className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {endingAuction === product.productid
                                ? "Ending..."
                                : "End Auction"}
                            </button>
                          )}
                          {isEnded && (
                            <span className="text-gray-500 text-sm">
                              Auction Ended
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {auctionProducts.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-gray-500">
                      No auction products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Dialog */}
        {showEditDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  Edit Auction Product - ID: {editingProduct?.productid}
                </h2>
                <button
                  onClick={() => setShowEditDialog(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Product Name
                        </label>
                        <input
                          type="text"
                          value={editForm.product_name}
                          onChange={(e) => setEditForm({...editForm, product_name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Price (PKR)
                        </label>
                        <input
                          type="number"
                          value={editForm.price}
                          onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={editForm.image_url}
                          onChange={(e) => setEditForm({...editForm, image_url: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Auction End Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={editForm.auction_timer}
                          onChange={(e) => setEditForm({...editForm, auction_timer: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Product Category
                        </label>
                        <select
                          value={productCategory}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Laptop">Laptop</option>
                          <option value="Desktop PC">Desktop PC</option>
                          <option value="Keyboard">Keyboard</option>
                          <option value="Mouse">Mouse</option>
                          <option value="LCD">LCD</option>
                          <option value="LED">LED</option>
                          <option value="Monitors">Monitors</option>
                          <option value="Printer">Printer</option>
                          <option value="Tablet">Tablet</option>
                          <option value="Drive">Drive</option>
                          <option value="Network">Network</option>
                          <option value="GOAT Product">GOAT Product</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Product Specifications */}
                  {productCategory && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Specifications</h3>
                      
                      <div className={`grid grid-cols-1 ${getFieldCount() === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2'} gap-4`}>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            {getFieldLabels().field1}
                          </label>
                          <select
                            value={editProductSpecs.keyboard}
                            onChange={(e) => setEditProductSpecs({...editProductSpecs, keyboard: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select {getFieldLabels().field1}</option>
                            {getField1Options().map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            {getFieldLabels().field2}
                          </label>
                          <select
                            value={editProductSpecs.ram}
                            onChange={(e) => setEditProductSpecs({...editProductSpecs, ram: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select {getFieldLabels().field2}</option>
                            {getField2Options().map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>

                        {getFieldCount() > 2 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              {getFieldLabels().field3}
                            </label>
                            <select
                              value={editProductSpecs.storage}
                              onChange={(e) => setEditProductSpecs({...editProductSpecs, storage: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select {getFieldLabels().field3}</option>
                              {getField3Options().map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        {getFieldCount() > 3 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              {getFieldLabels().field4}
                            </label>
                            <select
                              value={editProductSpecs.screenSize}
                              onChange={(e) => setEditProductSpecs({...editProductSpecs, screenSize: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select {getFieldLabels().field4}</option>
                              {getField4Options().map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Technical Specifications */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Model</label>
                        <input
                          type="text"
                          value={editTechSpecs.model}
                          onChange={(e) => setEditTechSpecs({...editTechSpecs, model: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Graphics</label>
                        <input
                          type="text"
                          value={editTechSpecs.graphics}
                          onChange={(e) => setEditTechSpecs({...editTechSpecs, graphics: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Weight</label>
                        <input
                          type="text"
                          value={editTechSpecs.weight}
                          onChange={(e) => setEditTechSpecs({...editTechSpecs, weight: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">CPU</label>
                        <input
                          type="text"
                          value={editTechSpecs.cpu}
                          onChange={(e) => setEditTechSpecs({...editTechSpecs, cpu: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Resolution</label>
                        <input
                          type="text"
                          value={editTechSpecs.resolution}
                          onChange={(e) => setEditTechSpecs({...editTechSpecs, resolution: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Operating System</label>
                        <input
                          type="text"
                          value={editTechSpecs.os}
                          onChange={(e) => setEditTechSpecs({...editTechSpecs, os: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Battery</label>
                        <input
                          type="text"
                          value={editTechSpecs.battery}
                          onChange={(e) => setEditTechSpecs({...editTechSpecs, battery: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Bluetooth</label>
                        <input
                          type="text"
                          value={editTechSpecs.bluetooth}
                          onChange={(e) => setEditTechSpecs({...editTechSpecs, bluetooth: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">WiFi</label>
                        <input
                          type="text"
                          value={editTechSpecs.wifi}
                          onChange={(e) => setEditTechSpecs({...editTechSpecs, wifi: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Camera</label>
                        <input
                          type="text"
                          value={editTechSpecs.camera}
                          onChange={(e) => setEditTechSpecs({...editTechSpecs, camera: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Audio</label>
                        <input
                          type="text"
                          value={editTechSpecs.audio}
                          onChange={(e) => setEditTechSpecs({...editTechSpecs, audio: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Brand</label>
                        <input
                          type="text"
                          value={editTechSpecs.brand}
                          onChange={(e) => setEditTechSpecs({...editTechSpecs, brand: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
                <button
                  onClick={() => setShowEditDialog(false)}
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProduct}
                  disabled={isUpdating}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AuctionProductsAdminPage;
