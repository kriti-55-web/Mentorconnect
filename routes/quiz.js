import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Quiz = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { [questionId]: chosenIndex }
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.post('/api/quiz/start');
        setQuestions(data.questions || []);
      } catch (e) {
        const msg = e?.response?.data?.error || 'Failed to load quiz';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const setChoice = (qid, idx) => {
    setAnswers(prev => ({ ...prev, [qid]: idx }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = Object.entries(answers).map(([questionId, chosenIndex]) => ({ questionId: Number(questionId), chosenIndex: Number(chosenIndex) }));
      const { data } = await axios.post('/api/quiz/submit', { answers: payload });
      setResult(data);
    } catch (e) {
      const msg = e?.response?.data?.error || 'Failed to submit quiz';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow p-6 border border-red-200">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow p-8 border border-gray-100">
          <h1 className="text-3xl font-bold mb-4">Quiz Result</h1>
          <p className="text-gray-700 mb-2">Score: {result.correctCount} / {result.totalQuestions}</p>
          <p className="text-gray-700 mb-4">Percentage: {result.percentage}%</p>
          <span className="inline-block text-sm px-3 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-200">Category: {result.category}</span>
          <div className="mt-6">
            <a href="/dashboard" className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Continue to Dashboard</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow p-8 border border-gray-100">
        <h1 className="text-3xl font-bold mb-6">Skill Assessment</h1>
        <p className="text-gray-600 mb-6">Answer the questions related to the skills you provided. This helps us categorize your level.</p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={q.id} className="border border-gray-200 rounded-lg p-4">
                <p className="font-semibold mb-2">{idx + 1}. {q.question}</p>
                <p className="text-xs text-gray-500 mb-3">Skill: {q.skillTag}</p>
                <div className="space-y-2">
                  {q.choices.map((c, i) => (
                    <label key={i} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        value={i}
                        checked={Number(answers[q.id]) === i}
                        onChange={() => setChoice(q.id, i)}
                        required
                      />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <button type="submit" disabled={submitting} className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Quiz;
