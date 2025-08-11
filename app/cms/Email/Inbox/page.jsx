'use client';
import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layout/Layout';
import { font } from "../../../Components/Font/font";
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  PaperClipIcon,
  PlusIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';

const InboxPage = () => {
  const [emails, setEmails] = useState([]);
  const [emailStats, setEmailStats] = useState({});
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFolder, setCurrentFolder] = useState('inbox');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });

  // Fetch emails from database
  const fetchEmails = async (folder = 'inbox', page = 1, search = '') => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        type: folder,
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search })
      });

      const response = await fetch(`https://api.certifurb.com/api/cms/emails?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setEmails(data.data);
        setPagination(data.pagination);
      } else {
        console.error('Failed to fetch emails:', data.message);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch email statistics
  const fetchEmailStats = async () => {
    try {
      const response = await fetch('https://api.certifurb.com/api/cms/emails/stats');
      const data = await response.json();
      if (data.success) {
        setEmailStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching email stats:', error);
    }
  };

  useEffect(() => {
    fetchEmails(currentFolder, 1, searchTerm);
    fetchEmailStats();
  }, [currentFolder]);

  // Handle search
  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      fetchEmails(currentFolder, 1, searchTerm);
    }
  };

  // Handle folder change
  const handleFolderChange = (folder) => {
    setCurrentFolder(folder);
    setSelectedEmails([]);
  };

  // Handle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedEmails(emails.map(e => e.EmailID));
    } else {
      setSelectedEmails([]);
    }
  };

  // Handle select single email
  const handleSelectEmail = (emailId, checked) => {
    if (checked) {
      setSelectedEmails([...selectedEmails, emailId]);
    } else {
      setSelectedEmails(selectedEmails.filter(id => id !== emailId));
    }
  };

  // Toggle star
  const toggleStar = async (emailId, currentlyStarred) => {
    try {
      const response = await fetch(`https://api.certifurb.com/api/cms/emails/${emailId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isStarred: !currentlyStarred
        })
      });

      if (response.ok) {
        // Update local state
        setEmails(emails.map(email => 
          email.EmailID === emailId 
            ? { ...email, IsStarred: !currentlyStarred }
            : email
        ));
        fetchEmailStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  // Bulk operations
  const handleBulkAction = async (action) => {
    if (selectedEmails.length === 0) return;

    try {
      const response = await fetch('https://api.certifurb.com/api/cms/emails/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailIds: selectedEmails,
          action: action
        })
      });

      if (response.ok) {
        // Refresh emails and stats
        fetchEmails(currentFolder, pagination.page, searchTerm);
        fetchEmailStats();
        setSelectedEmails([]);
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  // Format time ago
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  // Get avatar initials
  const getInitials = (email) => {
    if (!email) return 'U';
    const name = email.split('@')[0];
    return name.slice(0, 2).toUpperCase();
  };

  // Get avatar colors
  const getAvatarColor = (index) => {
    const colors = [
      'bg-orange-500',
      'bg-blue-500', 
      'bg-green-500',
      'bg-purple-500',
      'bg-red-500',
      'bg-indigo-500'
    ];
    return colors[index % colors.length];
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
              <button 
                onClick={() => handleFolderChange('inbox')}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg ${
                  currentFolder === 'inbox' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>Inbox</span>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {emailStats.inbox?.unread || 0}
                </span>
              </button>
              <button 
                onClick={() => handleFolderChange('sent')}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg ${
                  currentFolder === 'sent' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>Sent</span>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {emailStats.sent?.total || 0}
                </span>
              </button>
              <button 
                onClick={() => handleFolderChange('draft')}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-lg ${
                  currentFolder === 'draft' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>Draft</span>
              </button>
              <button 
                onClick={() => handleFolderChange('spam')}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-lg ${
                  currentFolder === 'spam' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>Spam</span>
              </button>
              <button 
                onClick={() => handleFolderChange('trash')}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-lg ${
                  currentFolder === 'trash' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>Trash</span>
              </button>
            </nav>
          </div>

          {/* Filtered Section */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">FILTERED</h3>
            </div>
            <nav className="space-y-1">
              <button 
                onClick={() => handleFolderChange('starred')}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-lg ${
                  currentFolder === 'starred' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>Starred</span>
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                <span>Archive</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleSearch}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button 
                  onClick={() => handleSearch({ type: 'click' })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Search
                </button>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <button 
                  onClick={() => {
                    fetchEmails(currentFolder, pagination.page, searchTerm);
                    fetchEmailStats();
                  }}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Email List Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedEmails.length === emails.length && emails.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {selectedEmails.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleBulkAction('read')}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Mark Read
                    </button>
                    <button 
                      onClick={() => handleBulkAction('unread')}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Mark Unread
                    </button>
                    <button 
                      onClick={() => handleBulkAction('star')}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Star
                    </button>
                    <button 
                      onClick={() => handleBulkAction('delete')}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Showing: {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </span>
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => fetchEmails(currentFolder, pagination.page - 1, searchTerm)}
                    disabled={pagination.page === 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => fetchEmails(currentFolder, pagination.page + 1, searchTerm)}
                    disabled={pagination.page >= pagination.pages}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Email List */}
          <div className="flex-1 bg-white overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading emails...</div>
              </div>
            ) : emails.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">No emails found</div>
              </div>
            ) : (
              emails.map((email, index) => (
                <Link key={email.EmailID} href={`/cms/Email/EmailDetail/${email.EmailID}`}>
                  <div className={`border-b border-gray-100 px-6 py-4 hover:bg-gray-50 cursor-pointer ${!email.IsRead ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedEmails.includes(email.EmailID)}
                        onChange={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSelectEmail(email.EmailID, e.target.checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleStar(email.EmailID, email.IsStarred);
                        }}
                        className="text-gray-400 hover:text-yellow-500"
                      >
                        {email.IsStarred ? (
                          <StarIconSolid className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <StarIcon className="h-5 w-5" />
                        )}
                      </button>

                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(index)}`}>
                        {getInitials(email.SenderEmail)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className={`text-sm ${!email.IsRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                              {currentFolder === 'sent' ? email.RecipientEmail : email.SenderEmail}
                            </span>
                            {email.HasAttachment && (
                              <PaperClipIcon className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {timeAgo(email.CreatedAt)}
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className={`text-sm ${!email.IsRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                            {email.Subject}
                          </span>
                          {email.Body && (
                            <span className="text-sm text-gray-500 ml-2">
                              - {email.Body.replace(/<[^>]*>/g, '').substring(0, 100)}...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InboxPage;