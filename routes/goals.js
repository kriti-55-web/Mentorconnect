import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiCheck, FiTarget, FiCalendar } from 'react-icons/fi';

const Goals = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    targetDate: '',
    milestones: [{ title: '', description: '' }]
  });

  const fetchMatches = useCallback(async () => {
    try {
      const response = await axios.get('/api/matches');
      const acceptedMatches = response.data.filter(m => m.status === 'accepted');
      setMatches(acceptedMatches);
      if (acceptedMatches.length > 0) {
        setSelectedMatch(acceptedMatches[0]);
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGoals = useCallback(async (matchId) => {
    try {
      const response = await axios.get(`/api/goals/match/${matchId}`);
      setGoals(response.data);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  useEffect(() => {
    if (selectedMatch) {
      fetchGoals(selectedMatch.id);
    }
  }, [selectedMatch, fetchGoals]);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!selectedMatch || !goalForm.title) return;

    try {
      const milestones = goalForm.milestones.filter(m => m.title.trim());
      await axios.post('/api/goals', {
        matchId: selectedMatch.id,
        title: goalForm.title,
        description: goalForm.description,
        targetDate: goalForm.targetDate,
        milestones: milestones.length > 0 ? milestones : undefined
      });

      setGoalForm({
        title: '',
        description: '',
        targetDate: '',
        milestones: [{ title: '', description: '' }]
      });
      setShowGoalForm(false);
      fetchGoals(selectedMatch.id);
    } catch (error) {
      console.error('Failed to create goal:', error);
      // Error handling - could add toast notification
    }
  };

  const handleUpdateGoalStatus = async (goalId, status) => {
    try {
      await axios.put(`/api/goals/${goalId}`, { status });
      fetchGoals(selectedMatch.id);
    } catch (error) {
      console.error('Failed to update goal:', error);
    }
  };

  const handleUpdateMilestone = async (milestoneId, completed) => {
    try {
      await axios.put(`/api/goals/milestones/${milestoneId}`, { completed });
      fetchGoals(selectedMatch.id);
    } catch (error) {
      console.error('Failed to update milestone:', error);
    }
  };

  const addMilestone = () => {
    setGoalForm({
      ...goalForm,
      milestones: [...goalForm.milestones, { title: '', description: '' }]
    });
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

  if (matches.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
          <FiTarget className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg font-medium">No accepted matches yet</p>
          <p className="text-gray-400 text-sm mt-2">You need to have an accepted match to set goals</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Goals & Progress</h1>
        {selectedMatch && (
          <button
            onClick={() => setShowGoalForm(!showGoalForm)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
          >
            <FiPlus className="mr-2" />
            New Goal
          </button>
        )}
      </div>

      {/* Match Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Match
        </label>
        <select
          value={selectedMatch?.id || ''}
          onChange={(e) => {
            const match = matches.find(m => m.id === parseInt(e.target.value));
            setSelectedMatch(match);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {matches.map((match) => (
            <option key={match.id} value={match.id}>
              {user.userType === 'student'
                ? `${match.firstName} ${match.lastName}`
                : `${match.firstName} ${match.lastName}`}
            </option>
          ))}
        </select>
      </div>

      {/* Goal Form */}
      {showGoalForm && selectedMatch && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Goal</h2>
          <form onSubmit={handleCreateGoal}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Goal Title</label>
                <input
                  type="text"
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={goalForm.description}
                  onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Target Date</label>
                <input
                  type="date"
                  value={goalForm.targetDate}
                  onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Milestones
                </label>
                {goalForm.milestones.map((milestone, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={milestone.title}
                      onChange={(e) => {
                        const newMilestones = [...goalForm.milestones];
                        newMilestones[index].title = e.target.value;
                        setGoalForm({ ...goalForm, milestones: newMilestones });
                      }}
                      placeholder="Milestone title"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMilestone}
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  + Add Milestone
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Create Goal
                </button>
                <button
                  type="button"
                  onClick={() => setShowGoalForm(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-6">
        {goals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <FiTarget className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg font-medium">No goals set yet</p>
            <p className="text-gray-400 text-sm mt-2">Create your first goal to start tracking progress</p>
          </div>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="p-2 bg-primary-100 rounded-lg mr-3">
                      <FiTarget className="text-primary-600 text-xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{goal.title}</h3>
                  </div>
                  {goal.description && (
                    <p className="text-gray-600 mt-2 ml-11">{goal.description}</p>
                  )}
                  <div className="flex items-center flex-wrap gap-4 mt-3 ml-11">
                    {goal.targetDate && (
                      <div className="flex items-center text-gray-500">
                        <FiCalendar className="mr-2" />
                        <span className="text-sm">Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                      goal.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                      {goal.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  {goal.status === 'in-progress' && (
                    <button
                      onClick={() => handleUpdateGoalStatus(goal.id, 'completed')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center transition shadow-md"
                    >
                      <FiCheck className="mr-2" />
                      Complete
                    </button>
                  )}
                </div>
              </div>

              {/* Milestones */}
              {goal.milestones && goal.milestones.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Milestones</h4>
                    <span className="text-sm text-gray-600">
                      {goal.completedMilestones || 0} / {goal.totalMilestones || 0} completed
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${((goal.completedMilestones || 0) / (goal.totalMilestones || 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {goal.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className={`flex items-start p-4 rounded-lg border-2 transition ${milestone.completed === 1
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200 hover:border-primary-300'
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={milestone.completed === 1}
                          onChange={(e) => handleUpdateMilestone(milestone.id, e.target.checked)}
                          className="mt-1 mr-4 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <div className="flex-1">
                          <p className={`font-medium ${milestone.completed === 1
                            ? 'line-through text-gray-500'
                            : 'text-gray-900'
                            }`}>
                            {milestone.title}
                          </p>
                          {milestone.description && (
                            <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                          )}
                        </div>
                        {milestone.completed === 1 && (
                          <FiCheck className="text-green-600 text-xl ml-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Goals;

