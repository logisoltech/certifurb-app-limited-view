'use client';
import { useState } from 'react';
import Layout from '../../Components/Layout/Layout';
import { font } from "../../../Components/Font/font";
import {
  DocumentArrowUpIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

const BulkUploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  
  // New states for bulk image upload
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Sample CSV format for reference
  const sampleCsvData = [
    {
      productName: "Dell Latitude 7420",
      productDesc: "High-performance business laptop with excellent build quality",
      productPrice: "85000",
      productCategory: "Laptop",
      productImageURL: "https://example.com/dell-latitude-7420.jpg",
      productStorage: "512GB",
      productRam: "16GB",
      productKeyboard: "Backlit English",
      productScreenSize: "14\"",
      productModel: "Latitude 7420",
      productBrand: "Dell",
      productCpu: "Intel Core i7-11th Gen",
      productGraphics: "Intel Iris Xe",
      productWeight: "1.4kg",
      productResolution: "1920x1080",
      productOs: "Windows 11 Pro",
      productBattery: "Up to 10 hours",
      productBluetooth: "Bluetooth 5.2",
      productWifi: "Wi-Fi 6",
      productCamera: "720p HD Webcam",
      productAudio: "Dual stereo speakers"
    }
  ];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      parseCSV(file);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const parseCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split('\n');
      const headers = rows[0].split(',').map(h => h.trim());
      
      const data = [];
      for (let i = 1; i < rows.length; i++) {
        if (rows[i].trim()) {
          const values = rows[i].split(',').map(v => v.trim().replace(/"/g, ''));
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index] || '';
          });
          data.push(rowData);
        }
      }
      
      setCsvData(data);
      setShowPreview(true);
    };
    reader.readAsText(file);
  };

  const handleBulkUpload = async () => {
    if (!csvData.length) {
      alert('No data to upload');
      return;
    }

    setUploading(true);
    setUploadResults(null);

    try {
      const response = await fetch('https://api.certifurb.com/api/products/bulk-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products: csvData }),
      });

      const result = await response.json();
      setUploadResults(result);

      if (result.success) {
        alert(`Successfully uploaded ${result.successCount} products!`);
        // Reset form
        setSelectedFile(null);
        setCsvData([]);
        setShowPreview(false);
        document.getElementById('csv-upload').value = '';
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
      alert('Error uploading CSV file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle bulk image upload
  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages(files);
  };

  const uploadImagesToCloudinary = async () => {
    if (selectedImages.length === 0) {
      alert('Please select images first');
      return;
    }

    setUploadingImages(true);
    const uploadedUrls = [];

    try {
      for (let i = 0; i < selectedImages.length; i++) {
        const file = selectedImages[i];
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
          uploadedUrls.push({
            filename: file.name,
            url: imageUrl
          });
        } else {
          console.error(`Failed to upload ${file.name}:`, result.message);
        }
      }

      setUploadedImageUrls(uploadedUrls);
      alert(`Successfully uploaded ${uploadedUrls.length} images!`);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const copyUrlsToClipboard = () => {
    const urlText = uploadedImageUrls.map(img => `${img.filename}: ${img.url}`).join('\n');
    navigator.clipboard.writeText(urlText);
    alert('Image URLs copied to clipboard!');
  };

  // Sample data for different product categories
  const getSampleDataByCategory = (category) => {
    const commonHeaders = [
      'productName', 'productDesc', 'productPrice', 'productCategory', 'productImageURL',
      'productModel', 'productBrand', 'productWeight'
    ];

    const categoryData = {
      'Laptop': {
        headers: [...commonHeaders, 'productStorage', 'productRam', 'productKeyboard', 'productScreenSize', 'productCpu', 'productGraphics', 'productResolution', 'productOs', 'productBattery', 'productBluetooth', 'productWifi', 'productCamera', 'productAudio'],
        sample: {
          productName: "Dell Latitude 7420",
          productDesc: "High-performance business laptop with excellent build quality",
          productPrice: "85000",
          productCategory: "Laptop",
          productImageURL: "https://example.com/dell-latitude-7420.jpg",
          productModel: "Latitude 7420",
          productBrand: "Dell",
          productWeight: "1.4kg",
          productStorage: "512GB SSD",
          productRam: "16GB",
          productKeyboard: "Backlit English",
          productScreenSize: "14\"",
          productCpu: "Intel Core i7-11th Gen",
          productGraphics: "Intel Iris Xe",
          productResolution: "1920x1080",
          productOs: "Windows 11 Pro",
          productBattery: "Up to 10 hours",
          productBluetooth: "Bluetooth 5.2",
          productWifi: "Wi-Fi 6",
          productCamera: "720p HD Webcam",
          productAudio: "Dual stereo speakers"
        }
      },
      'Desktop PC': {
        headers: [...commonHeaders, 'productStorage', 'productRam', 'productKeyboard', 'productScreenSize', 'productCpu', 'productGraphics', 'productOs', 'productBluetooth', 'productWifi', 'productAudio'],
        sample: {
          productName: "HP EliteDesk 800 G6",
          productDesc: "Compact desktop PC perfect for office work and productivity",
          productPrice: "75000",
          productCategory: "Desktop PC",
          productImageURL: "https://example.com/hp-elitedesk-800.jpg",
          productModel: "EliteDesk 800 G6",
          productBrand: "HP",
          productWeight: "4.2kg",
          productStorage: "1TB HDD + 256GB SSD",
          productRam: "16GB",
          productKeyboard: "English",
          productScreenSize: "No Display",
          productCpu: "Intel Core i5-10th Gen",
          productGraphics: "Intel UHD Graphics",
          productOs: "Windows 11 Pro",
          productBluetooth: "Bluetooth 5.0",
          productWifi: "Wi-Fi 6",
          productAudio: "Integrated audio"
        }
      },
      'LCD': {
        headers: [...commonHeaders, 'productKeyboard', 'productRam', 'productScreenSize', 'productStorage'],
        sample: {
          productName: "ASUS ProArt Display PA278QV",
          productDesc: "27-inch WQHD monitor with accurate colors for professional work",
          productPrice: "45000",
          productCategory: "LCD",
          productImageURL: "https://example.com/asus-proart-pa278qv.jpg",
          productModel: "PA278QV",
          productBrand: "ASUS",
          productWeight: "6.4kg",
          productKeyboard: "IPS",
          productRam: "2560x1440",
          productScreenSize: "27\"",
          productStorage: "75Hz"
        }
      },
      'LED': {
        headers: [...commonHeaders, 'productKeyboard', 'productRam', 'productScreenSize', 'productStorage'],
        sample: {
          productName: "Samsung Odyssey G7 32\"",
          productDesc: "Curved gaming monitor with high refresh rate and vibrant colors",
          productPrice: "65000",
          productCategory: "LED",
          productImageURL: "https://example.com/samsung-odyssey-g7.jpg",
          productModel: "Odyssey G7",
          productBrand: "Samsung",
          productWeight: "8.2kg",
          productKeyboard: "VA",
          productRam: "2560x1440",
          productScreenSize: "32\"",
          productStorage: "240Hz"
        }
      },
      'Keyboard': {
        headers: [...commonHeaders, 'productKeyboard', 'productRam', 'productStorage', 'productScreenSize'],
        sample: {
          productName: "Logitech MX Keys",
          productDesc: "Advanced wireless illuminated keyboard for productivity",
          productPrice: "12000",
          productCategory: "Keyboard",
          productImageURL: "https://example.com/logitech-mx-keys.jpg",
          productModel: "MX Keys",
          productBrand: "Logitech",
          productWeight: "810g",
          productKeyboard: "Mechanical",
          productRam: "Wireless",
          productStorage: "Full Size",
          productScreenSize: "Backlit"
        }
      },
      'Mouse': {
        headers: [...commonHeaders, 'productKeyboard', 'productRam'],
        sample: {
          productName: "Logitech MX Master 3",
          productDesc: "Advanced wireless mouse for productivity and precision",
          productPrice: "8500",
          productCategory: "Mouse",
          productImageURL: "https://example.com/logitech-mx-master-3.jpg",
          productModel: "MX Master 3",
          productBrand: "Logitech",
          productWeight: "141g",
          productKeyboard: "Wireless",
          productRam: "4000 DPI"
        }
      },
      'Printer': {
        headers: [...commonHeaders, 'productKeyboard', 'productRam', 'productStorage', 'productScreenSize'],
        sample: {
          productName: "HP LaserJet Pro M404dn",
          productDesc: "Fast and reliable monochrome laser printer for office use",
          productPrice: "35000",
          productCategory: "Printer",
          productImageURL: "https://example.com/hp-laserjet-m404dn.jpg",
          productModel: "LaserJet Pro M404dn",
          productBrand: "HP",
          productWeight: "11.8kg",
          productKeyboard: "Laser",
          productRam: "Monochrome",
          productStorage: "A4",
          productScreenSize: "Ethernet + USB"
        }
      },
      'Tablet': {
        headers: [...commonHeaders, 'productKeyboard', 'productRam', 'productStorage', 'productScreenSize', 'productCamera', 'productBattery'],
        sample: {
          productName: "iPad Air 5th Generation",
          productDesc: "Powerful and versatile tablet with M1 chip for work and creativity",
          productPrice: "95000",
          productCategory: "Tablet",
          productImageURL: "https://example.com/ipad-air-5th-gen.jpg",
          productModel: "iPad Air 5th Gen",
          productBrand: "Apple",
          productWeight: "461g",
          productKeyboard: "iPadOS",
          productRam: "8GB",
          productStorage: "256GB",
          productScreenSize: "10.9\"",
          productCamera: "12MP Wide + 12MP Ultra Wide",
          productBattery: "Up to 10 hours"
        }
      },
      'Drive': {
        headers: [...commonHeaders, 'productKeyboard', 'productRam', 'productStorage', 'productScreenSize'],
        sample: {
          productName: "Samsung 980 PRO NVMe SSD",
          productDesc: "High-performance NVMe SSD for gaming and professional applications",
          productPrice: "15000",
          productCategory: "Drive",
          productImageURL: "https://example.com/samsung-980-pro.jpg",
          productModel: "980 PRO",
          productBrand: "Samsung",
          productWeight: "8g",
          productKeyboard: "NVMe SSD",
          productRam: "PCIe 4.0",
          productStorage: "1TB",
          productScreenSize: "M.2 2280"
        }
      },
      'Network': {
        headers: [...commonHeaders, 'productKeyboard', 'productRam', 'productStorage', 'productScreenSize'],
        sample: {
          productName: "TP-Link Archer AX73 WiFi 6 Router",
          productDesc: "High-speed WiFi 6 router with advanced security features",
          productPrice: "18000",
          productCategory: "Network",
          productImageURL: "https://example.com/tp-link-archer-ax73.jpg",
          productModel: "Archer AX73",
          productBrand: "TP-Link",
          productWeight: "1.2kg",
          productKeyboard: "WiFi 6 Router",
          productRam: "AX5400",
          productStorage: "6 Ports",
          productScreenSize: "Up to 300m"
        }
      }
    };

    return categoryData[category] || categoryData['Laptop'];
  };

  const downloadSampleCSV = (category = 'Laptop') => {
    const categoryData = getSampleDataByCategory(category);
    const headers = categoryData.headers;
    const sampleData = categoryData.sample;

    const csvContent = [
      headers.join(','),
      headers.map(header => `"${sampleData[header] || ''}"`).join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sample-${category.toLowerCase().replace(' ', '-')}-products.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <Layout>
      <div className={`${font.className} p-6 bg-gray-50 min-h-screen`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Upload Products</h1>
              <p className="text-gray-600">Upload multiple products from a CSV file</p>
            </div>
          </div>
          
          {/* Sample CSV Downloads */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Download Sample CSV Templates</h2>
            <p className="text-gray-600 mb-4">Choose the appropriate template for your product category:</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { name: 'Laptop', icon: '💻', bgClass: 'bg-blue-50 hover:bg-blue-100 border-blue-200', textClass: 'text-blue-700', subTextClass: 'text-blue-600' },
                { name: 'Desktop PC', icon: '🖥️', bgClass: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200', textClass: 'text-indigo-700', subTextClass: 'text-indigo-600' },
                { name: 'LCD', icon: '📺', bgClass: 'bg-purple-50 hover:bg-purple-100 border-purple-200', textClass: 'text-purple-700', subTextClass: 'text-purple-600' },
                { name: 'LED', icon: '🖥️', bgClass: 'bg-pink-50 hover:bg-pink-100 border-pink-200', textClass: 'text-pink-700', subTextClass: 'text-pink-600' },
                { name: 'Keyboard', icon: '⌨️', bgClass: 'bg-green-50 hover:bg-green-100 border-green-200', textClass: 'text-green-700', subTextClass: 'text-green-600' },
                { name: 'Mouse', icon: '🖱️', bgClass: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200', textClass: 'text-yellow-700', subTextClass: 'text-yellow-600' },
                { name: 'Printer', icon: '🖨️', bgClass: 'bg-red-50 hover:bg-red-100 border-red-200', textClass: 'text-red-700', subTextClass: 'text-red-600' },
                { name: 'Tablet', icon: '📱', bgClass: 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200', textClass: 'text-cyan-700', subTextClass: 'text-cyan-600' },
                { name: 'Drive', icon: '💾', bgClass: 'bg-orange-50 hover:bg-orange-100 border-orange-200', textClass: 'text-orange-700', subTextClass: 'text-orange-600' },
                { name: 'Network', icon: '🌐', bgClass: 'bg-teal-50 hover:bg-teal-100 border-teal-200', textClass: 'text-teal-700', subTextClass: 'text-teal-600' }
              ].map((category) => (
                <button
                  key={category.name}
                  onClick={() => downloadSampleCSV(category.name)}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 ${category.bgClass} transition-colors group`}
                >
                  <span className="text-2xl mb-2">{category.icon}</span>
                  <span className={`text-sm font-medium ${category.textClass} text-center`}>
                    {category.name}
                  </span>
                  <span className={`text-xs ${category.subTextClass} mt-1`}>
                    CSV Template
                  </span>
                </button>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                💡 <strong>Tip:</strong> Each template contains category-specific fields. For example:
              </p>
              <ul className="text-xs text-gray-500 mt-2 ml-4 space-y-1">
                <li>• <strong>Monitors (LCD/LED):</strong> Panel Type, Resolution, Screen Size, Refresh Rate</li>
                <li>• <strong>Laptops:</strong> CPU, RAM, Storage, Screen Size, Graphics, etc.</li>
                <li>• <strong>Mice:</strong> Type, DPI, Connection Type</li>
                <li>• <strong>Keyboards:</strong> Switch Type, Connectivity, Layout, Features</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 1: Bulk Image Upload */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Upload Product Images (Optional)</h2>
          <p className="text-gray-600 mb-4">Upload all your product images first to get their URLs for the CSV file.</p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
            <CloudArrowUpIcon className="mx-auto h-10 w-10 text-gray-400 mb-3" />
            <p className="text-gray-600 mb-2">
              {selectedImages.length > 0 ? `${selectedImages.length} images selected` : 'Select multiple product images'}
            </p>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors mr-3"
            >
              <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
              Choose Images
            </label>
            <button
              onClick={uploadImagesToCloudinary}
              disabled={uploadingImages || selectedImages.length === 0}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploadingImages ? 'Uploading...' : 'Upload to Cloudinary'}
            </button>
          </div>

          {/* Display uploaded image URLs */}
          {uploadedImageUrls.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-green-900">Uploaded Images ({uploadedImageUrls.length})</h3>
                <button
                  onClick={copyUrlsToClipboard}
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                >
                  Copy URLs
                </button>
              </div>
              <div className="max-h-40 overflow-y-auto">
                {uploadedImageUrls.map((img, index) => (
                  <div key={index} className="text-xs text-green-800 mb-1 break-all">
                    <strong>{img.filename}:</strong> {img.url}
                  </div>
                ))}
              </div>
              <p className="text-xs text-green-700 mt-2">
                💡 Copy these URLs and paste them in the productImageURL column of your CSV file
              </p>
            </div>
          )}
        </div>

        {/* Step 2: CSV Upload Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Upload CSV File</h2>
          
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">
              {selectedFile ? selectedFile.name : 'Select your CSV file or drag and drop it here'}
            </p>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label
              htmlFor="csv-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
            >
              <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
              Choose CSV File
            </label>
          </div>

          {/* CSV Format Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 mb-2">CSV Format Requirements:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Required columns: productName, productDesc, productPrice, productCategory</li>
                  <li>• Optional columns: productImageURL, productStorage, productRam, productKeyboard, productScreenSize</li>
                  <li>• Technical specs: productModel, productBrand, productCpu, productGraphics, etc.</li>
                  <li>• Image URLs: Use direct links to image files (jpg, png, etc.) or leave blank to use default</li>
                  <li>• Prices should be in PKR (numbers only, no currency symbols)</li>
                  <li>• Categories: Laptop, Desktop PC, Keyboard, Mouse, LCD, LED, Printer, Tablet, Drive, Network, GOAT Product</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && csvData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Preview ({csvData.length} products)</h2>
              <button
                onClick={handleBulkUpload}
                disabled={uploading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? 'Uploading...' : 'Upload All Products'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {csvData.slice(0, 10).map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">{product.productName}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{product.productCategory}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">PKR {product.productPrice}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{product.productDesc?.substring(0, 50)}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {csvData.length > 10 && (
                <p className="text-sm text-gray-500 mt-2">Showing first 10 products of {csvData.length} total</p>
              )}
            </div>
          </div>
        )}

        {/* Upload Results */}
        {uploadResults && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Results</h2>
            
            <div className="space-y-4">
              {uploadResults.success && (
                <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-green-800">
                    Successfully uploaded {uploadResults.successCount} products
                  </span>
                </div>
              )}

              {uploadResults.errors && uploadResults.errors.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <XCircleIcon className="h-5 w-5 text-red-600 mr-3" />
                    <span className="text-red-800 font-medium">
                      {uploadResults.errors.length} products failed to upload
                    </span>
                  </div>
                  <div className="ml-8 space-y-1">
                    {uploadResults.errors.slice(0, 10).map((error, index) => (
                      <p key={index} className="text-sm text-red-700">
                        Row {error.row}: {error.message}
                      </p>
                    ))}
                    {uploadResults.errors.length > 10 && (
                      <p className="text-sm text-red-600">... and {uploadResults.errors.length - 10} more errors</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BulkUploadPage; 