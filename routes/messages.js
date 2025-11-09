import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { FiSend, FiUser, FiMessageSquare, FiPhone, FiCheck, FiX } from 'react-icons/fi';

const Messages = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const matchIdParam = searchParams.get('match');
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [callStatus, setCallStatus] = useState('none'); // none | pending | approved | rejected
  const [pendingRequestId, setPendingRequestId] = useState(null); // for mentor actions
  const [callLoading, setCallLoading] = useState(false);
  const [callError, setCallError] = useState('');
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const fetchMatches = useCallback(async () => {
    try {
      const response = await axios.get('/api/matches');
      const acceptedMatches = response.data.filter(m => m.status === 'accepted');
      setMatches(acceptedMatches);

      if (acceptedMatches.length > 0 && !matchIdParam) {
        setSelectedMatch(acceptedMatches[0]);
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      setLoading(false);
    }
  }, [matchIdParam]);

  const fetchMessages = useCallback(async (matchId) => {
    try {
      const response = await axios.get(`/api/messages/match/${matchId}`);
      setMessages(response.data);
      // Mark messages as read
      await axios.put(`/api/messages/read/${matchId}`);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, []);

  const fetchCallStatus = useCallback(async (matchId) => {
    try {
      const { data } = await axios.get(`/api/calls/status/${matchId}`);
      setCallStatus(data.status || 'none');
    } catch (e) {
      // If route not found (backend not restarted / feature unavailable), silently fallback
      if (e?.response?.status === 404) {
        setCallStatus('none');
        return;
      }
      setCallStatus('none');
    }
  }, []);

  const fetchPendingRequestForMentor = useCallback(async (matchId) => {
    try {
      if (user?.userType !== 'mentor') return setPendingRequestId(null);
      const { data } = await axios.get('/api/calls/requests');
      const reqForMatch = (data || []).find(r => Number(r.matchId) === Number(matchId));
      setPendingRequestId(reqForMatch ? reqForMatch.id : null);
    } catch (e) {
      setPendingRequestId(null);
    }
  }, [user?.userType]);

  useEffect(() => {
    fetchMatches();

    // Initialize socket connection - target backend (port 5001) and send JWT for auth
    const socketUrl = process.env.REACT_APP_SOCKET_URL || `${window.location.protocol}//${window.location.hostname}:5001`;
    const token = localStorage.getItem('token');
    socketRef.current = io(socketUrl, {
      transports: ['websocket', 'polling'],
      auth: token ? { token } : undefined
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [fetchMatches]);

  const requestCall = async () => {
    if (!selectedMatch) return;
    try {
      setCallError('');
      setCallLoading(true);
      await axios.post('/api/calls/request', { matchId: selectedMatch.id });
      setCallStatus('pending');
    } catch (e) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.error || 'Failed to request call';
      // If a pending request already exists, reflect pending state without error noise
      if (status === 400 && /pending request already exists/i.test(msg)) {
        setCallStatus('pending');
        setCallError('');
      } else if (status === 404) {
        // Backend route not found or match not found
        setCallError('Call feature unavailable or match not found');
      } else {
        setCallError(msg);
      }
      console.error('requestCall error:', msg);
    }
    finally { setCallLoading(false); }
  };

  const respondCall = async (accept) => {
    if (!pendingRequestId) return;
    try {
      setCallError('');
      const status = accept ? 'approved' : 'rejected';
      await axios.post('/api/calls/respond', { requestId: pendingRequestId, status });
      setCallStatus(status);
      setPendingRequestId(null);
    } catch (e) {
      const msg = e?.response?.data?.error || 'Failed to respond to call request';
      setCallError(msg);
      console.error('respondCall error:', msg);
    }
  };

  useEffect(() => {
    if (matchIdParam && matches.length > 0) {
      const match = matches.find(m => m.id === parseInt(matchIdParam));
      if (match) {
        setSelectedMatch(match);
        fetchMessages(match.id);
        fetchCallStatus(match.id);
        fetchPendingRequestForMentor(match.id);
      }
    } else if (matches.length > 0 && !matchIdParam) {
      setSelectedMatch(matches[0]);
      fetchMessages(matches[0].id);
      fetchCallStatus(matches[0].id);
      fetchPendingRequestForMentor(matches[0].id);
    }
  }, [matchIdParam, matches, fetchMessages, fetchCallStatus, fetchPendingRequestForMentor]);

  useEffect(() => {
    if (selectedMatch && socketRef.current) {
      socketRef.current.emit('join-room', selectedMatch.id.toString());
      fetchMessages(selectedMatch.id);
      fetchCallStatus(selectedMatch.id);
      fetchPendingRequestForMentor(selectedMatch.id);
    }

    const socket = socketRef.current;
    if (socket && selectedMatch) {
      const handleReceiveMessage = (data) => {
        if (Number(data.matchId) === Number(selectedMatch?.id)) {
          // debug alignment
          try { console.debug('recv msg senderId/userId', data.senderId, user?.id); } catch(e) {}
          setMessages(prev => [...prev, data]);
        }
      };

      socket.on('receive-message', handleReceiveMessage);

      return () => {
        socket.off('receive-message', handleReceiveMessage);
      };
    }
  }, [selectedMatch, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMatch) return;

    const receiverId = user.userType === 'student'
      ? selectedMatch.mentorId
      : selectedMatch.studentId;

    // Send via Socket.io only; server will persist and broadcast
    if (socketRef.current) {
      socketRef.current.emit('send-message', {
        roomId: selectedMatch.id.toString(),
        receiverId,
        content: newMessage
      });
      setNewMessage('');
    }
  };

  

  if (loading || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
          <FiMessageSquare className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg font-medium">No accepted matches yet</p>
          <p className="text-gray-400 mt-2">You need to have an accepted match to send messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Messages</h1>

      <div className="flex h-[700px] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Matches Sidebar */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto bg-gray-50">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="font-bold text-gray-900 text-lg">Conversations</h2>
          </div>
          {matches.map((match) => (
            <button
              key={match.id}
              onClick={() => {
                setSelectedMatch(match);
                fetchMessages(match.id);
              }}
              className={`w-full p-4 text-left border-b border-gray-200 hover:bg-gray-100 transition ${selectedMatch?.id === match.id ? 'bg-primary-50 border-l-4 border-l-primary-600' : 'bg-white'
                }`}
            >
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${selectedMatch?.id === match.id ? 'bg-primary-600' : 'bg-primary-100'
                  }`}>
                  <FiUser className={`text-xl ${selectedMatch?.id === match.id ? 'text-white' : 'text-primary-600'}`} />
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${selectedMatch?.id === match.id ? 'text-primary-900' : 'text-gray-900'}`}>
                    {user.userType === 'student'
                      ? `${match.firstName} ${match.lastName}`
                      : `${match.firstName} ${match.lastName}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user.userType === 'student' ? match.currentPosition : match.major}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedMatch ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                    <FiUser className="text-xl text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">
                      {`${selectedMatch.firstName} ${selectedMatch.lastName}`}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        callStatus === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                        callStatus === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        callStatus === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-gray-50 text-gray-600 border-gray-200'
                      }`}>
                        {callStatus === 'none' ? 'No call requested' : callStatus}
                      </span>
                      {callError && (
                        <span className="text-xs text-red-600">{callError}</span>
                      )}
                    </div>
                  </div>

                  {/* Right side actions: Student sees Request Call; Mentor sees Approve/Reject when pending */}
                  {user.userType === 'student' ? (
                    <button
                      onClick={requestCall}
                      disabled={callStatus === 'pending' || callLoading}
                      className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      <FiPhone className="mr-2" />
                      {callLoading ? 'Requesting...' : callStatus === 'approved' ? 'Start Call' : callStatus === 'pending' ? 'Request Sent' : 'Request Call'}
                    </button>
                  ) : (
                    pendingRequestId && (
                      <div className="flex items-center space-x-2">
                        <button onClick={() => respondCall(true)} className="inline-flex items-center px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
                          <FiCheck className="mr-1" /> Approve
                        </button>
                        <button onClick={() => respondCall(false)} className="inline-flex items-center px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
                          <FiX className="mr-1" /> Reject
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${Number(message.senderId) === Number(user.id) ? 'justify-end' : 'justify-start'
                        }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${Number(message.senderId) === Number(user.id)
                          ? 'bg-primary-600 text-white rounded-br-sm'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                          }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p
                          className={`text-xs mt-2 ${Number(message.senderId) === Number(user.id)
                            ? 'text-primary-100'
                            : 'text-gray-500'
                            }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  />
                  <button
                    type="submit"
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 flex items-center transition transform hover:scale-105 shadow-md"
                  >
                    <FiSend className="mr-2" />
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
              <div className="text-center">
                <FiMessageSquare className="mx-auto h-12 w-12 mb-2" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;

