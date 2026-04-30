import React, { useState, useEffect } from 'react';
import './Study.css';

function Study({ subject, onExit }) {
  const [isShuffled, setIsShuffled] = useState(false);
  const [displayQuestions, setDisplayQuestions] = useState([]);

  useEffect(() => {
    if (isShuffled) {
      // Create a copy and shuffle
      const shuffled = [...subject.questions].sort(() => Math.random() - 0.5);
      setDisplayQuestions(shuffled);
    } else {
      setDisplayQuestions(subject.questions);
    }
  }, [subject, isShuffled]);

  return (
    <div className="study-container page-transition">
      <div className="study-header glass-panel">
        <div className="study-header-top">
          <h2>{subject.title} - Study Mode</h2>
          <div className="header-controls">
            <label className="toggle-container">
              <input 
                type="checkbox" 
                checked={isShuffled}
                onChange={(e) => setIsShuffled(e.target.checked)}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Shuffle Questions</span>
            </label>
            <button className="btn-outline btn-sm" onClick={onExit}>Exit Study</button>
          </div>
        </div>
        <p className="study-meta">{subject.questions.length} Questions</p>
      </div>

      <div className="study-questions">
        {displayQuestions.map((question, qIndex) => (
          <div key={question.id + '-' + qIndex} className="study-card glass-panel">
            <h3 className="question-text">
              <span className="question-number">Q{qIndex + 1}.</span> {question.text}
            </h3>
            
            <div className="study-options">
              {question.options.map((option, oIndex) => {
                const isCorrect = oIndex === question.correctAnswer;
                return (
                  <div 
                    key={oIndex} 
                    className={`study-option ${isCorrect ? 'correct' : ''}`}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + oIndex)}</span>
                    <span className="option-text">{option}</span>
                    {isCorrect && <span className="correct-badge">✓ Correct</span>}
                  </div>
                );
              })}
            </div>
            
            {question.explanation && (
              <div className="study-explanation">
                <strong>Solution:</strong> {question.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="study-footer">
        <button className="btn-primary" onClick={onExit}>Back to Subjects</button>
      </div>
    </div>
  );
}

export default Study;
