"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../Components/Layout/Navbar';
import Footer from '../../../Components/Layout/Footer';
import { font } from '../../../Components/Font/font';
import { FaArrowLeft, FaInfoCircle, FaClock, FaUsers, FaGavel } from 'react-icons/fa';
import dayjs from "dayjs";
import utc from "dayjs-plugin-utc";

dayjs.extend(utc);

const BidHistoryPage = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bids, setBids] = useState([]);
  const [auctionStats, setAuctionStats] = useState({
    totalBids: 0,
    uniqueBidders: 0,
    retractions: 0,
    timeEnded: null,
    duration: null
  });

  useEffect(() => {
    fetchAuctionData();
  }, [id]);

  const fetchAuctionData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://api.certifurb.com/api/auctionproducts');
      const data = await response.json();

      if (data.success) {
        const foundProduct = data.data.find(p => p.productid == id);
        if (foundProduct) {
          setProduct(foundProduct);
          processBids(foundProduct);
        } else {
          setError('Auction product not found');
        }
      } else {
        setError(data.message || 'Failed to fetch auction data');
      }
    } catch (error) {
      console.error('Error fetching auction data:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const processBids = (productData) => {
    try {
      let bidsArray = [];
      if (productData.bids) {
        if (typeof productData.bids === 'string') {
          bidsArray = JSON.parse(productData.bids);
        } else if (Array.isArray(productData.bids)) {
          bidsArray = productData.bids;
        }
      }

      if (!Array.isArray(bidsArray)) {
        bidsArray = [];
      }

      // Sort bids by amount (highest first) and add timestamps if not present
      const processedBids = bidsArray
        .map((bid, index) => ({
          ...bid,
          timestamp: bid.timestamp || new Date(Date.now() - (bidsArray.length - index) * 60000).toISOString()
        }))
        .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));

      setBids(processedBids);

      // Calculate auction statistics
      const uniqueBidders = new Set(processedBids.map(bid => bid.userName)).size;
      const totalBids = processedBids.length;
      
      // Calculate duration
      let duration = null;
      if (productData.auction_timer) {
        const endTime = dayjs.utc(productData.auction_timer);
        const startTime = endTime.subtract(7, 'day'); // Assuming 7-day auctions
        duration = endTime.diff(startTime, 'day') + ' days';
      }

      setAuctionStats({
        totalBids,
        uniqueBidders,
        retractions: 0, // We don't track retractions yet
        timeEnded: productData.auction_timer ? dayjs.utc(productData.auction_timer).format('DD MMM YYYY [at] h:mmA') : null,
        duration
      });

    } catch (error) {
      console.error('Error processing bids:', error);
      setBids([]);
    }
  };

  const getWinningBid = () => {
    if (bids.length === 0) return null;
    return bids[0]; // Highest bid is first after sorting
  };

  const formatBidAmount = (amount) => {
    return `PKR ${parseFloat(amount).toLocaleString()}`;
  };

  const formatBidTime = (timestamp) => {
    if (!timestamp) return 'Recently';
    return dayjs(timestamp).format('DD MMM YYYY [at] h:mm:ssA');
  };

  const maskBidderName = (userName) => {
    if (!userName) return 'Anonymous';
    if (userName.length <= 2) return userName;
    
    const firstChar = userName.charAt(0);
    const lastChar = userName.charAt(userName.length - 1);
    const middleStars = '*'.repeat(userName.length - 2);
    
    return `${firstChar}${middleStars}${lastChar}`;
  };

  if (loading) {
    return (
      <div className={`${font.className} min-h-screen`}>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading bid history...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${font.className} min-h-screen`}>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 text-xl font-bold mb-2">Error</div>
            <div className="text-gray-600 mb-4">{error}</div>
            <button 
              onClick={() => router.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const winningBid = getWinningBid();

  return (
    <div className={`${font.className} min-h-screen bg-gray-50`}>
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to auction
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Bidding history</h1>
        </div>

        {/* Product Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {product?.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.product_name}
                  className="w-24 h-24 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {product?.product_name || 'Unknown Product'}
              </h2>
              {winningBid && (
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Winning bid:</span> {formatBidAmount(winningBid.amount)}
                  <span className="text-gray-500 ml-2">
                    (approximately US ${(parseFloat(winningBid.amount) * 0.0036).toFixed(2)})
                  </span>
                </div>
              )}
              <div className="text-sm text-gray-600 mt-1">
                <span className="font-semibold">Postage:</span> Free Standard Delivery
              </div>
            </div>
          </div>
        </div>

        {/* Auction Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Auction Summary</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <div className="font-semibold text-gray-700">Bids:</div>
              <div className="text-gray-900">{auctionStats.totalBids}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700">Bidders:</div>
              <div className="text-gray-900">{auctionStats.uniqueBidders}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700">Retractions:</div>
              <div className="text-gray-900">{auctionStats.retractions}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700">Time ended:</div>
              <div className="text-gray-900">{auctionStats.timeEnded || 'N/A'}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700">Duration:</div>
              <div className="text-gray-900">{auctionStats.duration || 'N/A'}</div>
            </div>
          </div>
          
          <div className="mt-4">
            <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
              Learn more about bidding
            </a>
          </div>
        </div>

        {/* Bidding History Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Bidding History</h3>
          </div>
          
          {bids.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No bids have been placed on this auction yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <span>Bidder</span>
                        <FaInfoCircle className="ml-1 h-3 w-3 text-gray-400" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bid amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bid time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bids.map((bid, index) => (
                    <tr key={index} className={index === 0 ? 'bg-green-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {maskBidderName(bid.userName)} 
                        {index === 0 && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Winner
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatBidAmount(bid.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatBidTime(bid.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BidHistoryPage; 