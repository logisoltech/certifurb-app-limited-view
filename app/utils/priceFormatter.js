/**
 * Format price with PKR currency and proper thousand separators
 * @param {number} price - The price value to format
 * @param {boolean} includeCurrency - Whether to include PKR prefix (default: true)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, includeCurrency = true) => {
    if (!price && price !== 0) return includeCurrency ? 'PKR 0' : '0';
    
    const formattedNumber = Number(price).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    
    return includeCurrency ? `PKR ${formattedNumber}` : formattedNumber;
  };
  
  /**
   * Format price for display with .00 decimal places
   * @param {number} price - The price value to format
   * @param {boolean} includeCurrency - Whether to include PKR prefix (default: true)
   * @returns {string} Formatted price string with .00
   */
  export const formatPriceWithDecimals = (price, includeCurrency = true) => {
    if (!price && price !== 0) return includeCurrency ? 'PKR 0.00' : '0.00';
    
    const formattedNumber = Number(price).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return includeCurrency ? `PKR ${formattedNumber}` : formattedNumber;
  }; 