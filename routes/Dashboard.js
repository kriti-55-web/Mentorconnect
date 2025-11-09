import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiMessageSquare, FiTarget, FiTrendingUp } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    matches: 0,
    messages: 0,
    goals: 0,
    activeMatches: 0
  });
  const [recentMatches, setRecentMatches] = useState([]);
  const [quizCategory, setQuizCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const basePromises = [
        axios.get('/api/matches'),
        axios.get('/api/messages/unread/count')
      ];
      const extra = [];
      if (user?.userType === 'student') {
        extra.push(axios.get('/api/quiz/result/latest').catch(() => ({ data: { exists: false } })));
      }
      const [matchesRes, messagesRes, quizRes] = await Promise.all([...basePromises, ...extra]);

      const matches = matchesRes.data;
      const activeMatches = matches.filter(m => m.status === 'accepted').length;

      setStats({
        matches: matches.length,
        messages: messagesRes.data.count || 0,
        goals: 0, // Will be calculated when goals are fetched
        activeMatches
      });

      setRecentMatches(matches.slice(0, 5));

      if (user?.userType === 'student' && quizRes) {
        const exists = quizRes.data?.exists;
        setQuizCategory(exists ? quizRes.data?.result?.category : null);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {user.firstName}! 👋
        </h1>
        <p className="text-lg text-gray-600">
          Here's an overview of your mentorship activity
        </p>
        {user.userType === 'student' && quizCategory && (
          <div className="mt-4 inline-flex items-center space-x-2">
            <span className="text-sm text-gray-600">Your skill category:</span>
            <span className={`text-xs px-3 py-1 rounded-full border 
              ${quizCategory === 'Advanced' ? 'bg-green-50 text-green-700 border-green-200' : 
                quizCategory === 'Intermediate' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                'bg-red-50 text-red-700 border-red-200'}`}>
              {quizCategory}
            </span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Matches</p>
              <p className="text-3xl font-bold text-gray-900">{stats.matches}</p>
            </div>
            <div className="p-4 bg-primary-100 rounded-xl">
              <FiUsers className="text-primary-600 text-3xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Matches</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeMatches}</p>
            </div>
            <div className="p-4 bg-green-100 rounded-xl">
              <FiUsers className="text-green-600 text-3xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Unread Messages</p>
              <p className="text-3xl font-bold text-gray-900">{stats.messages}</p>
            </div>
            <div className="p-4 bg-yellow-100 rounded-xl">
              <FiMessageSquare className="text-yellow-600 text-3xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Goals</p>
              <p className="text-3xl font-bold text-gray-900">{stats.goals}</p>
            </div>
            <div className="p-4 bg-purple-100 rounded-xl">
              <FiTarget className="text-purple-600 text-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {user.userType === 'student' && (
              <Link
                to="/mentors"
                className="block w-full bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 text-center font-medium transition transform hover:scale-105 shadow-md"
              >
                Find Mentors
              </Link>
            )}
            <Link
              to="/matches"
              className="block w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-200 text-center font-medium transition"
            >
              View All Matches
            </Link>
            <Link
              to="/messages"
              className="block w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-200 text-center font-medium transition shadow-sm"
            >
              Check Messages
            </Link>
            <Link
              to="/goals"
              className="block w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-200 text-center font-medium transition shadow-sm"
            >
              Manage Goals
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Matches</h2>
          {recentMatches.length === 0 ? (
            <div className="text-center py-8">
              <FiUsers className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500">No matches yet</p>
              {user.userType === 'student' && (
                <Link
                  to="/mentors"
                  className="mt-4 inline-block text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Find mentors →
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {recentMatches.map((match) => (
                <div key={match.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                  <p className="font-semibold text-gray-900 mb-1">
                    {user.userType === 'student'
                      ? `${match.firstName} ${match.lastName}`
                      : `${match.firstName} ${match.lastName}`}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Match Score: <span className="font-medium">{match.matchScore?.toFixed(0)}%</span>
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${match.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        match.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {match.status}
                    </span>
                  </div>
                </div>
              ))}
              <Link
                to="/matches"
                className="block text-center text-primary-600 hover:text-primary-700 text-sm font-medium pt-2"
              >
                View all matches →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

