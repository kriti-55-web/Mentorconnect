import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiUser, FiBriefcase, FiMapPin } from 'react-icons/fi';

const Mentors = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filters, setFilters] = useState({
    major: '',
    industry: '',
    expertiseAreas: ''
  });

  const fetchMentors = useCallback(async () => {
    try {
      const response = await axios.get('/api/mentors');
      setMentors(response.data);
    } catch (error) {
      console.error('Failed to fetch mentors:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.userType !== 'student') {
      navigate('/dashboard');
      return;
    }
    fetchMentors();
  }, [user, navigate, fetchMentors]);

  useEffect(() => {
    let filtered = mentors;

    if (searchTerm) {
      filtered = filtered.filter(mentor =>
        `${mentor.firstName} ${mentor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.major) {
      filtered = filtered.filter(mentor =>
        mentor.major?.toLowerCase().includes(filters.major.toLowerCase())
      );
    }

    if (filters.industry) {
      filtered = filtered.filter(mentor =>
        mentor.industry?.toLowerCase().includes(filters.industry.toLowerCase())
      );
    }

    if (filters.expertiseAreas) {
      filtered = filtered.filter(mentor =>
        mentor.expertiseAreas?.toLowerCase().includes(filters.expertiseAreas.toLowerCase())
      );
    }

    setFilteredMentors(filtered);
  }, [searchTerm, filters, mentors]);

  const handleRequestMatch = async (mentorId) => {
    try {
      await axios.post('/api/matches', { mentorId });
      setMessage({ type: 'success', text: 'Match request sent successfully!' });
      setTimeout(() => {
        setMessage({ type: '', text: '' });
        navigate('/matches');
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to send match request' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Mentors</h1>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-4 p-4 rounded-lg border-l-4 ${message.type === 'success'
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

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="mb-4">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search mentors by name, company, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
              <input
                type="text"
                placeholder="Filter by major"
                value={filters.major}
                onChange={(e) => setFilters({ ...filters, major: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <input
                type="text"
                placeholder="Filter by industry"
                value={filters.industry}
                onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expertise</label>
              <input
                type="text"
                placeholder="Filter by expertise"
                value={filters.expertiseAreas}
                onChange={(e) => setFilters({ ...filters, expertiseAreas: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FiUser className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No mentors found matching your criteria</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredMentors.map((mentor) => (
            <div key={mentor.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100">
              <div className="flex items-start mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-md">
                  <FiUser className="text-2xl text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {mentor.firstName} {mentor.lastName}
                  </h3>
                  {mentor.currentPosition && (
                    <p className="text-sm text-gray-600 mt-1">{mentor.currentPosition}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {mentor.company && (
                  <div className="flex items-center text-gray-600">
                    <FiBriefcase className="mr-2 text-gray-400" />
                    <span className="text-sm">{mentor.company}</span>
                  </div>
                )}

                {mentor.industry && (
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="mr-2 text-gray-400" />
                    <span className="text-sm">{mentor.industry}</span>
                  </div>
                )}

                {mentor.major && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Major:</span> {mentor.major}
                  </p>
                )}

                {mentor.expertiseAreas && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Expertise:</p>
                    <p className="text-sm text-gray-600">{mentor.expertiseAreas}</p>
                  </div>
                )}

                {mentor.yearsOfExperience && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Experience:</span> {mentor.yearsOfExperience} years
                  </p>
                )}
              </div>

              {mentor.bio && (
                <p className="text-sm text-gray-700 mb-4 line-clamp-3 bg-gray-50 p-3 rounded-lg">
                  {mentor.bio}
                </p>
              )}

              <button
                onClick={() => handleRequestMatch(mentor.id)}
                className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition transform hover:scale-105 font-medium shadow-md"
              >
                Request Match
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Mentors;

