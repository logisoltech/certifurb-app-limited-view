'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../Components/Layout/Navbar'
import Footer from '../../Components/Layout/Footer'
import { font } from '../../Components/Font/font'
import { useNotification } from '../../Components/UI/Notification'

const page = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    retypePassword: '',
    firstName: '',
    lastName: '',
    address: '',
    province: '',
    city: '',
    phoneNumber: '',
    agreeTerms: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', ''])
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const { showNotification, NotificationComponent } = useNotification()

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Timer effect for OTP expiry
  useEffect(() => {
    if (showOtpVerification && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [showOtpVerification, timeLeft])

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 4) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        if (nextInput) nextInput.focus()
      }
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Generate 5-digit OTP
  const generateOTP = () => {
    return Math.floor(10000 + Math.random() * 90000).toString()
  }

  // Send OTP email
  const sendOtpEmail = async (email, otpCode, firstName) => {
    try {
      const response = await fetch('https://api.certifurb.com/api/send-otp-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: otpCode,
          firstName: firstName
        })
      })
      
      // Check if response is ok and content-type is JSON
      if (!response.ok) {
        console.error('Email API response not ok:', response.status)
        return false
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Email API did not return JSON')
        return false
      }
      
      const data = await response.json()
      return data.success
    } catch (error) {
      console.error('Error sending OTP email:', error)
      return false
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      showNotification('Email, password, first name, and last name are required', 'error')
      return
    }

    if (formData.password !== formData.retypePassword) {
      showNotification('Passwords do not match', 'error')
      return
    }

    if (!formData.agreeTerms) {
      showNotification('Please agree to the Terms & Conditions', 'error')
      return
    }

    setIsLoading(true)

    try {
      // Generate OTP
      const otpCode = generateOTP()
      setGeneratedOtp(otpCode)
      
      // Send OTP via email
      const emailSent = await sendOtpEmail(formData.email, otpCode, formData.firstName)
      
      if (emailSent) {
        // Show OTP verification modal
        setShowOtpVerification(true)
        setTimeLeft(600) // Reset timer to 10 minutes
        showNotification('Verification code sent to your email!', 'success')
      } else {
        showNotification('Failed to send verification email. Please try again.', 'error')
      }
      
    } catch (error) {
      console.error('Registration error:', error)
      showNotification('An error occurred. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    
    const otpCode = otp.join('')
    if (otpCode.length !== 5) {
      showNotification('Please enter the complete 5-digit code', 'error')
      return
    }

    setIsVerifying(true)

    try {
      // Verify OTP with backend
      const verifyResponse = await fetch('https://api.certifurb.com/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otpCode
        })
      })

      const verifyData = await verifyResponse.json()

      if (verifyData.success) {
        // OTP is correct, now register the user
        const response = await fetch('https://api.certifurb.com/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            username: formData.firstName,
            lastname: formData.lastName
          })
        })

        const data = await response.json()

        if (data.success) {
          showNotification('Registration successful! You can now login.', 'success')
          setShowOtpVerification(false)
          
          // Redirect to login
          setTimeout(() => {
            router.push('/Auth/login')
          }, 2000)
        } else {
          showNotification(data.message, 'error')
        }
      } else {
        showNotification(verifyData.message || 'Invalid OTP code. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Verification error:', error)
      showNotification('An error occurred. Please try again.', 'error')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    setIsResending(true)

    try {
      // Use backend resend OTP API
      const response = await fetch('https://api.certifurb.com/api/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email
        })
      })

      const data = await response.json()

      if (data.success) {
        setTimeLeft(600) // Reset timer
        setOtp(['', '', '', '', '']) // Clear OTP inputs
        showNotification('New verification code sent to your email!', 'success')
      } else {
        showNotification(data.message || 'Failed to resend code. Please try again.', 'error')
      }
      
    } catch (error) {
      console.error('Resend error:', error)
      showNotification('Failed to resend code. Please try again.', 'error')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className={`${font.className} min-h-screen flex flex-col`}>
        <Navbar/>
        
        {/* Main content centered */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Don't Have An Account?
              </h1>
              <h2 className="text-xl font-semibold text-green-500">
                Sign Up Here!
              </h2>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Email Input - Full Width */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 disabled:opacity-50"
                  required
                />
              </div>

              {/* Password Fields - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 disabled:opacity-50"
                  required
                />
                <input
                  type="password"
                  name="retypePassword"
                  placeholder="Retype Password"
                  value={formData.retypePassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 disabled:opacity-50"
                  required
                />
              </div>

              {/* Name Fields - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 disabled:opacity-50"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 disabled:opacity-50"
                  required
                />
              </div>

              {/* Address Field - Full Width */}
              <div>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 disabled:opacity-50"
                />
              </div>

              {/* Province and City - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="province"
                  placeholder="Province"
                  value={formData.province}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 disabled:opacity-50"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 disabled:opacity-50"
                />
              </div>

              {/* Phone Number - Full Width */}
              <div>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 disabled:opacity-50"
                />
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="flex items-start mt-6">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2 disabled:opacity-50"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-600">
                    I agree with the{' '}
                    <a href="#" className="text-green-500 hover:text-green-600 underline">
                      Terms & Conditions
                    </a>
                    .
                  </label>
                </div>
              </div>

              {/* Sign Up Button */}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full hover:from-[#468e5d] via-[#54b056] hover:to-[#6adb4d] duration-300 bg-gradient-to-b from-[#6adb4d] via-[#54b056] to-[#468e5d] text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'SIGNING UP...' : 'SIGN ME UP'}
              </button>
            </form>
          </div>
        </div>
        
        <Footer/>
        
        {/* OTP Verification Modal */}
        {showOtpVerification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              {/* Modal Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Enter 5 Digit OTP</h2>
                <p className="text-gray-600 text-sm">
                  We sent a verification code to
                </p>
                <p className="text-green-500 font-medium text-sm">
                  {formData.email}
                </p>
              </div>

              {/* OTP Form */}
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {/* OTP Input */}
                <div>
                  <div className="flex justify-center space-x-3 mb-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        disabled={isVerifying}
                        className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                        maxLength="1"
                      />
                    ))}
                  </div>
                </div>

                {/* Timer */}
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    Code expires in{' '}
                    <span className={`font-medium ${timeLeft < 60 ? 'text-red-500' : 'text-green-500'}`}>
                      {formatTime(timeLeft)}
                    </span>
                  </p>
                </div>

                {/* Verify Button */}
                <button 
                  type="submit"
                  disabled={isVerifying || otp.join('').length < 5}
                  className="w-full hover:from-[#468e5d] via-[#54b056] hover:to-[#6adb4d] duration-300 bg-gradient-to-b from-[#6adb4d] via-[#54b056] to-[#468e5d] text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? 'VERIFYING...' : 'VERIFY EMAIL'}
                </button>
              </form>

              {/* Resend Code */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendOtp}
                  disabled={isResending || timeLeft > 0}
                  className="text-green-500 hover:text-green-600 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? 'Sending...' : 'Resend Code'}
                </button>
              </div>

              {/* Close Modal */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setShowOtpVerification(false)
                    setOtp(['', '', '', '', ''])
                    setGeneratedOtp('')
                  }}
                  className="text-gray-500 hover:text-gray-600 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Notification Component */}
        <NotificationComponent />
    </div>
  )
}

export default page