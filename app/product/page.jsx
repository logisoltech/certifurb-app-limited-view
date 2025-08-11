"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';
import { FaCheckCircle, FaBoxOpen, FaKeyboard, FaMemory, FaRegTimesCircle, FaRegHeart, FaHeart, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { BsFillCpuFill } from 'react-icons/bs';
import { font } from '../Components/Font/font';
import { FaLaptop } from "react-icons/fa";
import { MdCable } from "react-icons/md";
import { FaChevronUp } from "react-icons/fa";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useFavorites } from '../context/FavoritesContext';

const productImages = [
  '/laptop.png',
  '/laptop.png',
  '/laptop.png',
];

const features = [
  { icon: <FaCheckCircle className="text-black text-2xl mx-auto" />, label: 'Certified By Experts' },
  { icon: <BsFillCpuFill className="text-black text-2xl mx-auto" />, label: 'Windows OS is Installed' },
  { icon: <FaMemory className="text-black text-2xl mx-auto" />, label: '12 Months Warranty' },
  { icon: <FaBoxOpen className="text-black text-2xl mx-auto" />, label: 'No Delivery Charges' },
];

const whatsIncluded = [
  { icon: <FaKeyboard className="text-gray-700 text-3xl mx-auto" />, label: 'Charger' },
  { icon: <FaLaptop className="text-gray-700 text-3xl mx-auto" />, label: 'Laptop' },
];

// Example technical specifications - in a real scenario, this would come from database
const sampleProduct = {
  ProductModel: 'Lenovo ThinkPad T470',
  ProductBrand: 'Lenovo',
  ProductCpu: 'Core i5 - 6th Gen',
  ProductRam: '8 GB, 16 GB',
  ProductStorage: '128 GB SSD, 256 GB SSD',
  ProductGraphics: 'Intel HD Graphics',
  ProductScreenSize: '14"',
  ProductResolution: '1366 x 768',
  ProductOs: 'Windows 10',
  ProductWeight: '3.5 lbs',
  ProductBattery: 'Up to 8 hours',
  ProductKeyboard: 'English/Arabic Backlit',
  ProductBluetooth: '4.0 wireless technology',
  ProductWifi: '802.11ac Wi-Fi wireless networking; IEEE 802.11a/b/g/n compatible',
  ProductCamera: '720p HD camera',
  ProductAudio: 'Stereo speakers | Dual microphones | 3.5 mm headphone jack'
};

// Create technical specifications from database data
const getTechnicalSpecs = () => {
  const specs = [];

  // Add each technical specification if it exists in the database
  if (sampleProduct.ProductModel) specs.push({ label: 'Model', value: sampleProduct.ProductModel });
  if (sampleProduct.ProductBrand) specs.push({ label: 'Brand', value: sampleProduct.ProductBrand });
  if (sampleProduct.ProductCpu) specs.push({ label: 'CPU', value: sampleProduct.ProductCpu });
  if (sampleProduct.ProductRam) specs.push({ label: 'RAM', value: sampleProduct.ProductRam });
  if (sampleProduct.ProductStorage) specs.push({ label: 'Storage', value: sampleProduct.ProductStorage });
  if (sampleProduct.ProductGraphics) specs.push({ label: 'Graphics', value: sampleProduct.ProductGraphics });
  if (sampleProduct.ProductScreenSize) specs.push({ label: 'Screen Size', value: sampleProduct.ProductScreenSize });
  if (sampleProduct.ProductResolution) specs.push({ label: 'Resolution', value: sampleProduct.ProductResolution });
  if (sampleProduct.ProductOs) specs.push({ label: 'Operating System', value: sampleProduct.ProductOs });
  if (sampleProduct.ProductWeight) specs.push({ label: 'Weight', value: sampleProduct.ProductWeight });
  if (sampleProduct.ProductBattery) specs.push({ label: 'Battery', value: sampleProduct.ProductBattery });
  if (sampleProduct.ProductKeyboard) specs.push({ label: 'Keyboard', value: sampleProduct.ProductKeyboard });
  if (sampleProduct.ProductBluetooth) specs.push({ label: 'Bluetooth', value: sampleProduct.ProductBluetooth });
  if (sampleProduct.ProductWifi) specs.push({ label: 'WiFi', value: sampleProduct.ProductWifi });
  if (sampleProduct.ProductCamera) specs.push({ label: 'Camera', value: sampleProduct.ProductCamera });
  if (sampleProduct.ProductAudio) specs.push({ label: 'Audio', value: sampleProduct.ProductAudio });

  return specs;
};

