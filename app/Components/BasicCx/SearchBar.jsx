"use client";

import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

function SearchBar() {
  const [searchValue, setSearchValue] = useState('');

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="flex w-full items-center">
      <div className="relative mx-auto w-full max-w-[700px]">
        {/* Search Icon on the right */}
        <div className="absolute inset-y-0 right-2 md:right-3 text-lg md:text-xl flex items-center pointer-events-none">
          <FiSearch className="text-black" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          placeholder="What are you looking for..."
          value={searchValue}
          onChange={handleInputChange}
          className="w-full md:w-[700px] pr-8 md:pr-10 pl-3 md:pl-4 py-2 md:py-3 placeholder-black custom-grey-bg rounded-md focus:outline-none focus:ring focus:ring-blue-300 text-sm md:text-base"
        />
      </div>
    </div>
  );
}

export default SearchBar;
