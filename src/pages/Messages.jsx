import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Messages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [users, setUsers] = useState([]);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [messageSubject, setMessageSubject] = useState('');

  useEffect(() => {
    loadMessages();
    loadUsers();
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        if (showNewMessageModal) {
          setShowNewMessageModal(false);
        } else if (selectedConversation) {
          closeConversation();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showNewMessageModal, selectedConversation]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await axios.get('/api/users/for-messaging');
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const getConversations = () => {
    const conversations = {};
    
    messages.forEach(message => {
      const otherUserId = message.sender._id === user._id ? message.recipient._id : message.sender._id;
      const otherUser = message.sender._id === user._id ? message.recipient : message.sender;
      
      if (!conversations[otherUserId]) {
        conversations[otherUserId] = {
          user: otherUser,
          messages: [],
          lastMessage: message,
          unreadCount: 0
        };
      }
      
      conversations[otherUserId].messages.push(message);
      
      if (message.recipient._id === user._id && !message.read) {
        conversations[otherUserId].unreadCount++;
      }
    });

    return Object.values(conversations).sort((a, b) => 
      new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    );
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const response = await axios.post('/api/messages', {
        recipient: selectedConversation.user._id,
        content: newMessage,
        subject: messageSubject || 'New Message'
      });

      setMessages([...messages, response.data]);
      setNewMessage('');
      setMessageSubject('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const sendNewMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRecipient) return;

    try {
      setSending(true);
      const response = await axios.post('/api/messages', {
        recipient: selectedRecipient,
        content: newMessage,
        subject: messageSubject || 'New Message'
      });

      setMessages([...messages, response.data]);
      setNewMessage('');
      setMessageSubject('');
      setSelectedRecipient('');
      setShowNewMessageModal(false);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await axios.put(`/api/messages/${messageId}/read`);
      setMessages(messages.map(msg => 
        msg._id === messageId ? { ...msg, read: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const closeConversation = () => {
    setSelectedConversation(null);
    setNewMessage('');
    setMessageSubject('');
  };


  const conversations = getConversations();
  const isRecruiter = user?.role === 'recruiter' || user?.role === 'admin';

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white pt-16">
        <div className="w-full px-8 lg:px-12 xl:px-16 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white pt-16">
      <div className="w-full px-8 lg:px-12 xl:px-16 py-12">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
            Messages
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 font-medium leading-relaxed max-w-3xl">
            {isRecruiter ? 'Communicate with applicants and students' : 'View messages from recruiters'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Conversations</h2>
                {isRecruiter && (
                  <button
                    onClick={() => setShowNewMessageModal(true)}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-semibold text-sm"
                  >
                    New Message
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {conversations.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No conversations yet</p>
                ) : (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.user._id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 group ${
                        selectedConversation?.user._id === conversation.user._id
                          ? 'border-gray-900 bg-gray-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {conversation.user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{conversation.user.name}</h3>
                            <p className="text-sm text-gray-600 capitalize">{conversation.user.role}</p>
                          </div>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-2 truncate">
                        {conversation.lastMessage.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <div className="bg-white rounded-lg border border-gray-200 h-[600px] flex flex-col">
                {/* Conversation Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {selectedConversation.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{selectedConversation.user.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{selectedConversation.user.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={closeConversation}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      title="Close conversation"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${message.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          message.sender._id === user._id
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender._id === user._id ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-gray-200">
                  <form onSubmit={sendMessage} className="flex space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-semibold"
                    >
                      {sending ? 'Sending...' : 'Send'}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* New Message Modal */}
        {showNewMessageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Send New Message</h3>
              
              <form onSubmit={sendNewMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Recipient
                  </label>
                  <select
                    value={selectedRecipient}
                    onChange={(e) => setSelectedRecipient(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Select a recipient</option>
                    {users
                      .filter(u => u._id !== user._id)
                      .map(user => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.role})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                    placeholder="Message subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Message
                  </label>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                    placeholder="Type your message..."
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewMessageModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim() || !selectedRecipient}
                    className="flex-1 bg-gray-900 text-white px-4 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-semibold"
                  >
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Messages;
