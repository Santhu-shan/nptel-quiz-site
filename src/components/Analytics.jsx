import React, { useMemo } from 'react';
import './Analytics.css';

function Analytics({ history, onBack, clearHistory }) {
  
  const stats = useMemo(() => {
    if (!history || history.length === 0) return null;

    const totalQuizzes = history.length;
    const totalQuestions = history.reduce((acc, curr) => acc + curr.totalQuestions, 0);
    const totalCorrect = history.reduce((acc, curr) => acc + curr.score, 0);
    const averageScore = Math.round((totalCorrect / totalQuestions) * 100) || 0;

    // Group by Subject to find weak areas
    const subjectMap = {};
    history.forEach(entry => {
      if (!subjectMap[entry.subjectTitle]) {
        subjectMap[entry.subjectTitle] = { attempts: 0, totalScore: 0, totalQuestions: 0 };
      }
      subjectMap[entry.subjectTitle].attempts += 1;
      subjectMap[entry.subjectTitle].totalScore += entry.score;
      subjectMap[entry.subjectTitle].totalQuestions += entry.totalQuestions;
    });

    const subjectStats = Object.keys(subjectMap).map(title => {
      const s = subjectMap[title];
      return {
        title,
        attempts: s.attempts,
        avg: Math.round((s.totalScore / s.totalQuestions) * 100)
      };
    });

    // Sort by lowest average to find weak areas
    subjectStats.sort((a, b) => a.avg - b.avg);

    return { totalQuizzes, totalQuestions, averageScore, subjectStats };
  }, [history]);

  if (!stats) {
    return (
      <div className="analytics-container page-transition">
        <div className="header stagger-item">
          <h1 className="text-gradient">My Analytics</h1>
          <p className="subtitle">Track your performance over time</p>
        </div>
        <button className="btn-outline btn-sm back-btn stagger-item" onClick={onBack}>← Back to Courses</button>
        
        <div className="empty-state glass-panel stagger-item" style={{ animationDelay: '0.1s' }}>
          <div className="icon">📊</div>
          <h2>No Data Yet</h2>
          <p>Take a few quizzes to see your personalized analytics and mistake history here.</p>
          <button className="btn-primary" onClick={onBack}>Start a Quiz</button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container page-transition">
      <div className="header stagger-item">
        <h1 className="text-gradient">My Analytics</h1>
        <p className="subtitle">Your private study performance tracking</p>
      </div>

      <div className="controls-row stagger-item" style={{ animationDelay: '0.1s' }}>
        <button className="btn-outline btn-sm back-btn" onClick={onBack}>← Back to Courses</button>
        <button className="btn-outline btn-sm clear-btn" onClick={() => {
          if (window.confirm("Are you sure you want to clear all your local analytics data?")) {
            clearHistory();
          }
        }}>🗑️ Clear History</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel stagger-item" style={{ animationDelay: '0.15s' }}>
          <div className="stat-value">{stats.averageScore}%</div>
          <div className="stat-label">Average Score</div>
        </div>
        <div className="stat-card glass-panel stagger-item" style={{ animationDelay: '0.2s' }}>
          <div className="stat-value">{stats.totalQuizzes}</div>
          <div className="stat-label">Quizzes Taken</div>
        </div>
        <div className="stat-card glass-panel stagger-item" style={{ animationDelay: '0.25s' }}>
          <div className="stat-value">{stats.totalQuestions}</div>
          <div className="stat-label">Questions Answered</div>
        </div>
      </div>

      <div className="analytics-sections">
        {/* Weak Areas Section */}
        <div className="section-card glass-panel stagger-item" style={{ animationDelay: '0.3s' }}>
          <h3>Areas for Improvement</h3>
          <p className="section-desc">Based on your past quizzes, these are your weakest subjects.</p>
          
          <div className="weak-areas-list">
            {stats.subjectStats.slice(0, 3).map((sub, idx) => (
              <div key={idx} className="weak-area-item">
                <div className="weak-info">
                  <h4>{sub.title}</h4>
                  <span>{sub.attempts} attempt{sub.attempts > 1 ? 's' : ''}</span>
                </div>
                <div className={`weak-score ${sub.avg < 60 ? 'critical' : 'warning'}`}>
                  {sub.avg}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent History Section */}
        <div className="section-card glass-panel stagger-item" style={{ animationDelay: '0.35s' }}>
          <h3>Recent Quiz History</h3>
          <div className="history-list">
            {[...history].reverse().slice(0, 10).map((entry, idx) => {
              const perc = Math.round((entry.score / entry.totalQuestions) * 100);
              const date = new Date(entry.date).toLocaleDateString(undefined, {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              });

              return (
                <div key={entry.id || idx} className="history-item">
                  <div className="history-info">
                    <h4>{entry.subjectTitle}</h4>
                    <span>{date}</span>
                  </div>
                  <div className="history-score">
                    <span className="score-text">{entry.score}/{entry.totalQuestions}</span>
                    <span className={`score-badge ${perc >= 80 ? 'good' : perc >= 50 ? 'okay' : 'bad'}`}>
                      {perc}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
