'use client';
import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '../Components/Layout/Navbar'
import Footer from '../Components/Layout/Footer'
import LaptopBanner from './LaptopBanner'
import Categories from './Categories'

// Separate component to handle search params
function CategoryContent() {
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get('filter') // Get the 'filter' parameter from URL
  const brandFilter = searchParams.get('brand') // Get the 'brand' parameter from URL
  
  return (
    <>
      <LaptopBanner categoryFilter={categoryFilter} brandFilter={brandFilter}/>
      <Categories categoryFilter={categoryFilter} brandFilter={brandFilter}/>
    </>
  )
}

const page = () => {
  return (
    <div>
      <Navbar/>
      <Suspense fallback={
        <div className="w-full min-h-screen bg-[#fafbfc] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }>
        <CategoryContent />
      </Suspense>
      <Footer/>
    </div>
  )
}

export default page