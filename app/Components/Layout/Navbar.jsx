'use client'
import React, { useState, useEffect } from 'react'
import { font } from '../Font/font'
import Image from 'next/image'
import SearchBar from '../BasicCx/SearchBar'
import { FaRegUser } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { FaBars, FaTimes } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import Link from 'next/link';
import { useCurrency } from '../../context/CurrencyContext';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [dropdownTimeout, setDropdownTimeout] = useState(null)
  const [isLaptopDropdownOpen, setIsLaptopDropdownOpen] = useState(false)
  const [laptopDropdownTimeout, setLaptopDropdownTimeout] = useState(null)
  const [isMobileLaptopOpen, setIsMobileLaptopOpen] = useState(false)
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
  
  // Use currency context
  const { selectedCountry, setSelectedCountry } = useCurrency();

  useEffect(() => {
    const checkLoginState = () => {
      const userData = localStorage.getItem('user')
      console.log('Checking user data:', userData) 
      
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData)
          console.log('Parsed user:', parsedUser)
          
          if (parsedUser && (parsedUser.userId || parsedUser.useremail || parsedUser.email)) {
            setUser(parsedUser)
            setIsLoggedIn(true)
            console.log('User is logged in:', parsedUser)
          } else {
            console.log('Invalid user data, clearing...')
            localStorage.removeItem('user')
            setIsLoggedIn(false)
          }
        } catch (error) {
          console.log('Error parsing user data:', error)
          localStorage.removeItem('user')
          setIsLoggedIn(false)
        }
      } else {
        console.log('No user data found') 
        setIsLoggedIn(false)
      }
    }

    checkLoginState()

    const handleFocus = () => {
      checkLoginState()
    }

    window.addEventListener('focus', handleFocus)
    
    const handleStorageChange = () => {
      checkLoginState()
    }
    
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout)
      }
      if (laptopDropdownTimeout) {
        clearTimeout(laptopDropdownTimeout)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('cart')
    localStorage.clear()
    setUser(null)
    setIsLoggedIn(false)
    setIsMobileMenuOpen(false)
    window.location.href = '/'
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleUserMouseEnter = () => {
    if (isLoggedIn) {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout)
        setDropdownTimeout(null)
      }
      setIsUserDropdownOpen(true)
    }
  }

  const handleUserMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsUserDropdownOpen(false)
    }, 150) // 150ms delay
    setDropdownTimeout(timeout)
  }

  const handleLaptopMouseEnter = () => {
    if (laptopDropdownTimeout) {
      clearTimeout(laptopDropdownTimeout)
      setLaptopDropdownTimeout(null)
    }
    setIsLaptopDropdownOpen(true)
  }

  const handleLaptopMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsLaptopDropdownOpen(false)
    }, 150) // 150ms delay
    setLaptopDropdownTimeout(timeout)
  }

  const toggleCountryDropdown = () => {
    setIsCountryDropdownOpen(!isCountryDropdownOpen)
  }

  const selectCountry = (country) => {
    setSelectedCountry(country)
    setIsCountryDropdownOpen(false)
    console.log('Country selected in Navbar:', country)
  }

  const getCountryFlag = (country) => {
    switch (country) {
      case 'Pakistan':
      case 'PK':
        return '/pakistan-20.png'
      case 'United Arab Emirates':
      case 'UAE':
        return '/uae-20.png'
      case 'United States':
      case 'USA':
      case 'US':
        return '/usa-20.png'
      default:
        return '/pakistan-20.png'
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCountryDropdownOpen && !event.target.closest('.country-dropdown')) {
        setIsCountryDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCountryDropdownOpen])

  return (
    <div className={`${font.className} relative`}>
      {/* Promotional Banner */}
      <div className='w-full flex text-white font-bold text-xs md:text-sm lg:text-md justify-center items-center p-2 md:p-1 custom-green-bg'>
        <p className='text-center px-2'>GET 100 PKR OFF YOUR FIRST ORDER- ENTER CODE NEW25 AT CHECKOUT</p>
      </div>
      
      {/* Main Navbar */}
      <div className='bg-white w-full flex justify-between items-center p-4 md:p-6 lg:p-8 px-4 md:px-6 lg:px-8 relative'>
        {/* Mobile Left Side - Hamburger + Logo */}
        <div className='flex lg:hidden items-center gap-3'>
          {/* Hamburger Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className='cursor-pointer hover:text-gray-600 transition-colors text-xl'
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          
          {/* Logo */}
          <Link href={"/"}>
            <Image
              src="/main-logo_1.png"
              width={120}
              height={120}
              alt='logo'
              className='md:w-[70px] md:h-[70px] lg:w-[142px] lg:h-[32px]'               
            />
          </Link>
        </div>

        {/* Desktop Logo (hidden on mobile) */}
        <div className='hidden lg:block flex-shrink-0'>
          <Link href={"/"}>
            <Image
              src="/certifurb.png"
              width={120}
              height={120}
              alt='logo'
              className='md:w-[70px] md:h-[70px] lg:w-[140px] lg:h-[35px]'               
            />
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div className='hidden lg:block flex-1 mx-8'>
          <SearchBar/>
        </div>
        
        {/* Desktop Icons and Login */}
        <div className='hidden lg:flex dark:text-black items-center mr-8 justify-center space-x-4 text-xl'>
          
          {/* Country Dropdown */}
          <div className='relative country-dropdown'>
            <button
              onClick={toggleCountryDropdown}
              className='flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors'
            >
              <img 
                src={getCountryFlag(selectedCountry)} 
                alt="Country flag" 
                className='w-[20px] h-5 object-cover rounded'
              />
              <FaChevronDown className={`text-xs transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isCountryDropdownOpen && (
              <div className='absolute top-full right-0 mt-1 w-16 bg-white rounded-lg shadow-lg border border-gray-200 z-50'>
                <div className='py-1'>
                  {['Pakistan', 'United States', 'United Arab Emirates'].map((country) => (
                    <button
                      key={country}
                      onClick={() => selectCountry(country)}
                      className={`w-full text-left px-2 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-center ${
                        selectedCountry === country ? 'bg-green-50' : ''
                      }`}
                    >
                      <img 
                        src={getCountryFlag(country)} 
                        alt={`${country} flag`} 
                        className='w-[20px] h-5 object-cover rounded'
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div 
            className='relative' 
            onMouseEnter={handleUserMouseEnter}
            onMouseLeave={handleUserMouseLeave}
          >
            {isLoggedIn ? (
              <div>
                <div className='cursor-pointer hover:text-gray-600 transition-colors'>
                  <FaRegUser/>
                </div>
                
                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className='absolute top-full right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50'>
                    <div className='py-1'>
                      <Link href="/user-profile">
                        <div className='px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-sm'>
                          <FaRegUser className='text-xs'/>
                          <span>User Profile</span>
                        </div>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className='w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-sm'
                      >
                        <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/Auth/login">
                <div className='cursor-pointer hover:text-gray-600 transition-colors'>
                  <FaRegUser/>
                </div>
              </Link>
            )}
          </div>
          <div className='cursor-pointer hover:text-gray-600 transition-colors'>
            <Link href={"/favorites"}><FaRegHeart/></Link>
          </div>
          <div className='cursor-pointer hover:text-gray-600 transition-colors'>
            <Link href={"/view-cart"}><FiShoppingCart/></Link>
          </div>
        </div>
        
        {/* Desktop Login/Logout Button */}
        {/* <div className='hidden lg:block'>
          {!isLoggedIn ? (
            <Link href={"/Auth/login"}>
              <button className='px-4 cursor-pointer bg-gradient-to-b from-[#6adb4d] via-[#54b056] to-[#468e5d] text-white font-bold py-2 rounded-lg shadow hover:from-[#468e5d] via-[#54b056] hover:to-[#6adb4d] duration-300'>
                Login
              </button>
            </Link>
          ) : (
            <button 
              onClick={handleLogout}
              className='px-4 cursor-pointer bg-gradient-to-b from-[#dc3545] via-[#c82333] to-[#bd2130] text-white font-bold py-2 rounded-lg shadow hover:from-[#bd2130] via-[#c82333] hover:to-[#dc3545] duration-300'
            >
              Logout
            </button>
          )}
        </div> */}

        {/* Mobile Icons */}
        <div className='flex lg:hidden items-center space-x-3 text-lg'>
          
          {/* Mobile Country Dropdown */}
          <div className='relative country-dropdown'>
            <button
              onClick={toggleCountryDropdown}
              className='flex items-center space-x-1 px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors'
            >
              <img 
                src={getCountryFlag(selectedCountry)} 
                alt="Country flag" 
                className='w-5 h-3 object-cover rounded'
              />
              <FaChevronDown className={`text-xs transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isCountryDropdownOpen && (
              <div className='absolute top-full right-0 mt-1 w-16 bg-white rounded-lg shadow-lg border border-gray-200 z-50'>
                <div className='py-1'>
                  {['Pakistan', 'United States', 'United Arab Emirates'].map((country) => (
                    <button
                      key={country}
                      onClick={() => selectCountry(country)}
                      className={`w-full text-left px-2 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-center ${
                        selectedCountry === country ? 'bg-green-50' : ''
                      }`}
                    >
                      <img 
                        src={getCountryFlag(country)} 
                        alt={`${country} flag`} 
                        className='w-10 h-6 object-cover rounded'
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div 
            className='relative'
            onMouseEnter={handleUserMouseEnter}
            onMouseLeave={handleUserMouseLeave}
          >
            {isLoggedIn ? (
              <div>
                <div className='cursor-pointer hover:text-gray-600 transition-colors'>
                  <FaRegUser/>
                </div>
                
                {/* Mobile Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className='absolute top-full right-0 mt-1 w-40 bg-white dark:text-black rounded-lg shadow-lg border border-gray-200 z-50'>
                    <div className='py-1'>
                      <Link href="/user-profile">
                        <div className='px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-sm'>
                          <FaRegUser className='text-xs'/>
                          <span>User Profile</span>
                        </div>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className='w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-sm'
                      >
                        <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/Auth/login">
                <div className='cursor-pointer hover:text-gray-600 transition-colors'>
                  <FaRegUser/>
                </div>
              </Link>
            )}
          </div>
          <div className='cursor-pointer hover:text-gray-600 transition-colors'>
            <FaRegHeart/>
          </div>
          <div className='cursor-pointer hover:text-gray-600 transition-colors'>
            <Link href={"/view-cart"}><FiShoppingCart/></Link>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className='lg:hidden bg-white px-4 pb-4'>
        <SearchBar/>
      </div>

      <hr className='w-full border border-gray-200'/>

      {/* Desktop Navigation Links */}
      <div className='hidden lg:flex space-x-[33px] font-bold bg-white dark:text-black pt-3 pb-3 justify-center items-center'>
        <Link href={"/category"}><p className='cursor-pointer hover:text-gray-600 transition-colors'>Promotional Link</p></Link>
        
        {/* Laptop Dropdown */}
        <div 
          className='relative'
          onMouseEnter={handleLaptopMouseEnter}
          onMouseLeave={handleLaptopMouseLeave}
        >
          <Link href={"/category?filter=Laptop"}>
            <p className='cursor-pointer hover:text-gray-600 transition-colors flex items-center'>
              Laptop
              <svg className='ml-1 w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
              </svg>
            </p>
          </Link>
          
          {/* Laptop Dropdown Menu */}
          {isLaptopDropdownOpen && (
            <div className='absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50'>
              <div className='py-1'>
                <Link href="/category?filter=Laptop&brand=Lenovo">
                  <div className='px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm font-medium'>
                    Lenovo
                  </div>
                </Link>
                <Link href="/category?filter=Laptop&brand=Microsoft">
                  <div className='px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm font-medium'>
                    Microsoft
                  </div>
                </Link>
                <Link href="/category?filter=Laptop&brand=HP">
                  <div className='px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm font-medium'>
                    HP
                  </div>
                </Link>
                <Link href="/category?filter=Laptop&brand=Dell">
                  <div className='px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm font-medium'>
                    Dell
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
        <Link href={"/category?filter=Desktop PC"}><p className='cursor-pointer hover:text-gray-600 transition-colors'>Desktop PC</p></Link>
        <Link href={"/category?filter=Printer"}><p className='cursor-pointer hover:text-gray-600 transition-colors'>Printer</p></Link>
        <Link href={"/category?filter=Monitors"}><p className='cursor-pointer hover:text-gray-600 transition-colors'>Monitors</p></Link>
        <Link href={"/category?filter=Mouse"}><p className='cursor-pointer hover:text-gray-600 transition-colors'>Mouse</p></Link>
        <Link href={"/category?filter=Keyboard"}><p className='cursor-pointer hover:text-gray-600 transition-colors'>Keyboard</p></Link>
        <Link href={"/category?filter=Tablet"}><p className='cursor-pointer hover:text-gray-600 transition-colors'>Tablet</p></Link>
        <Link href={"/category?filter=Drive"}><p className='cursor-pointer hover:text-gray-600 transition-colors'>Drive</p></Link>
        <Link href={"/category?filter=Network"}><p className='cursor-pointer hover:text-gray-600 transition-colors'>Network</p></Link>
        <Link href={"/help"}><p className='cursor-pointer hover:text-gray-600 transition-colors'>Help</p></Link>
        <Link href={"/auction"}><p className='cursor-pointer custom-green-bg text-white px-4 py-1 rounded-full transition-colors'>Auction</p></Link>
      </div>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className='lg:hidden fixed inset-0 bg-transparent z-40' 
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className='lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t z-50'>
          <div className='p-4'>
            {/* Login/Logout Button */}
            <div className='mb-4'>
              {!isLoggedIn ? (
                <Link href={"/Auth/login"} onClick={closeMobileMenu}>
                  <button className='w-full bg-gradient-to-b from-[#6adb4d] via-[#54b056] to-[#468e5d] text-white font-bold py-3 rounded-lg'>
                    Login
                  </button>
                </Link>
              ) : (
                <button 
                  onClick={handleLogout}
                  className='w-full bg-gradient-to-b from-[#dc3545] via-[#c82333] to-[#bd2130] text-white font-bold py-3 rounded-lg'
                >
                  Logout
                </button>
              )}
            </div>

            {/* Navigation Links */}
            <div className='space-y-2'>
              <Link href={"/category"} onClick={closeMobileMenu}>
                <div className='py-3 px-4 hover:bg-gray-100 rounded border-b border-gray-200'>Promotional Link</div>
              </Link>
              
              {/* Laptop Section */}
              <div>
                <div className='py-3 px-4 hover:bg-gray-100 rounded border-b border-gray-200 flex items-center justify-between'>
                  <Link href={"/category?filter=Laptop"} onClick={closeMobileMenu}>
                    <span className='cursor-pointer'>Laptop</span>
                  </Link>
                  <button
                    onClick={() => setIsMobileLaptopOpen(!isMobileLaptopOpen)}
                    className='cursor-pointer'
                  >
                    <svg 
                      className={`w-4 h-4 transition-transform ${isMobileLaptopOpen ? 'rotate-180' : ''}`}
                      fill='none' 
                      stroke='currentColor' 
                      viewBox='0 0 24 24'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                  </button>
                </div>
                {isMobileLaptopOpen && (
                  <div className='pl-8 space-y-1 pb-2'>
                    <Link href={"/category?filter=Laptop&brand=Acer"} onClick={closeMobileMenu}>
                      <div className='py-2 px-4 hover:bg-gray-100 rounded text-sm text-gray-600'>• Acer</div>
                    </Link>
                    <Link href={"/category?filter=Laptop&brand=Asus"} onClick={closeMobileMenu}>
                      <div className='py-2 px-4 hover:bg-gray-100 rounded text-sm text-gray-600'>• Asus</div>
                    </Link>
                      <Link href={"/category?filter=Laptop&brand=HP"} onClick={closeMobileMenu}>
                        <div className='py-2 px-4 hover:bg-gray-100 rounded text-sm text-gray-600'>• HP</div>
                      </Link>
                      <Link href={"/category?filter=Laptop&brand=Dell"} onClick={closeMobileMenu}>
                        <div className='py-2 px-4 hover:bg-gray-100 rounded text-sm text-gray-600'>• Dell</div>
                      </Link>
                  </div>
                )}
              </div>
              <Link href={"/category?filter=Desktop PC"} onClick={closeMobileMenu}>
                <div className='py-3 px-4 hover:bg-gray-100 rounded border-b border-gray-200'>Desktop PC</div>
              </Link>
              <Link href={"/category?filter=Printer"} onClick={closeMobileMenu}>
                <div className='py-3 px-4 hover:bg-gray-100 rounded border-b border-gray-200'>Printer</div>
              </Link>
              <Link href={"/category?filter=Monitors"} onClick={closeMobileMenu}>
                <div className='py-3 px-4 hover:bg-gray-100 rounded border-b border-gray-200'>Monitors</div>
              </Link>
              <Link href={"/category?filter=Mouse"} onClick={closeMobileMenu}>
                <div className='py-3 px-4 hover:bg-gray-100 rounded border-b border-gray-200'>Mouse</div>
              </Link>
              <Link href={"/category?filter=Keyboard"} onClick={closeMobileMenu}>
                <div className='py-3 px-4 hover:bg-gray-100 rounded border-b border-gray-200'>Keyboard</div>
              </Link>
              <Link href={"/category?filter=Tablet"} onClick={closeMobileMenu}>
                <div className='py-3 px-4 hover:bg-gray-100 rounded border-b border-gray-200'>Tablet</div>
              </Link>
              <Link href={"/category?filter=Drive"} onClick={closeMobileMenu}>
                <div className='py-3 px-4 hover:bg-gray-100 rounded border-b border-gray-200'>Drive</div>
              </Link>
              <Link href={"/category?filter=Network"} onClick={closeMobileMenu}>
                <div className='py-3 px-4 hover:bg-gray-100 rounded border-b border-gray-200'>Network</div>
              </Link>
              <Link href={"/help"} onClick={closeMobileMenu}>
                <div className='py-3 px-4 hover:bg-gray-100 rounded border-b border-gray-200'>Help</div>
              </Link>
              <Link href={"/category"} onClick={closeMobileMenu}>
                <div className='py-3 px-4 hover:bg-gray-100 rounded'>Become A Seller</div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar