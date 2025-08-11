'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../Components/Layout/Navbar'
import Footer from '../../Components/Layout/Footer'
import { font } from '../../Components/Font/font'
import { useNotification } from '../../Components/UI/Notification'

const VerifyEmailPage = () => {
  const router = useRouter()
  const [otp, setOtp] = useState(['', '', '', '', ''])
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const { showNotification, NotificationComponent } = useNotification()

  useEffect(() => {
    // Get pending verification data from localStorage
    const pendingData = localStorage.getItem('pendingVerification')
    if (pendingData) {
      const data = JSON.parse(pendingData)
      setEmail(data.email)
      setUsername(data.username)
    } else {
      // No pending verification, redirect to registration
      router.push('/Auth/register')
    }
  }, [router])

  useEffect(() => {
    // Countdown timer
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

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

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    
    const otpCode = otp.join('')
    if (otpCode.length !== 5) {
      showNotification('Please enter the complete 5-digit code', 'error')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('https://api.certifurb.com/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: otpCode
        })
      })

      const data = await response.json()

      if (data.success) {
        showNotification(data.message, 'success')
        
        // Clear pending verification data
        localStorage.removeItem('pendingVerification')
        
        // Redirect to login
        setTimeout(() => {
          router.push('/Auth/login')
        }, 2000)
      } else {
        showNotification(data.message, 'error')
      }
    } catch (error) {
      console.error('Verification error:', error)
      showNotification('An error occurred. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsResending(true)

    try {
      const response = await fetch('https://api.certifurb.com/api/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        })
      })

      const data = await response.json()

      if (data.success) {
        showNotification(data.message, 'success')
        setTimeLeft(600) // Reset timer
        setOtp(['', '', '', '', '']) // Clear OTP inputs
      } else {
        showNotification(data.message, 'error')
      }
    } catch (error) {
      console.error('Resend error:', error)
      showNotification('Failed to resend code. Please try again.', 'error')
    } finally {
      setIsResending(false)
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!email) {
    return <div>Loading...</div>
  }

  return (
    <div className={`${font.className} min-h-screen flex flex-col`}>
      <Navbar/>
      
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Check Your Email
            </h1>
            <p className="text-gray-600">
              We sent a verification code to
            </p>
            <p className="text-green-500 font-medium">
              {email}
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Enter Verification Code
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isLoading}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                    maxLength="1"
                  />
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="text-center">
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
              disabled={isLoading || otp.join('').length < 5}
              className="w-full hover:from-[#468e5d] via-[#54b056] hover:to-[#6adb4d] duration-300 bg-gradient-to-b from-[#6adb4d] via-[#54b056] to-[#468e5d] text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'VERIFYING...' : 'VERIFY EMAIL'}
            </button>
          </form>

          {/* Resend Code */}
          <div className="mt-6 text-center">
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

          {/* Back to Registration */}
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                localStorage.removeItem('pendingVerification')
                router.push('/Auth/register')
              }}
              className="text-gray-500 hover:text-gray-600 text-sm"
            >
              ← Back to Registration
            </button>
          </div>
        </div>
      </div>
      
      <Footer/>
      
      {/* Notification Component */}
      <NotificationComponent />
    </div>
  )
}

export default VerifyEmailPage 