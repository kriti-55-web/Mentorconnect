import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiUser, FiMessageSquare } from 'react-icons/fi';

const Forums = () => {
  const { user } = useAuth();
  const [forums, setForums] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForumForm, setShowForumForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [forumForm, setForumForm] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [postForm, setPostForm] = useState({
    content: ''
  });

  useEffect(() => {
    fetchForums();
  }, []);

  const fetchForums = async () => {
    try {
      const response = await axios.get('/api/forums');
      setForums(response.data);
    } catch (error) {
      console.error('Failed to fetch forums:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchForumDetails = async (forumId) => {
    try {
      const response = await axios.get(`/api/forums/${forumId}`);
      setSelectedForum(response.data);
    } catch (error) {
      console.error('Failed to fetch forum details:', error);
    }
  };

  const handleCreateForum = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/forums', forumForm);
      setForumForm({ title: '', description: '', category: '' });
      setShowForumForm(false);
      fetchForums();
    } catch (error) {
      console.error('Failed to create forum:', error);
      // Error handling - could add toast notification
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!selectedForum) return;

    try {
      await axios.post(`/api/forums/${selectedForum.id}/posts`, {
        content: postForm.content
      });
      setPostForm({ content: '' });
      setShowPostForm(false);
      fetchForumDetails(selectedForum.id);
    } catch (error) {
      console.error('Failed to create post:', error);
      // Error handling - could add toast notification
    }
  };

  const handleForumClick = (forumId) => {
    fetchForumDetails(forumId);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Discussion Forums</h1>
        <button
          onClick={() => setShowForumForm(!showForumForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
        >
          <FiPlus className="mr-2" />
          New Forum
        </button>
      </div>

      {/* Create Forum Form */}
      {showForumForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Forum</h2>
          <form onSubmit={handleCreateForum}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={forumForm.title}
                  onChange={(e) => setForumForm({ ...forumForm, title: e.target.value })}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={forumForm.description}
                  onChange={(e) => setForumForm({ ...forumForm, description: e.target.value })}
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  value={forumForm.category}
                  onChange={(e) => setForumForm({ ...forumForm, category: e.target.value })}
                  placeholder="e.g., Career Advice, Technical Skills"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Create Forum
                </button>
                <button
                  type="button"
                  onClick={() => setShowForumForm(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-6">
        {/* Forums List */}
        <div className="w-1/3">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-bold text-gray-900 text-lg">Forums</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {forums.map((forum) => (
                <button
                  key={forum.id}
                  onClick={() => handleForumClick(forum.id)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition ${selectedForum?.id === forum.id ? 'bg-primary-50 border-l-4 border-l-primary-600' : ''
                    }`}
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{forum.title}</h3>
                  {forum.category && (
                    <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full mb-2">
                      {forum.category}
                    </span>
                  )}
                  <p className="text-sm text-gray-600 mt-2">{forum.postCount || 0} posts</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Forum Details */}
        <div className="flex-1">
          {selectedForum ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedForum.title}</h2>
                {selectedForum.description && (
                  <p className="text-gray-600 mt-2">{selectedForum.description}</p>
                )}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4">
                    {selectedForum.category && (
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                        {selectedForum.category}
                      </span>
                    )}
                    <div className="flex items-center text-gray-500">
                      <FiUser className="mr-2" />
                      <span className="text-sm">
                        Created by {selectedForum.firstName} {selectedForum.lastName}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPostForm(!showPostForm)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center transition shadow-md"
                  >
                    <FiMessageSquare className="mr-2" />
                    New Post
                  </button>
                </div>
              </div>

              {/* Post Form */}
              {showPostForm && (
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <form onSubmit={handleCreatePost}>
                    <textarea
                      value={postForm.content}
                      onChange={(e) => setPostForm({ content: e.target.value })}
                      rows="4"
                      placeholder="Write your post..."
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    <div className="flex space-x-2 mt-2">
                      <button
                        type="submit"
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                      >
                        Post
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPostForm(false)}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Posts */}
              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Posts</h3>
                {selectedForum.posts && selectedForum.posts.length > 0 ? (
                  <div className="space-y-4">
                    {selectedForum.posts.map((post) => (
                      <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                            <FiUser className="text-primary-600" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 block">
                              {post.firstName} {post.lastName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(post.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap ml-13">{post.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-500">No posts yet. Be the first to post!</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
              <FiMessageSquare className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">Select a forum to view discussions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forums;
