'use client';

import React from 'react';
import Layout from '../../Components/Layout/Layout';
import { Geist } from 'next/font/google';
import Image from 'next/image';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const font = Geist({
    subsets: ['latin'],
});

const OrderDetails = () => {
    const order = {
        id: '#349',
        customerId: '2364847',
        items: [
            {
                id: 1,
                name: 'Fitbit Sense Advanced Smartwatch with Tools for Heart Health, Stress Management & Skin Temperature Trends...',
                color: 'Pure matte black',
                size: '42',
                image: '/mini-laptop.png',
            },
            {
                id: 2,
                name: '2021 Apple 12.9-inch iPad Pro (Wi-Fi, 128GB) - Space Gray',
                color: 'Black',
                size: 'Pro',
                image: '/mini-laptop.png',
            },
            {
                id: 3,
                name: 'PlayStation 5 DualSense Wireless Controller',
                color: 'White',
                size: 'Regular',
                image: '/mini-laptop.png',
            },
            {
                id: 4,
                name: 'Apple MacBook Pro 13 inch-M1-8/256GB-space',
                color: 'Space Gray',
                size: 'Pro',
                image: '/mini-laptop.png',
            },
            {
                id: 5,
                name: 'Apple iMac 24" 4K Retina Display M1 8 Core CPU, 7 Core GPU, 256GB SSD, Green (MIV832P/A) 2021',
                color: 'Ocean Blue',
                size: '21"',
                image: '/mini-laptop.png',
            },
            {
                id: 6,
                name: 'Apple Magic Mouse (Wireless, Rechargable) - Silver',
                color: 'White',
                size: 'Regular',
                image: '/mini-laptop.png',
            },
        ],
    };

    const summary = {
        subtotal: '$7,686',
        discount: '-$59',
        tax: '$126.2',
        shipping: '$30',
        total: '$695.20',
    };

    const billingDetails = {
        customer: 'Shatinon Mekalan',
        email: 'shatinon@jeemail.com',
        phone: '+1234567890',
        address: 'Shatinon Mekalan\nVancouver, British Columbia, Canada',
    };

    const shippingDetails = {
        email: 'shatinon@jeemail.com',
        phone: '+1234567890',
        date: '12 Nov, 2021',
        address: 'Shatinon Mekalan\nVancouver, British Columbia, Canada',
    };

    const otherDetails = {
        giftOrder: 'Yes',
        wrapping: 'Magic wrapper',
        recipient: 'Recipient',
        giftMessage: 'Happy Birthday Shiniga\nLots of Love Buga Buga!!\nYours,\nMekalan',
    };

    return (
        <Layout>
            <div className={`${font.className} p-12 bg-gray-50 min-h-screen`}>
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>Page 1</span>
                    <span className="mx-2">•</span>
                    <span>Page 2</span>
                    <span className="mx-2">•</span>
                    <span>Default</span>
                </div>

                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-3xl font-bold">Order Details</h1>
                    <button className="text-gray-600 hover:text-gray-800">
                        More action
                        <span className="ml-2">▼</span>
                    </button>
                </div>

                {/* Order Info */}
                <div className="mb-6">
                    <span className="text-gray-600">Order : </span>
                    <span className="text-blue-600 font-medium">{order.id}</span>
                    <span className="mx-2 text-gray-400">|</span>
                    <span className="text-gray-600">Customer Id : </span>
                    <span className="text-blue-600 font-medium">{order.customerId}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Column */}
                    <div className="flex-1">
                        {/* Products Table */}
                        <table className="w-full border-y border-gray-200">
                            <thead className="border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-2 text-xs font-bold uppercase tracking-wider w-2/3">Products</th>
                                    <th className="text-left px-6 py-2 text-xs font-bold uppercase tracking-wider">Size</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-200">
                                        <td className="px-4 py-2">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={40}
                                                        height={40}
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-[0.8rem] text-blue-600 hover:text-blue-800 cursor-pointer">
                                                        {item.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[0.8rem] text-gray-600">{item.size}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Items Subtotal */}
                        <div className="mt-4 mb-8 flex justify-between border-b border-gray-200">
                            <h2 className="text-lg font-semibold mb-4">
                                Items subtotal :
                            </h2>
                            <span className="text-gray-900">{summary.subtotal}</span>
                        </div>

                        {/* Details Sections */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Billing Details */}
                            <div>
                                <h2 className="text-lg font-semibold mb-4">Billing details</h2>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-[0.8rem]">Customer</span>
                                        </div>
                                        <p className="text-[0.8rem] text-blue-600 mt-1">{billingDetails.customer}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-[0.8rem]">Email</span>
                                        </div>
                                        <p className="text-[0.8rem] text-blue-600 mt-1">{billingDetails.email}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span className="text-[0.8rem]">Phone</span>
                                        </div>
                                        <p className="text-[0.8rem] text-blue-600 mt-1">{billingDetails.phone}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-[0.8rem]">Address</span>
                                        </div>
                                        <p className="text-[0.8rem] text-gray-600 whitespace-pre-line mt-1">{billingDetails.address}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Details */}
                            <div>
                                <h2 className="text-lg font-semibold mb-4">Shipping details</h2>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-[0.8rem]">Email</span>
                                        </div>
                                        <p className="text-[0.8rem] text-blue-600 mt-1">{shippingDetails.email}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span className="text-[0.8rem]">Phone</span>
                                        </div>
                                        <p className="text-[0.8rem] text-blue-600 mt-1">{shippingDetails.phone}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-[0.8rem]">Shipping Date</span>
                                        </div>
                                        <p className="text-[0.8rem] text-gray-600 mt-1">{shippingDetails.date}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-[0.8rem]">Address</span>
                                        </div>
                                        <p className="text-[0.8rem] text-gray-600 whitespace-pre-line mt-1">{shippingDetails.address}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Other Details */}
                            <div>
                                <h2 className="text-lg font-semibold mb-4">Other details</h2>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                            </svg>
                                            <span className="text-[0.8rem]">Gift order</span>
                                        </div>
                                        <p className="text-[0.8rem] text-gray-600 mt-1">{otherDetails.giftOrder}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                            <span className="text-[0.8rem]">Wrapping</span>
                                        </div>
                                        <p className="text-[0.8rem] text-gray-600 mt-1">{otherDetails.wrapping}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 ASH24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-[0.8rem]">Recipient</span>
                                        </div>
                                        <p className="text-[0.8rem] text-gray-600 mt-1">{otherDetails.recipient}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                            <span className="text-[0.8rem]">Gift Message</span>
                                        </div>
                                        <p className="text-[0.8rem] text-gray-600 whitespace-pre-line mt-1">{otherDetails.giftMessage}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:w-80 flex flex-col gap-6">
                        {/* Summary Card */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <h2 className="text-lg font-semibold mb-4">Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Items subtotal :</span>
                                    <span className="text-gray-900">{summary.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-red-500">Discount :</span>
                                    <span className="text-red-500">{summary.discount}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax :</span>
                                    <span className="text-gray-900">{summary.tax}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping Cost :</span>
                                    <span className="text-gray-900">{summary.shipping}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t">
                                    <span className="font-medium">Total :</span>
                                    <span className="font-medium">{summary.total}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Status Card */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold mb-4">Order Status</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Payment status</label>
                                    <div className="relative">
                                        <select className="w-full p-2 pr-8 text-sm border border-gray-200 rounded appearance-none">
                                            <option>Processing</option>
                                        </select>
                                        <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Fulfillment status</label>
                                    <div className="relative">
                                        <select className="w-full p-2 pr-8 text-sm border border-gray-200 rounded appearance-none">
                                            <option>Unfulfilled</option>
                                        </select>
                                        <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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

export default OrderDetails;