const similarProducts = Array(10).fill({
  name: 'Lenovo Thinkpad-T470s Core-i7-7th-Gen',
  specs: '128 GB, 256 GB SSD - 14"',
  price: 'PKR 130,000',
  discount: '45% vs. new',
  image: '/laptop.png',
});

const ProductPage = () => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [isFromAuction, setIsFromAuction] = useState(false);
  
  // Check URL parameters on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const fromParam = urlParams.get('from');
      console.log('URL Params:', window.location.search);
      console.log('From parameter:', fromParam);
      setIsFromAuction(fromParam === 'auction');
    }
  }, []);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSpecs, setShowSpecs] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  
  // Bidding states
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  
  // Timer state - starts at 1 hour (3600 seconds)
  const [timeLeft, setTimeLeft] = useState(3600);
  
  const visibleCount = 5;
  const maxIndex = similarProducts.length - visibleCount;
  const handlePrev = () => setCarouselIndex(i => Math.max(0, i - 1));
  const handleNext = () => setCarouselIndex(i => Math.min(maxIndex, i + 1));

  // Fetch reviews from database
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('https://api.certifurb.com/api/all-user-reviews');
        const data = await response.json();
        
        if (data.success) {
          setReviews(data.data);
        } else {
          console.error('Failed to fetch reviews:', data.message);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (isFromAuction && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isFromAuction, timeLeft]);

  // Handle bid submission
  const handleBidSubmit = async () => {
    if (!bidAmount || isNaN(bidAmount) || parseFloat(bidAmount) <= 0) {
      alert('Please enter a valid bid amount');
      return;
    }

    setIsSubmittingBid(true);
    
    try {
      // Add your bid submission API call here
      // const response = await fetch('/api/submit-bid', { ... });
      
      // For now, just simulate success
      setTimeout(() => {
        alert(`Bid of PKR ${bidAmount} submitted successfully!`);
        setShowBidModal(false);
        setBidAmount('');
        setIsSubmittingBid(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting bid:', error);
      alert('Failed to submit bid. Please try again.');
      setIsSubmittingBid(false);
    }
  };

  return (
    <div className={`${font.className} bg-[#fafbfc] min-h-screen`}>
      <Navbar />
      

      <div className="max-w-[1300px] mx-auto px-4 py-8 flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[700px] flex flex-col gap-4">
            <div className="bg-white rounded-xl border border-gray-500 p-4 flex gap-8 items-start min-h-[360px]">
              
              <div className="flex flex-col gap-2 ">
            <span className="left-0 bg-[#00e676] mb-4 text-white text-sm font-bold py-1 px-3 rounded-full z-10 whitespace-nowrap min-w-[110px] text-center">-45% vs. new</span>
                {productImages.map((img, idx) => (
                    <img
                    key={idx}
                    src={img}
                    alt="Laptop Thumbnail"
                    className={`w-24 h-24 object-contain rounded-lg border-2 p-2 cursor-pointer ${selectedImage === idx ? 'border-[#00e676]' : 'border-gray-500'}`}
                    onClick={() => setSelectedImage(idx)}
                    />
                ))}
              </div>
              <div className="relative flex items-center justify-center min-h-[450px] w-full">
                <img src={productImages[selectedImage]} alt="Laptop" className="object-contain h-[320px] mx-auto" />
                <img src="/certified-badge.png" alt="Certified Badge" className="absolute top-0 right-0 w-24 h-24 object-contain" style={{transform: 'translate(10%,-10%)'}}/>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                {features.map((f, i) => (
                  <div key={i} className="bg-gray-200 rounded-xl border border-gray-500 flex flex-col items-center justify-center py-6 px-2 text-center">
                    {f.icon}
                    <span className="text-sm font-semibold mt-2 text-black">{f.label}</span>
                  </div>
                ))}
              </div>

            {/* Reviews Section */}
            <div className="mt-6">
              <div className="bg-white rounded-xl border border-gray-500 p-6">
                {/* Reviews Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Reviews ({reviews.length})
                  </h2>
                  <button className="text-[#00e676] text-sm font-medium hover:underline">View All</button>
                </div>

                {/* Reviews List */}
                {isLoadingReviews ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-gray-500">Loading reviews...</div>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-gray-500">No reviews yet. Be the first to review!</div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {reviews.map((review, index) => (
                      <div key={index} className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 leading-relaxed mb-2">
                            {review.reviewText}
                          </p>
                          <span className="text-xs text-gray-400">{review.userName || 'Anonymous User'}</span>
                        </div>
                        
                        {/* Display user images */}
                        <div className="flex items-center gap-2">
                          {review.imageUrls && review.imageUrls.length > 0 ? (
                            <>
                              {/* First image */}
                              <div className="w-12 h-12 bg-gray-100 rounded border overflow-hidden">
                                <img 
                                  src={review.imageUrls[0]} 
                                  alt="Review image" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              
                              {/* Additional images indicator */}
                              {review.imageUrls.length > 1 && (
                                <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
                                  <span className="text-gray-400 text-xs font-bold">
                                    +{review.imageUrls.length - 1}
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            // Fallback icon if no images
                            <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
                              <FaLaptop className="text-gray-400 text-lg" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 ml-8 max-w-[600px] flex flex-col gap-4 self-stretch">
            <div className='bg-white rounded-xl border border-gray-500 flex flex-col gap-2 relative h-full justify-between'>
                <div className="font-bold text-xl md:text-xl mt-2 ml-2 text-gray-900 mb-1">Thinkpad T470 Core i5 6th Gen</div>
                <div className="text-base font-bold ml-2 text-gray-900 mb-2">PKR 130,000 <span className="text-gray-400 font-normal line-through ml-2 text-base">PKR 140,000</span></div>
            </div>
            <div className="bg-white rounded-xl border border-gray-500 p-6 flex flex-col gap-2 relative h-full min-h-[480px] justify-between">
              <div>
                <div className="flex flex-col gap-4 mt-2">
                  <div>
                    <div className="font-bold text-gray-700 text-sm mb-1">Storage:</div>
                    <div className="flex gap-2 mt-2">
                      <button className="flex-1 md:flex-none md:px-10 px-3 py-3 rounded-lg border text-sm font-bold bg-[#e6f9f0] border-[#00e676] text-[#00e676]">128 GB SSD</button>
                      <button className="flex-1 md:flex-none md:px-10 px-3 py-3 rounded-lg border text-sm font-bold bg-white border-gray-500 text-gray-700">256 GB SSD</button>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-700 text-sm mb-1">RAM:</div>
                    <div className="flex gap-2">
                      <button className="flex-1 md:flex-none md:px-16 px-3 py-3 rounded-lg border text-sm font-bold bg-[#e6f9f0] border-[#00e676] text-[#00e676]">8 GB</button>
                      <button className="flex-1 md:flex-none md:px-[60px] px-3 py-3 rounded-lg border text-sm font-bold bg-white border-gray-500 text-gray-700">16 GB</button>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-700 text-sm mb-1">Keyboard:</div>
                    <div className="flex gap-2">
                      <button className="flex-1 md:flex-none md:px-12 px-3 py-3 rounded-lg border text-sm font-bold bg-[#e6f9f0] border-[#00e676] text-[#00e676]">ENGLISH</button>
                      <button className="flex-1 md:flex-none md:px-3 px-2 py-3 rounded-lg border text-sm font-bold bg-white border-gray-500 text-gray-700">ENGLISH & ARABIC</button>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-700 text-sm mb-1">Screen Size:</div>
                    <div className="flex gap-2">
                      <button className="flex-1 md:flex-none md:px-18 px-3 py-3 rounded-lg border text-sm font-bold bg-[#e6f9f0] border-[#00e676] text-[#00e676]">14"</button>
                      <button className="flex-1 md:flex-none md:px-[68px] px-3 py-3 rounded-lg border text-sm font-bold bg-white border-gray-500 text-gray-700">17"</button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Debug info - temporary */}
              <div className="w-full mt-2 p-2 bg-blue-100 border border-blue-300 rounded text-xs">
                <strong>Debug:</strong> isFromAuction = {isFromAuction.toString()}, searchParams = "{searchParams.toString()}"
              </div>
              
              {/* Conditional buttons based on auction context */}
              {isFromAuction ? (
                <>
                  {/* Countdown Timer */}
                  <div className="w-full mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                    <div className="text-sm font-semibold text-red-600 mb-1">Auction Ends In:</div>
                    <div className="text-2xl font-bold text-red-700">
                      {Math.floor(timeLeft / 3600)}:{String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
                    </div>
                  </div>
                  
                  {/* Bid Button */}
                  <button 
                    onClick={() => setShowBidModal(true)}
                    className="w-full mt-3 bg-gradient-to-b from-[#ff6b35] via-[#e55a2b] to-[#cc4922] text-white font-bold py-3 rounded-lg shadow hover:from-[#cc4922] via-[#e55a2b] hover:to-[#ff6b35] transition text-lg"
                  >
                    Place Your Bid
                  </button>
                </>
              ) : (
                <>
                  {/* Regular store buttons */}
                  <Link href="/view-cart">
                    <button className="w-full mt-4 bg-gradient-to-b from-[#6adb4d] via-[#54b056] to-[#468e5d] text-white font-bold py-3 rounded-lg shadow hover:from-[#468e5d] via-[#54b056] hover:to-[#6adb4d] transition text-lg">
                      Add to Cart
                    </button>
                  </Link>
                  
                  <Link href="/comparison?product1=sample">
                    <button className="w-full mt-3 bg-gradient-to-b from-[#6adb4d] via-[#54b056] to-[#468e5d] text-white font-bold py-3 rounded-lg shadow hover:from-[#468e5d] via-[#54b056] hover:to-[#6adb4d] transition text-lg">
                      Compare Product
                    </button>
                  </Link>
                </>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-xl border border-gray-500 flex flex-col items-center justify-center py-6 px-2 text-center">
                <span className="font-bold text-base text-[#00e676]">What's Included</span>
              </div>
              <div className="bg-white rounded-xl border border-gray-500 flex flex-col items-center justify-center py-6 px-2 text-center">
                <MdCable className="text-gray-700 text-3xl mx-auto mb-2" />
                <span className="text-xs font-semibold text-gray-700">Charger</span>
              </div>
              <div className="bg-white rounded-xl border border-gray-500 flex flex-col items-center justify-center py-6 px-2 text-center">
                <FaLaptop className="text-gray-700 text-3xl mx-auto mb-2" />
                <span className="text-xs font-semibold text-gray-700">Laptop</span>
              </div>
            </div>
            {/* Technical Specifications - Always show for all products */}
            <div className="mt-6">
              <div className="bg-white rounded-xl border border-gray-300 shadow p-6">
                <button
                  className="flex items-center justify-between w-full font-bold text-lg text-gray-900 focus:outline-none"
                  onClick={() => setShowSpecs((s) => !s)}
                >
                  Technical Specifications
                  <FaChevronUp className={`ml-2 transition-transform duration-200 ${showSpecs ? '' : 'rotate-180'}`} />
                </button>
                {showSpecs && (
                  <div className="mt-4 flex flex-col gap-y-1 text-xs">
                    {getTechnicalSpecs().length > 0 ? (
                      getTechnicalSpecs().map((spec, i) => (
                        <div key={i} className="flex gap-2 mb-1">
                          <span className="font-bold text-gray-900 min-w-[120px]">{spec.label}</span>
                          <span className="text-gray-700">{spec.value}</span>
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
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center mt-10">
          <div className="mx-auto max-w-[1200px] w-full">
            <div className="font-bold text-3xl ml-10 mb-4 text-left">Similar Products</div>
            <div className="flex items-center justify-center">
              <button onClick={handlePrev} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white shadow mr-2 disabled:opacity-50" disabled={carouselIndex === 0}>
                <FaChevronLeft />
              </button>
              <div className="flex gap-4 overflow-hidden justify-center">
                {similarProducts.slice(carouselIndex, carouselIndex + visibleCount).map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-gray-300 p-6 relative flex flex-col min-w-[200px] max-w-[220px] w-[210px] h-full shadow-sm">
                    <span className="absolute top-2 left-2 bg-green-400 text-white text-xs font-bold py-1 px-3 rounded-full z-10">{item.discount}</span>
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
                    <img src={item.image} alt={item.name} className="w-full h-28 object-contain my-2" />
                    <h3 className="text-sm font-bold text-gray-800 mt-2 mb-1 line-clamp-2 min-h-[38px]">{item.name}</h3>
                    <div className="text-xs text-gray-500 mb-1">{item.specs}</div>
                    <p className="text-md font-bold text-black mt-auto">{item.price}</p>
                  </div>
                ))}
              </div>
              <button onClick={handleNext} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white shadow ml-2 disabled:opacity-50" disabled={carouselIndex === maxIndex}>
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Place Your Bid</h3>
              <button 
                onClick={() => setShowBidModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Current Price: PKR 130,000</div>
              <div className="text-xs text-gray-500 mb-4">Your bid must be higher than the current price</div>
              
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 font-semibold">PKR</span>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Enter your bid amount"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-lg font-semibold"
                  min="130001"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowBidModal(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBidSubmit}
                disabled={isSubmittingBid}
                className="flex-1 py-3 bg-gradient-to-b from-[#ff6b35] via-[#e55a2b] to-[#cc4922] text-white rounded-lg font-semibold hover:from-[#cc4922] via-[#e55a2b] hover:to-[#ff6b35] transition disabled:opacity-50"
              >
                {isSubmittingBid ? 'Submitting...' : 'Submit Bid'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default ProductPage;