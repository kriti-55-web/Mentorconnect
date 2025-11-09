import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
          ? 'bg-primary-100 text-primary-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">
                MentorConnect
              </span>
            </Link>
            {user && (
              <div className="hidden md:ml-10 md:flex md:space-x-1">
                <NavLink to="/dashboard">Dashboard</NavLink>
                {user.userType === 'student' && (
                  <NavLink to="/mentors">Find Mentors</NavLink>
                )}
                <NavLink to="/matches">Matches</NavLink>
                <NavLink to="/messages">Messages</NavLink>
                <NavLink to="/goals">Goals</NavLink>
                <NavLink to="/forums">Forums</NavLink>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <FiUser className="mr-2" />
                  {user.firstName} {user.lastName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && user && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Dashboard
            </Link>
            <Link
              to="/mentors"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Find Mentors
            </Link>
            <Link
              to="/matches"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Matches
            </Link>
            <Link
              to="/messages"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Messages
            </Link>
            <Link
              to="/goals"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Goals
            </Link>
            <Link
              to="/forums"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Forums
            </Link>
            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

