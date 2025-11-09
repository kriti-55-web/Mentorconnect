import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMessageSquare, FiCheck, FiX } from 'react-icons/fi';

const Matches = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchMatches = useCallback(async () => {
    try {
      const response = await axios.get('/api/matches');
      setMatches(response.data);
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSuggestions = useCallback(async () => {
    try {
      const response = await axios.post('/api/matches/suggest');
      setSuggestions(response.data);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
    if (user?.userType === 'student') {
      fetchSuggestions();
    }
  }, [user, fetchMatches, fetchSuggestions]);

  const handleStatusUpdate = async (matchId, status) => {
    try {
      await axios.put(`/api/matches/${matchId}/status`, { status });
      setMessage({ type: 'success', text: `Match ${status} successfully!` });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      fetchMatches();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update match status' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const handleRequestMatch = async (mentorId) => {
    try {
      await axios.post('/api/matches', { mentorId });
      setMessage({ type: 'success', text: 'Match request sent successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      fetchMatches();
      fetchSuggestions();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to send match request' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const handleViewMessages = (matchId) => {
    navigate(`/messages?match=${matchId}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Matches</h1>
          {user?.userType === 'student' && (
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition shadow-md"
            >
              {showSuggestions ? 'Hide Suggestions' : 'View Suggestions'}
            </button>
          )}
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mt-4 p-4 rounded-lg border-l-4 ${message.type === 'success'
            ? 'bg-green-50 border-green-400 text-green-700'
            : 'bg-red-50 border-red-400 text-red-700'
            }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {message.text}
            </div>
          </div>
        )}
      </div>

      {/* Suggestions for Students */}
      {showSuggestions && user?.userType === 'student' && suggestions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Suggested Mentors</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map((mentor) => (
              <div key={mentor.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <FiUser className="text-2xl text-primary-600 mr-3" />
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {mentor.firstName} {mentor.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Match Score: {mentor.matchScore?.toFixed(0)}%
                    </p>
                  </div>
                </div>
                {mentor.currentPosition && (
                  <p className="text-sm text-gray-600 mb-2">{mentor.currentPosition}</p>
                )}
                {mentor.company && (
                  <p className="text-sm text-gray-600 mb-4">{mentor.company}</p>
                )}
                <button
                  onClick={() => handleRequestMatch(mentor.id)}
                  className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Request Match
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matches */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {user?.userType === 'student' ? 'Your Match Requests' : 'Match Requests'}
        </h2>
        {matches.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <FiUser className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg font-medium">No matches yet</p>
            {user?.userType === 'student' && (
              <button
                onClick={() => navigate('/mentors')}
                className="mt-4 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition transform hover:scale-105 shadow-md"
              >
                Find Mentors
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {matches.map((match) => (
              <div key={match.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition">
                <div className="flex items-start mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-md mr-4">
                    <FiUser className="text-2xl text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {user.userType === 'student'
                        ? `${match.firstName} ${match.lastName}`
                        : `${match.firstName} ${match.lastName}`}
                    </h3>
                    {user.userType === 'student' ? (
                      <div className="space-y-1">
                        {match.currentPosition && (
                          <p className="text-sm text-gray-600">{match.currentPosition}</p>
                        )}
                        {match.company && (
                          <p className="text-sm text-gray-600">{match.company}</p>
                        )}
                        {match.industry && (
                          <p className="text-sm text-gray-600">{match.industry}</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {match.major && (
                          <p className="text-sm text-gray-600">Major: {match.major}</p>
                        )}
                        {match.careerInterests && (
                          <p className="text-sm text-gray-600">Interests: {match.careerInterests}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Match Score</p>
                    <p className="text-lg font-semibold text-primary-600">{match.matchScore?.toFixed(0)}%</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${match.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    match.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      match.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {match.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex space-x-2">
                  {match.status === 'accepted' && (
                    <button
                      onClick={() => handleViewMessages(match.id)}
                      className="flex-1 flex items-center justify-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition shadow-md"
                    >
                      <FiMessageSquare className="mr-2" />
                      Messages
                    </button>
                  )}
                  {user.userType === 'mentor' && match.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(match.id, 'accepted')}
                        className="flex-1 flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-md"
                      >
                        <FiCheck className="mr-2" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(match.id, 'rejected')}
                        className="flex-1 flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition shadow-md"
                      >
                        <FiX className="mr-2" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;

