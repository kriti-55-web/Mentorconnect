import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiMessageSquare, FiTarget, FiTrendingUp } from 'react-icons/fi';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connect with Alumni Mentors
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-primary-100 max-w-3xl mx-auto">
              Build meaningful mentorship relationships to accelerate your career growth
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition"
                >
                  Login
                </Link>
              </div>
            )}
            {user && (
              <Link
                to="/dashboard"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
          <p className="text-lg text-gray-600">
            Everything you need for successful mentorship
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 animate-slide-up">
            <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiUsers className="text-3xl text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Smart Matching</h3>
            <p className="text-gray-600">
              Find mentors based on your academic background, career interests, and skills
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiMessageSquare className="text-3xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Communication</h3>
            <p className="text-gray-600">
              Built-in messaging and discussion forums for seamless interaction
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-yellow-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiTarget className="text-3xl text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Goal Tracking</h3>
            <p className="text-gray-600">
              Set mentorship objectives and track progress with milestones
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiTrendingUp className="text-3xl text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Career Growth</h3>
            <p className="text-gray-600">
              Accelerate your professional development with expert guidance
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up as a student or mentor and complete your profile with your interests and goals
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Matches</h3>
              <p className="text-gray-600">
                Our algorithm matches you with compatible mentors or students based on shared interests
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Mentoring</h3>
              <p className="text-gray-600">
                Connect, communicate, set goals, and track progress together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

