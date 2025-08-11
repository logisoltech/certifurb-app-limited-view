'use client';
import { useState } from 'react';
import Layout from '../../Components/Layout/Layout';
import { font } from "../../../Components/Font/font";
import {
  PhotoIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AddProductPage = () => {
  const [productTitle, setProductTitle] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [regularPrice, setRegularPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [storage, setStorage] = useState('');
  const [ram, setRam] = useState('');
  const [keyboard, setKeyboard] = useState('');
  const [screenSize, setScreenSize] = useState('');
  const [category, setCategory] = useState("Technology");
  const [vendor, setVendor] = useState("Technology");
  const [collection, setCollection] = useState('');
  const [tags, setTags] = useState("Technology");
  const [sizeOption, setSizeOption] = useState('Size');
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Technical Specification Fields
  const [model, setModel] = useState('');
  const [graphics, setGraphics] = useState('');
  const [weight, setWeight] = useState('');
  const [cpu, setCpu] = useState('');
  const [resolution, setResolution] = useState('');
  const [os, setOs] = useState('');
  const [battery, setBattery] = useState('');
  const [bluetooth, setBluetooth] = useState('');
  const [wifi, setWifi] = useState('');
  const [camera, setCamera] = useState('');
  const [audio, setAudio] = useState('');
  const [brand, setBrand] = useState('');

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

  // New function for category-specific field 1 (replaces keyboard for some categories)
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
    return getKeyboardOptions(); // For Laptop, Desktop PC, Keyboard
  };

  // New function for category-specific field 2 (replaces ram for some categories)
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
    return getRamOptions(); // For Laptop, Desktop PC, Tablet
  };

  // New function for category-specific field 3 (replaces storage for some categories)
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
    return getStorageOptions(); // For Laptop, Desktop PC, Tablet
  };

  // New function for category-specific field 4 (replaces screen size for some categories)
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
    return getScreenSizeOptions(); // For Laptop, Desktop PC, Tablet
  };

  // Labels for the fields based on category
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

  // Helper function to determine how many fields to show for each category
  const getFieldCount = () => {
    if (productCategory === 'Mouse') {
      return 2; // Only show Type and DPI
    }
    return 4; // All other categories show 4 fields
  };

  const handleCategoryChange = (newCategory) => {
    setProductCategory(newCategory);
    setStorage('');
    setRam('');
    setKeyboard('');
    setScreenSize('');
  };

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', 'products');

        const response = await fetch('https://api.certifurb.com/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          const imageUrl = result.data.secure_url || result.data.url;
          if (imageUrl) {
            uploadedUrls.push(imageUrl);
            console.log('Image uploaded successfully:', imageUrl);
          } else {
            console.error('No URL found in response:', result.data);
            alert(`Failed to get URL for ${file.name}`);
          }
        } else {
          console.error('Failed to upload image:', result.message);
          alert(`Failed to upload ${file.name}: ${result.message}`);
        }
      }

      setSelectedImages(prev => [...prev, ...uploadedUrls]);
      if (uploadedUrls.length > 0) {
        console.log('All images uploaded. Total URLs:', uploadedUrls);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  const removeImage = (indexToRemove) => {
    setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async () => {
    if (!productTitle.trim()) {
      alert('Please enter a product title');
      return;
    }
    if (!productDescription.trim()) {
      alert('Please enter a product description');
      return;
    }
    if (!regularPrice.trim()) {
      alert('Please enter a regular price');
      return;
    }
    if (!productCategory) {
      alert('Please select a product category');
      return;
    }
    if (!keyboard) {
      alert(`Please select ${getFieldLabels().field1.toLowerCase()} option`);
      return;
    }
    if (!ram) {
      alert(`Please select ${getFieldLabels().field2.toLowerCase()} option`);
      return;
    }
    if (getFieldCount() > 2 && !storage) {
      alert(`Please select ${getFieldLabels().field3.toLowerCase()} option`);
      return;
    }
    if (getFieldCount() > 3 && !screenSize) {
      alert(`Please select ${getFieldLabels().field4.toLowerCase()} option`);
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        productName: productTitle.trim(),
        productDesc: productDescription.trim(),
        productPrice: salePrice.trim() || regularPrice.trim(),
        productImageURL: selectedImages.length > 0 ? selectedImages[0] : null,
        productCategory: productCategory,
        productField1: keyboard,  // Field 1 (Type/Keyboard/OS/etc.)
        productField2: ram,       // Field 2 (DPI/RAM/Speed/etc.)
        productField3: getFieldCount() > 2 ? storage : null,   // Field 3 (Memory/Storage/Ports/etc.)
        productField4: getFieldCount() > 3 ? screenSize : null, // Field 4 (Ergonomics/Screen/Features/etc.)
        // Keep old field names for backward compatibility
        productStorage: getFieldCount() > 2 ? storage : null,
        productRam: ram,
        productKeyboard: keyboard,
        productScreenSize: getFieldCount() > 3 ? screenSize : null,
        // Technical Specifications
        productModel: model.trim(),
        productGraphics: graphics.trim(),
        productWeight: weight.trim(),
        productCpu: cpu.trim(),
        productResolution: resolution.trim(),
        productOs: os.trim(),
        productBattery: battery.trim(),
        productBluetooth: bluetooth.trim(),
        productWifi: wifi.trim(),
        productCamera: camera.trim(),
        productAudio: audio.trim(),
        productBrand: brand.trim(),
        // Add field labels for reference
        field1Label: getFieldLabels().field1,
        field2Label: getFieldLabels().field2,
        field3Label: getFieldCount() > 2 ? getFieldLabels().field3 : null,
        field4Label: getFieldCount() > 3 ? getFieldLabels().field4 : null
      };

      const response = await fetch('https://api.certifurb.com/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Product added successfully!');
        setProductTitle('');
        setProductDescription('');
        setRegularPrice('');
        setSalePrice('');
        setProductCategory('');
        setStorage('');
        setRam('');
        setKeyboard('');
        setScreenSize('');
        setSelectedImages([]);
        setCategory("Electronics");
        setVendor("Technology");
        setCollection('');
        setTags("Technology");
        setSizeOption('Size');
        // Reset technical specifications
        setModel('');
        setGraphics('');
        setWeight('');
        setCpu('');
        setResolution('');
        setOs('');
        setBattery('');
        setBluetooth('');
        setWifi('');
        setCamera('');
        setAudio('');
        setBrand('');
      } else {
        alert(`Failed to add product: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className={`${font.className} p-6 bg-gray-50 min-h-screen`}>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="text-blue-600 hover:underline cursor-pointer">Home</span>
          <span className="mx-2">›</span>
          <span className="text-blue-600 hover:underline cursor-pointer">Admin</span>
          <span className="mx-2">›</span>
          <span>Add Product</span>
        </div>

        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add a product</h1>
            <p className="text-gray-600">Orders placed across your store</p>
          </div>
        </div>

        {/* Fixed Action Buttons - Stacked on Right Side */}
        <div className="fixed top-1/2 right-8 transform -translate-y-1/2 z-50 flex flex-col space-y-3 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <button 
            onClick={() => {
              setProductTitle('');
              setProductDescription('');
              setRegularPrice('');
              setSalePrice('');
              setProductCategory('');
              setStorage('');
              setRam('');
              setKeyboard('');
              setScreenSize('');
              setSelectedImages([]);
              setCategory("Technology");
              setVendor("Technology");
              setCollection('');
              setTags("Technology");
              setSizeOption('Size');
              // Reset technical specifications
              setModel('');
              setGraphics('');
              setWeight('');
              setCpu('');
              setResolution('');
              setOs('');
              setBattery('');
              setBluetooth('');
              setWifi('');
              setCamera('');
              setAudio('');
              setBrand('');
            }}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Discard
          </button>
          <button className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
            Save draft
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSubmitting ? 'Publishing...' : 'Publish product'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Product Title
              </label>
              <input
                type="text"
                placeholder="Write title here..."
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Product Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={productCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  required
                >
                  <option value="">Select Category</option>
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
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {productCategory && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Specifications</h3>
                
                <div className={`grid grid-cols-1 ${getFieldCount() === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2'} gap-6`}>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      {getFieldLabels().field1} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={keyboard}
                        onChange={(e) => setKeyboard(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        required
                      >
                        <option value="">Select {getFieldLabels().field1}</option>
                        {getField1Options().map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      {getFieldLabels().field2} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={ram}
                        onChange={(e) => setRam(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        required
                      >
                        <option value="">Select {getFieldLabels().field2}</option>
                        {getField2Options().map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {getFieldCount() > 2 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        {getFieldLabels().field3} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={storage}
                          onChange={(e) => setStorage(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                          required
                        >
                          <option value="">Select {getFieldLabels().field3}</option>
                          {getField3Options().map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {getFieldCount() > 3 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        {getFieldLabels().field4} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={screenSize}
                          onChange={(e) => setScreenSize(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                          required
                        >
                          <option value="">Select {getFieldLabels().field4}</option>
                          {getField4Options().map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Technical Specifications Section */}
            {productCategory && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Model */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Model
                    </label>
                    <input
                      type="text"
                      placeholder="Enter product model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Graphics */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Graphics
                    </label>
                    <input
                      type="text"
                      placeholder="Enter graphics information"
                      value={graphics}
                      onChange={(e) => setGraphics(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Weight
                    </label>
                    <input
                      type="text"
                      placeholder="Enter weight (e.g., 2.5kg, 5.5lbs)"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* CPU */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      CPU
                    </label>
                    <input
                      type="text"
                      placeholder="Enter CPU information"
                      value={cpu}
                      onChange={(e) => setCpu(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Resolution */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Resolution
                    </label>
                    <input
                      type="text"
                      placeholder="Enter screen resolution (e.g., 1920x1080)"
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Operating System */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Operating System
                    </label>
                    <input
                      type="text"
                      placeholder="Enter OS information"
                      value={os}
                      onChange={(e) => setOs(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Battery */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Battery
                    </label>
                    <input
                      type="text"
                      placeholder="Enter battery information"
                      value={battery}
                      onChange={(e) => setBattery(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Bluetooth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Bluetooth
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Bluetooth version/info"
                      value={bluetooth}
                      onChange={(e) => setBluetooth(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* WiFi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      WiFi
                    </label>
                    <input
                      type="text"
                      placeholder="Enter WiFi specifications"
                      value={wifi}
                      onChange={(e) => setWifi(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Camera */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Camera
                    </label>
                    <input
                      type="text"
                      placeholder="Enter camera specifications"
                      value={camera}
                      onChange={(e) => setCamera(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Audio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Audio
                    </label>
                    <input
                      type="text"
                      placeholder="Enter audio specifications"
                      value={audio}
                      onChange={(e) => setAudio(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Brand
                    </label>
                    <input
                      type="text"
                      placeholder="Enter brand name"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Product Description
              </label>
              
              <div className="border border-gray-300 rounded-t-lg p-3 bg-gray-50 flex items-center space-x-2">
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4l16 16m0 0V8m0 8H8" />
                  </svg>
                </button>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <div className="w-px h-4 bg-gray-300"></div>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded font-bold">B</button>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded italic">I</button>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded underline">U</button>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded line-through">S</button>
                <div className="w-px h-4 bg-gray-300"></div>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8M4 18h16" />
                  </svg>
                </button>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h4M4 18h16" />
                  </svg>
                </button>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="w-px h-4 bg-gray-300"></div>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </button>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
              </div>

              <textarea
                placeholder="Write a description here..."
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                rows={8}
                className="w-full px-3 py-3 border border-t-0 border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Display images
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-4">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">
                  {uploading ? 'Uploading...' : 'Drag your photo here or'}{' '}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="file-upload"
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    Browse from device
                  </label>
                </p>
                {uploading && (
                  <div className="text-sm text-gray-500">Please wait while images are uploading...</div>
                )}
              </div>

              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={imageUrl} 
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <h3 className="text-lg font-semibold text-gray-900 p-6 pb-0">Inventory</h3>
              
              <div className="flex">
                <div className="w-48 border-r border-gray-200">
                  <nav className="p-4 space-y-1">
                    <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700">
                      <div className="flex items-center justify-center w-5 h-5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Pricing</span>
                    </div>

                    <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-center w-5 h-5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Restock</span>
                    </div>

                    <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-center w-5 h-5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Shipping</span>
                    </div>

                   
                  </nav>
                </div>

                <div className="flex-1 p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Regular price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={regularPrice}
                          onChange={(e) => setRegularPrice(e.target.value)}
                          className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sale price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={salePrice}
                          onChange={(e) => setSalePrice(e.target.value)}
                          className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </Layout>
  );
};

export default AddProductPage;