import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizRequired, setQuizRequired] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkQuiz = async () => {
      if (!user || user.userType !== 'student') {
        if (mounted) setQuizChecked(true);
        return;
      }
      try {
        const { data } = await axios.get('/api/quiz/result/latest');
        if (mounted) {
          setQuizRequired(!data?.exists);
          setQuizChecked(true);
        }
      } catch (_) {
        if (mounted) {
          setQuizRequired(true);
          setQuizChecked(true);
        }
      }
    };
    checkQuiz();
    return () => { mounted = false; };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (user.userType === 'student') {
    if (!quizChecked) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }
    if (quizRequired && location.pathname !== '/quiz') {
      return <Navigate to="/quiz" />;
    }
  }
  return children;
};

export default PrivateRoute;

