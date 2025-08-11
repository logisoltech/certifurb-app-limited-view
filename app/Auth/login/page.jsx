'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import Navbar from '../../Components/Layout/Navbar'
import Footer from '../../Components/Layout/Footer'
import { font } from '../../Components/Font/font'
import { useNotification } from '../../Components/UI/Notification'

const page = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [googleReady, setGoogleReady] = useState(false)
  const [returnUrl, setReturnUrl] = useState('/')
  const { showNotification, NotificationComponent } = useNotification()

  const GOOGLE_CLIENT_ID = "1005786066800-rajkpj63ree8a42grrtm04c1eg4p4qha.apps.googleusercontent.com"

  // Get returnUrl from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const returnUrlParam = urlParams.get('returnUrl')
    if (returnUrlParam) {
      setReturnUrl(returnUrlParam)
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      showNotification('Please fill in all fields', 'error')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('https://api.certifurb.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (data.success) {
        showNotification(data.message, 'success')
        localStorage.setItem('user', JSON.stringify(data.data))
        
        // Trigger custom event to notify navbar of login state change
        window.dispatchEvent(new Event('storage'))
        
        // Delay redirect slightly to show success notification
        setTimeout(() => {
          router.push(returnUrl)
        }, 1500)
      } else {
        showNotification(data.message, 'error')
      }
    } catch (error) {
      console.error('Login error:', error)
      showNotification('An error occurred. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleCallback = async (response) => {
    console.log('Google callback received:', response)
    
    try {
      const res = await fetch('https://api.certifurb.com/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: response.credential
        })
      })

      const data = await res.json()

      if (data.success) {
        showNotification(data.message, 'success')
        localStorage.setItem('user', JSON.stringify(data.data))
        
        // Trigger custom event to notify navbar of login state change
        window.dispatchEvent(new Event('storage'))
        
        // Delay redirect slightly to show success notification
        setTimeout(() => {
          router.push(returnUrl)
        }, 1500)
      } else {
        showNotification(data.message, 'error')
      }
    } catch (error) {
      console.error('Google login error:', error)
      showNotification('Google login failed. Please try again.', 'error')
    }
  }

  useEffect(() => {
    if (googleReady && window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
          theme: "outline", // or "filled_blue"
          size: "large",
          shape: "rectangular",
          text: "signin_with",
          width: "100%"
        }
      );
    }
  }, [googleReady]);

  return (
    <>
      <Script 
        src="https://accounts.google.com/gsi/client" 
        onLoad={() => {
          console.log('Google script loaded')
          setGoogleReady(true)
        }}
        onError={() => {
          console.error('Failed to load Google script')
        }}
      />
      
      <div className={`${font.className} min-h-screen flex flex-col`}>
          <Navbar/>
          
          <div className="flex-1 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome To Certifurb
                </h1>
                <h2 className="text-xl font-semibold text-green-500">
                  Customer Portal
                </h2>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border bg-gray-50 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                    required
                  />
                </div>

                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border bg-gray-50 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full cursor-pointer hover:from-[#468e5d] via-[#54b056] hover:to-[#6adb4d] duration-300 bg-gradient-to-b from-[#6adb4d] via-[#54b056] to-[#468e5d] text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'LOGGING IN...' : 'LOGIN'}
                </button>
              </form>

              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-dotted border-gray-300"></div>
                <span className="px-3 text-gray-500 text-sm">OR</span>
                <div className="flex-1 border-t border-dotted border-gray-300"></div>
              </div>

              {/* Google Sign-In Button Container */}
              <div className="w-full flex justify-center">
                {googleReady ? (
                  <div id="google-signin-button" className="flex justify-center"></div>
                ) : (
                  <div className="w-full border border-gray-300 bg-gray-50 text-gray-500 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading Google Sign-In...
                  </div>
                )}
              </div>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <a href="/Auth/register" className="text-green-500 hover:text-green-600 font-medium">
                    Create One !
                  </a>
                </p>
              </div>
            </div>
          </div>
          
          <Footer/>
          
          {/* Notification Component */}
          <NotificationComponent />
      </div>
    </>
  )
}

export default page