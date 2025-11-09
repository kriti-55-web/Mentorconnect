import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, fetchUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/api/users/${user.id}`);
      setProfile(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${user.id}`, formData);

      if (user.userType === 'student' && formData.profile) {
        await axios.put(`/api/users/${user.id}/student-profile`, {
          graduationYear: formData.profile.graduationYear,
          major: formData.profile.major,
          careerInterests: formData.profile.careerInterests,
          skills: formData.profile.skills,
          goals: formData.profile.goals
        });
      } else if (user.userType === 'mentor' && formData.profile) {
        await axios.put(`/api/users/${user.id}/mentor-profile`, {
          graduationYear: formData.profile.graduationYear,
          major: formData.profile.major,
          currentPosition: formData.profile.currentPosition,
          company: formData.profile.company,
          industry: formData.profile.industry,
          expertiseAreas: formData.profile.expertiseAreas,
          yearsOfExperience: formData.profile.yearsOfExperience,
          availability: formData.profile.availability
        });
      }

      setMessage('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
      fetchUser();
    } catch (error) {
      setMessage('Failed to update profile');
      console.error('Failed to update profile:', error);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your profile information</p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className={`px-4 py-2 rounded-lg font-medium transition ${editing
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
              }`}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${message.includes('success')
              ? 'bg-green-50 border-green-400 text-green-700'
              : 'bg-red-50 border-red-400 text-red-700'
            }`}>
            <div className="flex items-center">
              {message.includes('success') ? (
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {message}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName || ''}
                onChange={handleChange}
                disabled={!editing}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleChange}
                disabled={!editing}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                disabled={!editing}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                rows="3"
                value={formData.bio || ''}
                onChange={handleChange}
                disabled={!editing}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
              />
            </div>

            {user.userType === 'student' && profile?.profile && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
                  <input
                    type="number"
                    name="profile.graduationYear"
                    value={formData.profile?.graduationYear || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, graduationYear: e.target.value }
                    })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Major</label>
                  <input
                    type="text"
                    name="profile.major"
                    value={formData.profile?.major || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, major: e.target.value }
                    })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Career Interests</label>
                  <input
                    type="text"
                    name="profile.careerInterests"
                    value={formData.profile?.careerInterests || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, careerInterests: e.target.value }
                    })}
                    disabled={!editing}
                    placeholder="e.g., Software Engineering, Data Science"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Skills</label>
                  <input
                    type="text"
                    name="profile.skills"
                    value={formData.profile?.skills || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, skills: e.target.value }
                    })}
                    disabled={!editing}
                    placeholder="e.g., Python, React, Machine Learning"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Goals</label>
                  <textarea
                    name="profile.goals"
                    rows="3"
                    value={formData.profile?.goals || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, goals: e.target.value }
                    })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                  />
                </div>
              </>
            )}

            {user.userType === 'mentor' && profile?.profile && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
                  <input
                    type="number"
                    name="profile.graduationYear"
                    value={formData.profile?.graduationYear || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, graduationYear: e.target.value }
                    })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Major</label>
                  <input
                    type="text"
                    name="profile.major"
                    value={formData.profile?.major || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, major: e.target.value }
                    })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Position</label>
                  <input
                    type="text"
                    name="profile.currentPosition"
                    value={formData.profile?.currentPosition || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, currentPosition: e.target.value }
                    })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    name="profile.company"
                    value={formData.profile?.company || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, company: e.target.value }
                    })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Industry</label>
                  <input
                    type="text"
                    name="profile.industry"
                    value={formData.profile?.industry || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, industry: e.target.value }
                    })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Expertise Areas</label>
                  <input
                    type="text"
                    name="profile.expertiseAreas"
                    value={formData.profile?.expertiseAreas || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, expertiseAreas: e.target.value }
                    })}
                    disabled={!editing}
                    placeholder="e.g., Software Engineering, Leadership, Product Management"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                  <input
                    type="number"
                    name="profile.yearsOfExperience"
                    value={formData.profile?.yearsOfExperience || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, yearsOfExperience: e.target.value }
                    })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Availability</label>
                  <input
                    type="text"
                    name="profile.availability"
                    value={formData.profile?.availability || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, availability: e.target.value }
                    })}
                    disabled={!editing}
                    placeholder="e.g., Weekends, Evenings"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                  />
                </div>
              </>
            )}

            {editing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

