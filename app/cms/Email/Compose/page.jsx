'use client';
import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layout/Layout';
import { font } from "../../../Components/Font/font";
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  PaperClipIcon,
  PhotoIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

const ComposePage = () => {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [selectedSender, setSelectedSender] = useState('admin');

  useEffect(() => {
    // Get user data from localStorage using the correct key
    const userData = localStorage.getItem('cmsUser');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('Loaded user data:', parsedUser); // Debug log
      } catch (error) {
        console.error('Error parsing user data:', error);
        setError('Error loading user data');
      }
    } else {
      console.log('No user data found in localStorage'); // Debug log
    }
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateEmails = (emails) => {
    if (!emails) return true;
    return emails.split(',').every(email => validateEmail(email.trim()));
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setSuccess(false);

    // Debug log
    console.log('Current user state:', user);

    // Validate user is logged in
    if (!user || !user.role || !user.useremail) {
      setError('Please log in to send emails');
      return;
    }

    // Validate required fields
    if (!to || !subject || !message) {
      setError('To, subject, and message are required');
      return;
    }

    // Validate email formats
    if (!validateEmails(to)) {
      setError('Invalid email address in To field');
      return;
    }
    if (cc && !validateEmails(cc)) {
      setError('Invalid email address in CC field');
      return;
    }
    if (bcc && !validateEmails(bcc)) {
      setError('Invalid email address in BCC field');
      return;
    }

    setSending(true);

    try {
      const response = await fetch('https://api.certifurb.com/api/cms/emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: to.trim(),
          cc: cc.trim(),
          bcc: bcc.trim(),
          subject: subject.trim(),
          body: message,
          senderType: selectedSender,
          userRole: user.role,
          userEmail: user.useremail
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Clear form
        setTo('');
        setCc('');
        setBcc('');
        setSubject('');
        setMessage('');
        
        // Show success message for 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setError('Error sending email. Please check your email configuration and try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <div className={`${font.className} flex h-screen bg-gray-50`}>
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Compose Button */}
          <div className="p-4">
            <Link href="/cms/Email/Compose">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Compose
              </button>
            </Link>
          </div>

          {/* Mailbox Section */}
          <div className="px-4 pb-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">MAILBOX</h3>
            <nav className="space-y-1">
              <Link href="/cms/Email/Inbox" className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                <span>Inbox</span>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">5</span>
              </Link>
              <Link href="/cms/Email/Inbox" className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                <span>Sent</span>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">23</span>
              </Link>
              <Link href="/cms/Email/Inbox" className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                <span>Draft</span>
              </Link>
              <Link href="/cms/Email/Inbox" className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                <span>Spam</span>
              </Link>
              <Link href="/cms/Email/Inbox" className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                <span>Trash</span>
              </Link>
            </nav>
          </div>

          {/* Filtered Section */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">FILTERED</h3>
            </div>
            <nav className="space-y-1">
              <Link href="/cms/Email/Inbox" className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                <span>Starred</span>
              </Link>
              <Link href="/cms/Email/Inbox" className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                <span>Archive</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">Compose Email</h1>
              <Link href="/cms/Email/Inbox">
                <button className="text-gray-500 hover:text-gray-700">
                  Back to Inbox
                </button>
              </Link>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 mx-6 mt-4 rounded">
              Email sent successfully!
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mx-6 mt-4 rounded">
              {error}
            </div>
          )}

          {/* Compose Form */}
          <form onSubmit={handleSendEmail} className="flex-1 bg-white p-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Sender Selection (for admin only) */}
              {user?.role === 'admin' && (
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Send From
                  </label>
                  <select
                    value={selectedSender}
                    onChange={(e) => setSelectedSender(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="admin">Admin (admin@logisol.tech)</option>
                    <option value="marketing">Marketing (marketing@logisol.tech)</option>
                    <option value="sales">Sales (sales@logisol.tech)</option>
                  </select>
                </div>
              )}

              {/* Email Fields */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <input
                    type="email"
                    placeholder="To *"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="CC"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="BCC"
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <input
                  type="text"
                  placeholder="Subject *"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Rich Text Editor Toolbar */}
              <div className="border border-gray-300 rounded-lg">
                <div className="flex items-center space-x-1 p-3 border-b border-gray-200 bg-gray-50">
                  {/* Undo/Redo */}
                  <button type="button" className="p-2 text-gray-600 hover:bg-gray-200 rounded">
                    <ArrowUturnLeftIcon className="h-4 w-4" />
                  </button>
                  <button type="button" className="p-2 text-gray-600 hover:bg-gray-200 rounded">
                    <ArrowUturnRightIcon className="h-4 w-4" />
                  </button>
                  
                  <div className="w-px h-6 bg-gray-300 mx-2"></div>

                  {/* Text Formatting */}
                  <button type="button" className="p-2 text-gray-600 hover:bg-gray-200 rounded font-bold">
                    B
                  </button>
                  <button type="button" className="p-2 text-gray-600 hover:bg-gray-200 rounded italic">
                    I
                  </button>
                  <button type="button" className="p-2 text-gray-600 hover:bg-gray-200 rounded underline">
                    U
                  </button>

                  <div className="w-px h-6 bg-gray-300 mx-2"></div>

                  {/* Attachments */}
                  <button type="button" className="p-2 text-gray-600 hover:bg-gray-200 rounded">
                    <PaperClipIcon className="h-4 w-4" />
                  </button>
                  <button type="button" className="p-2 text-gray-600 hover:bg-gray-200 rounded">
                    <PhotoIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Message Body */}
                <textarea
                  placeholder="Write your message here... *"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={15}
                  className="w-full p-4 border-0 focus:outline-none resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    disabled={sending || !user}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="h-4 w-4" />
                    <span>{sending ? 'Sending...' : 'Send'}</span>
                  </button>
                  <button
                    type="button"
                    className="text-gray-600 hover:text-gray-800 px-4 py-2"
                  >
                    Save Draft
                  </button>
                </div>
                <button
                  type="button"
                  className="text-red-600 hover:text-red-800 px-4 py-2"
                >
                  Discard
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ComposePage;