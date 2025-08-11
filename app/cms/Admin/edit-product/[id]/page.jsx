'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Layout from '../../../Components/Layout/Layout';
import { font } from "../../../../Components/Font/font";

const EditProduct = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    productDesc: '',
    productPrice: '',
    productCategory: '',
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    productImage: null,
    imagePreview: ''
  });

  // Load existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // First try to get individual product
        let response = await fetch(`https://api.certifurb.com/api/products/${productId}`);
        
        console.log('Individual product response status:', response.status);
        
        // If individual product endpoint doesn't work, try getting all products and filter
        if (!response.ok) {
          console.log('Individual product endpoint failed, trying all products...');
          response = await fetch(`https://api.certifurb.com/api/products`);
          
          if (response.ok) {
            const responseText = await response.text();
            const result = JSON.parse(responseText);
            
            if (result.success && result.data) {
              const product = result.data.find(p => p.ProductID === productId);
              if (product) {
                setFormData({
                  productName: product.ProductName || '',
                  productDesc: product.ProductDesc || '',
                  productPrice: product.ProductPrice || '',
                  productCategory: product.ProductCategory || '',
                  field1: product.ProductStorage || '',
                  field2: product.ProductRam || '',
                  field3: product.ProductScreenSize || '',
                  field4: product.ProductKeyboard || '',
                  productImage: null,
                  imagePreview: product.ProductImageURL || ''
                });
                return;
              } else {
                setError(`Product with ID ${productId} not found`);
                return;
              }
            }
          }
          
          setError('Unable to fetch product data from server');
          return;
        }
        
        const responseText = await response.text();
        console.log('Raw response:', responseText.substring(0, 200));
        
        // Check if response is JSON
        let result;
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          console.error('Response was:', responseText.substring(0, 200) + '...');
          setError(`Server returned invalid response. Expected JSON but got HTML/other content.`);
          return;
        }
        
        if (result.success) {
          const product = result.data;
          setFormData({
            productName: product.ProductName || '',
            productDesc: product.ProductDesc || '',
            productPrice: product.ProductPrice || '',
            productCategory: product.ProductCategory || '',
            field1: product.ProductStorage || '',
            field2: product.ProductRam || '',
            field3: product.ProductScreenSize || '',
            field4: product.ProductKeyboard || '',
            productImage: null,
            imagePreview: product.ProductImageURL || ''
          });
        } else {
          setError(result.message || 'Failed to load product data');
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        setError(`Network error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Get field labels based on category
  const getFieldLabels = () => {
    switch (formData.productCategory) {
      case 'Laptop':
        return { field1: 'Storage', field2: 'RAM', field3: 'Screen Size', field4: 'Keyboard' };
      case 'Desktop PC':
        return { field1: 'Storage', field2: 'RAM', field3: 'Screen', field4: 'Keyboard Type' };
      case 'Keyboard':
        return { field1: 'Layout', field2: 'Connectivity', field3: 'Features', field4: 'Switch Type' };
      case 'Mouse':
        return { field1: 'Type', field2: 'DPI' };
      case 'LCD':
      case 'LED':
        return { field1: 'Panel Type', field2: 'Resolution', field3: 'Screen Size', field4: 'Refresh Rate' };
      case 'Printer':
        return { field1: 'Paper Size', field2: 'Print Quality', field3: 'Connectivity', field4: 'Type' };
      case 'Tablet':
        return { field1: 'Storage', field2: 'RAM', field3: 'Screen Size', field4: 'Operating System' };
      case 'Drive':
        return { field1: 'Capacity Range', field2: 'Interface', field3: 'Form Factor', field4: 'Drive Type' };
      case 'Network':
        return { field1: 'Range', field2: 'Speed', field3: 'Ports', field4: 'Device Type' };
      default:
        return { field1: 'Field 1', field2: 'Field 2', field3: 'Field 3', field4: 'Field 4' };
    }
  };

  // Get field count (Mouse only has 2 fields)
  const getFieldCount = () => {
    return formData.productCategory === 'Mouse' ? 2 : 4;
  };

  const getOptions = (fieldName) => {
    const labels = getFieldLabels();
    const fieldLabel = labels[fieldName];
    
    // Return options based on field label and category
    switch (fieldLabel) {
      case 'Storage':
        if (formData.productCategory === 'Laptop' || formData.productCategory === 'Desktop PC') {
          return ['128GB', '256GB', '512GB', '1TB', '2TB'];
        } else if (formData.productCategory === 'Tablet') {
          return ['64GB', '128GB', '256GB', '512GB', '1TB'];
        }
        break;
      case 'RAM':
        return ['4GB', '8GB', '16GB', '32GB', '64GB'];
      case 'Screen Size':
        if (formData.productCategory === 'Laptop') {
          return ['13"', '14"', '15.6"', '17"'];
        } else if (formData.productCategory === 'LCD' || formData.productCategory === 'LED') {
          return ['19"', '21.5"', '24"', '27"', '32"', '43"', '55"', '65"'];
        } else if (formData.productCategory === 'Tablet') {
          return ['7"', '8"', '10.1"', '11"', '12.9"'];
        }
        break;
      case 'Keyboard':
        return ['English', 'Arabic', 'French', 'Spanish'];
      case 'Screen':
        return ['No Display', 'Monitor Included', 'TV Display', 'Projector'];
      case 'Keyboard Type':
        return ['Mechanical', 'Membrane', 'Wireless', 'Gaming'];
      case 'Layout':
        return ['60%', '65%', '75%', '87%', 'Full Size'];
      case 'Connectivity':
        return ['Wired', 'Wireless', 'Bluetooth', 'USB-C'];
      case 'Features':
        return ['RGB Backlit', 'White Backlit', 'No Backlight', 'Programmable'];
      case 'Switch Type':
        return ['Mechanical', 'Membrane', 'Hybrid', 'Optical'];
      case 'Type':
        if (formData.productCategory === 'Mouse') {
          return ['Wired', 'Wireless', 'Gaming', 'Ergonomic'];
        } else if (formData.productCategory === 'Printer') {
          return ['Inkjet', 'Laser', 'All-in-One', 'Photo'];
        }
        break;
      case 'DPI':
        return ['800 DPI', '1200 DPI', '1600 DPI', '3200 DPI', '6400 DPI'];
      case 'Panel Type':
        return ['IPS', 'VA', 'TN', 'OLED', 'QLED'];
      case 'Resolution':
        return ['HD', 'Full HD', '4K', '8K', 'Curved'];
      case 'Refresh Rate':
        return ['60Hz', '75Hz', '120Hz', '144Hz', '240Hz'];
      case 'Paper Size':
        return ['A4', 'A3', 'Letter', 'Legal'];
      case 'Print Quality':
        return ['Draft', 'Normal', 'High', 'Photo'];
      case 'Connectivity':
        return ['USB', 'Wi-Fi', 'Ethernet', 'Bluetooth'];
      case 'Operating System':
        return ['Android', 'iOS', 'Windows', 'Chrome OS'];
      case 'Capacity Range':
        return ['128GB-256GB', '500GB-1TB', '2TB-4TB', '8TB+'];
      case 'Interface':
        return ['SATA', 'NVMe', 'USB 3.0', 'USB-C'];
      case 'Form Factor':
        return ['2.5"', '3.5"', 'M.2', 'External'];
      case 'Drive Type':
        return ['SSD', 'HDD', 'Hybrid', 'External'];
      case 'Range':
        return ['Indoor', 'Outdoor', 'Long Range', 'Short Range'];
      case 'Speed':
        return ['100 Mbps', '1 Gbps', '10 Gbps', '100 Gbps'];
      case 'Ports':
        return ['4 Ports', '8 Ports', '16 Ports', '24 Ports'];
      case 'Device Type':
        return ['Router', 'Switch', 'Access Point', 'Modem'];
      default:
        return [];
    }
    return [];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        productImage: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('productName', formData.productName);
      formDataToSend.append('productDesc', formData.productDesc);
      formDataToSend.append('productPrice', formData.productPrice);
      formDataToSend.append('productCategory', formData.productCategory);
      formDataToSend.append('field1', formData.field1);
      formDataToSend.append('field2', formData.field2);
      
      if (getFieldCount() > 2) {
        formDataToSend.append('field3', formData.field3);
      }
      if (getFieldCount() > 3) {
        formDataToSend.append('field4', formData.field4);
      }
      
      if (formData.productImage) {
        formDataToSend.append('productImage', formData.productImage);
      }

      console.log('Attempting to update product:', productId);
      const response = await fetch(`https://api.certifurb.com/api/products/${productId}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      console.log('Update response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update failed. Response:', errorText.substring(0, 200));
        setError(`Update failed: Server returned ${response.status}. The update endpoint may not be implemented yet.`);
        return;
      }

      const responseText = await response.text();
      console.log('Update response:', responseText.substring(0, 200));
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error on update:', parseError);
        setError('Server returned invalid response on update. The update endpoint may not be properly configured.');
        return;
      }

      if (result.success) {
        alert('Product updated successfully!');
        router.push('/cms/Admin/products');
      } else {
        setError(result.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError(`Update error: ${error.message}. Please check if the backend server is running.`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className={`${font.className} p-6 bg-gray-50 min-h-screen flex items-center justify-center`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !formData.productName) {
    return (
      <Layout>
        <div className={`${font.className} p-6 bg-gray-50 min-h-screen flex items-center justify-center`}>
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button 
              onClick={() => router.push('/cms/Admin/products')} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Products
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={`${font.className} p-6 bg-gray-50 min-h-screen`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600 mt-2">Update product information</p>
          </div>
          <button
            onClick={() => router.push('/cms/Admin/products')}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (PKR) *
                </label>
                <input
                  type="number"
                  name="productPrice"
                  value={formData.productPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="productDesc"
                value={formData.productDesc}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="productCategory"
                value={formData.productCategory}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                <option value="Laptop">Laptop</option>
                <option value="Desktop PC">Desktop PC</option>
                <option value="Keyboard">Keyboard</option>
                <option value="Mouse">Mouse</option>
                <option value="LCD">LCD</option>
                <option value="LED">LED</option>
                <option value="Printer">Printer</option>
                <option value="Tablet">Tablet</option>
                <option value="Drive">Drive</option>
                <option value="Network">Network</option>
                <option value="GOAT Product">GOAT Product</option>
              </select>
            </div>

            {/* Category-specific fields */}
            {formData.productCategory && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Field 1 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getFieldLabels().field1} *
                  </label>
                  <select
                    name="field1"
                    value={formData.field1}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select {getFieldLabels().field1}</option>
                    {getOptions('field1').map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Field 2 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getFieldLabels().field2} *
                  </label>
                  <select
                    name="field2"
                    value={formData.field2}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select {getFieldLabels().field2}</option>
                    {getOptions('field2').map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Field 3 - Only if not Mouse category */}
                {getFieldCount() > 2 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getFieldLabels().field3} *
                    </label>
                    <select
                      name="field3"
                      value={formData.field3}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select {getFieldLabels().field3}</option>
                      {getOptions('field3').map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Field 4 - Only if not Mouse category */}
                {getFieldCount() > 3 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getFieldLabels().field4} *
                    </label>
                    <select
                      name="field4"
                      value={formData.field4}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select {getFieldLabels().field4}</option>
                      {getOptions('field4').map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <div className="space-y-4">
                {formData.imagePreview && (
                  <div className="flex items-center space-x-4">
                    <img
                      src={formData.imagePreview}
                      alt="Current product image"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <span className="text-sm text-gray-600">Current image</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">
                  Leave empty to keep current image. Upload a new image to replace it.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.push('/cms/Admin/products')}
                className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditProduct; 