import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { data } from '../data';
import './Results.css';

function Results({ score, totalQuestions, wrongAnswers = [], onRestart, subject }) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const [crossRefs, setCrossRefs] = useState({});
  
  useEffect(() => {
    if (percentage >= 80) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#3b82f6', '#8b5cf6', '#10b981']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#3b82f6', '#8b5cf6', '#10b981']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [percentage]);

  // Compute Cross References
  useEffect(() => {
    if (!wrongAnswers || wrongAnswers.length === 0) return;
    
    // Find cross references for wrong answers
    const refs = {};
    
    // Flatten all questions
    const allQuestions = [];
    data.forEach(course => {
      course.years.forEach(year => {
        year.weeks.forEach(week => {
          allQuestions.push(...week.questions);
        });
      });
    });

    wrongAnswers.forEach(mistake => {
      const selectedText = mistake.question.options[mistake.selectedOptionIndex];
      
      // Search for another question where this is the correct answer
      const matchingQuestion = allQuestions.find(q => 
        q.id !== mistake.question.id && 
        q.options[q.correctAnswer] === selectedText
      );

      if (matchingQuestion) {
        refs[mistake.question.id] = matchingQuestion;
      }
    });

    setCrossRefs(refs);
  }, [wrongAnswers]);

  let feedback = '';
  if (percentage >= 90) feedback = "Outstanding Work! 🌟";
  else if (percentage >= 70) feedback = "Great Job! 👏";
  else if (percentage >= 50) feedback = "Good Effort! 👍";
  else feedback = "Keep Studying! 📚";

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="results-container page-transition">
      <div className="results-card glass-panel stagger-item" style={{ animationDelay: '0.1s' }}>
        <h2>Quiz Completed!</h2>
        <p className="subject-title">{subject.title}</p>
        
        <div className="score-ring-container stagger-item" style={{ animationDelay: '0.2s' }}>
          <svg className="score-ring" width="160" height="160">
            <circle
              className="ring-bg"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="10"
              fill="transparent"
              r={radius}
              cx="80"
              cy="80"
            />
            <circle
              className="ring-progress"
              stroke="var(--primary)"
              strokeWidth="10"
              fill="transparent"
              r={radius}
              cx="80"
              cy="80"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset
              }}
            />
          </svg>
          <div className="score-text">
            <span className="percentage">{percentage}%</span>
            <span className="fraction">{score} / {totalQuestions}</span>
          </div>
        </div>

        <h3 className="feedback-text stagger-item" style={{ animationDelay: '0.3s' }}>{feedback}</h3>
        
        <div className="results-actions stagger-item" style={{ animationDelay: '0.4s' }}>
          <button className="btn-primary btn-lg" onClick={onRestart}>
            Return to Courses
          </button>
        </div>
      </div>

      {wrongAnswers && wrongAnswers.length > 0 && (
        <div className="mistakes-review stagger-item" style={{ animationDelay: '0.5s' }}>
          <h3>Mistake Analysis</h3>
          <p className="subtitle">Review the questions you got wrong to improve your memory.</p>
          
          <div className="mistakes-list">
            {wrongAnswers.map((mistake, index) => {
              const q = mistake.question;
              const selectedText = q.options[mistake.selectedOptionIndex];
              const correctText = q.options[q.correctAnswer];
              const crossRef = crossRefs[q.id];

              return (
                <div key={index} className="mistake-card glass-panel">
                  <h4>{q.text}</h4>
                  
                  <div className="mistake-options">
                    <div className="option wrong">
                      <span className="label">You Selected:</span>
                      <span className="text">{selectedText}</span>
                    </div>
                    
                    {crossRef && (
                      <div className="cross-reference">
                        <span className="icon">💡</span>
                        <p><strong>Heads Up!</strong> This option is actually the correct answer for another question:<br/>
                        <em>"{crossRef.text}"</em></p>
                      </div>
                    )}

                    <div className="option correct">
                      <span className="label">Correct Answer:</span>
                      <span className="text">{correctText}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Results;
