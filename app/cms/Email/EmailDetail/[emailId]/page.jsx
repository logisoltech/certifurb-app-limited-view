'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../../../Components/Layout/Layout';
import { font } from "../../../../Components/Font/font";
import Link from 'next/link';
import {
  ArrowLeftIcon,
  StarIcon,
  PaperClipIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  TrashIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';

const EmailDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.emailId) {
      fetchEmail(params.emailId);
    }
  }, [params.emailId]);

  const fetchEmail = async (emailId) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.certifurb.com/api/cms/emails/${emailId}`);
      const data = await response.json();

      if (data.success) {
        setEmail(data.data);
      } else {
        setError(data.message || 'Failed to fetch email');
      }
    } catch (error) {
      console.error('Error fetching email:', error);
      setError('Error loading email');
    } finally {
      setLoading(false);
    }
  };

  const toggleStar = async () => {
    if (!email) return;

    try {
      const response = await fetch(`https://api.certifurb.com/api/cms/emails/${email.EmailID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isStarred: !email.IsStarred
        })
      });

      if (response.ok) {
        setEmail({ ...email, IsStarred: !email.IsStarred });
      }
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  const deleteEmail = async () => {
    if (!email) return;

    if (confirm('Are you sure you want to delete this email?')) {
      try {
        const response = await fetch(`https://api.certifurb.com/api/cms/emails/${email.EmailID}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          router.push('/cms/Email/Inbox');
        }
      } catch (error) {
        console.error('Error deleting email:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (email) => {
    if (!email) return 'U';
    const name = email.split('@')[0];
    return name.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <Layout>
        <div className={`${font.className} flex items-center justify-center h-screen`}>
          <div className="text-gray-500">Loading email...</div>
        </div>
      </Layout>
    );
  }

  if (error || !email) {
    return (
      <Layout>
        <div className={`${font.className} flex items-center justify-center h-screen`}>
          <div className="text-red-500">{error || 'Email not found'}</div>
        </div>
      </Layout>
    );
  }

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
              </Link>
              <Link href="/cms/Email/Inbox" className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                <span>Sent</span>
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
              <div className="flex items-center space-x-4">
                <Link href="/cms/Email/Inbox">
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                    <ArrowLeftIcon className="h-5 w-5" />
                  </button>
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">Email Details</h1>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleStar}
                  className="p-2 text-gray-500 hover:text-yellow-500 rounded-lg hover:bg-gray-100"
                >
                  {email.IsStarred ? (
                    <StarIconSolid className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <StarIcon className="h-5 w-5" />
                  )}
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                  <PrinterIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={deleteEmail}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Email Content */}
          <div className="flex-1 bg-white overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6">
              {/* Email Header */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{email.Subject}</h2>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg font-medium">
                    {getInitials(email.SenderEmail)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-medium text-gray-900">{email.SenderEmail}</p>
                        <p className="text-sm text-gray-600">to {email.RecipientEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{formatDate(email.CreatedAt)}</p>
                        {email.HasAttachment && (
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <PaperClipIcon className="h-4 w-4 mr-1" />
                            <span>Has attachments</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Body */}
              <div className="prose max-w-none">
                <div 
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: email.Body || 'No content' }}
                />
              </div>

              {/* Attachments */}
              {email.HasAttachment && email.AttachmentUrls && (
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Attachments</h3>
                  <div className="space-y-2">
                    {JSON.parse(email.AttachmentUrls).map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <PaperClipIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-700">{attachment.filename || `Attachment ${index + 1}`}</span>
                        <button className="text-sm text-blue-600 hover:text-blue-800">Download</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex items-center space-x-4">
                  <Link href={`/cms/Email/Compose?reply=${email.EmailID}`}>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <ArrowUturnLeftIcon className="h-4 w-4" />
                      <span>Reply</span>
                    </button>
                  </Link>
                  <Link href={`/cms/Email/Compose?forward=${email.EmailID}`}>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                      <ArrowUturnRightIcon className="h-4 w-4" />
                      <span>Forward</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmailDetailPage; 