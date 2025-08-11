'use client';

import React from 'react';
import Layout from '../../Components/Layout/Layout';
import { Geist } from 'next/font/google';
import Image from 'next/image';

const font = Geist({
    subsets: ['latin'],
});

const EmailDetail = () => {
    const mailboxItems = [
        { id: 1, name: 'Inbox', count: 5 },
        { id: 2, name: 'Sent', count: 23 },
        { id: 3, name: 'Draft', count: 0 },
        { id: 4, name: 'Spam', count: 0 },
        { id: 5, name: 'Trash', count: 0 },
    ];

    const filteredItems = [
        { id: 1, name: 'Starred', count: 0 },
        { id: 2, name: 'Archive', count: 0 },
    ];

    const labelItems = [
        { id: 1, name: 'Personal', color: 'bg-blue-500' },
        { id: 2, name: 'Work', color: 'bg-green-500' },
        { id: 3, name: 'Payments', color: 'bg-yellow-500' },
        { id: 4, name: 'Invoices', color: 'bg-purple-500' },
        { id: 5, name: 'Accounts', color: 'bg-red-500' },
        { id: 6, name: 'Forums', color: 'bg-gray-500' },
    ];

    const emailContent = {
        subject: 'Query about recently purchased soccer socks',
        sender: {
            name: 'Jessica Ball',
            email: 'jessica.ball@email.com',
            avatar: '/avatar.png',
        },
        date: '28 Aug, 2021 6:32 PM',
        content: `Dear Simp sons,

Something in a thirty-acre thermal thicket of thorns and thistles thumped and thundered threatening the three-D thoughts of Matthew the thug - although, theatrically, it was only the thirteen-thousand thistles and thorns through the underneath of his thigh that the thirty year old thug thought of that morning.

How much caramel can a canny canonball cram in a camel if a canny canonball can cram caramel in a camel? If practice makes perfect and perfect needs practice, I'm perfectly practiced and practically perfect.

Best regards,

Jess`,
        attachments: [
            {
                name: 'workflow-data.pdf',
                size: '53.34 KB',
                type: 'pdf',
            },
            {
                name: 'forest.jpg',
                size: '123.34 KB',
                type: 'image',
            },
        ],
    };

    return (
        <Layout>
            <div className={`${font.className} flex h-screen p-8 gap-4`}>
                {/* Left Sidebar */}
                <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
                    {/* Compose Button */}
                    <button className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 mb-6">
                        Compose
                    </button>

                    {/* Mailbox Section */}
                    <div className="mb-6">
                        <p className="text-[10px] font-semibold border-b border-gray-200 text-gray-500 uppercase mb-4">MAILBOX</p>
                        <div className="space-y-2">
                            {mailboxItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between border-b border-gray-200 py-2 text-gray-700 hover:text-blue-600 cursor-pointer"
                                >
                                    <span className="text-[12.8px]">{item.name}</span>
                                    {item.count > 0 && (
                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                                            {item.count}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Filtered Section */}
                    <div className="mb-6">
                        <p className="text-[10px] font-semibold border-b border-gray-200 text-gray-500 uppercase mb-4">FILTERED</p>
                        <div className="space-y-2">
                            {filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between border-b border-gray-200 py-2 text-gray-700 hover:text-blue-600 cursor-pointer"
                                >
                                    <span className="text-[12.8px]">{item.name}</span>
                                    {item.count > 0 && (
                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                                            {item.count}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Labels Section */}
                    <div>
                        <p className="text-[10px] font-semibold border-b border-gray-200 text-gray-500 uppercase mb-4">LABELS</p>
                        <div className="space-y-2">
                            {labelItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-2 border-b border-gray-200 py-2 text-gray-700 hover:text-blue-600 cursor-pointer"
                                >
                                    <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                                    <span className="text-[12.8px]">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">

                    {/* Search Bar */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full p-2 bg-white border border-gray-300 rounded-lg font-[0.8rem] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    {/* Email Header */}
                    <div className="border-b border-gray-200 p-4">
                        <h1 className="text-xl font-semibold mb-2">{emailContent.subject}</h1>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                    <Image
                                        src={emailContent.sender.avatar}
                                        alt={emailContent.sender.name}
                                        width={40}
                                        height={40}
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium text-gray-900">
                                            {emailContent.sender.name}
                                        </span>
                                        <span className="text-gray-500 text-sm">
                                            &lt;{emailContent.sender.email}&gt;
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500">to Me {emailContent.date} ★</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="text-gray-400 hover:text-gray-600">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                        />
                                    </svg>
                                </button>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                                        />
                                    </svg>
                                </button>
                                <button className="text-yellow-500 hover:text-yellow-700">
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Email Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="max-w-2xl">
                            {/* Email Body */}
                            <div className="whitespace-pre-line mb-6 text-gray-700">
                                {emailContent.content}
                            </div>

                            {/* Attachments */}
                            <div className="space-y-4">
                                {emailContent.attachments.map((attachment, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg bg-white"
                                    >
                                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                            {attachment.type === 'pdf' ? (
                                                <svg
                                                    className="w-6 h-6 text-red-500"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    className="w-6 h-6 text-blue-500"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{attachment.name}</div>
                                            <div className="text-sm text-gray-500">{attachment.size}</div>
                                        </div>
                                        <button className="ml-auto text-blue-600 hover:text-blue-800">
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default EmailDetail;