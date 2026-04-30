import React, { useState, useEffect, useCallback } from 'react';
import Avatar from './Avatar';
import './Quiz.css';

function Quiz({ subject, onComplete, onExit }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(subject.questions.length * 60);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [questions, setQuestions] = useState([...subject.questions]);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  
  // Gamification & Avatar State
  const [streak, setStreak] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);
  const [avatarStatus, setAvatarStatus] = useState('idle');
  const [flashStatus, setFlashStatus] = useState(''); // 'success', 'error', or ''

  // Handle Shuffle
  useEffect(() => {
    if (isShuffled) {
      setQuestions([...subject.questions].sort(() => Math.random() - 0.5));
    } else {
      setQuestions([...subject.questions]);
    }
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setWrongAnswers([]);
    setTimeLeft(subject.questions.length * 60);
    setIsAnswered(false);
    setStreak(0);
    setTotalWrong(0);
    setAvatarStatus('idle');
  }, [isShuffled, subject]);

  const question = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / questions.length) * 100;

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      handleComplete();
      return;
    }
    let timer;
    if (!isAnswered) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, isAnswered]);

  const handleComplete = useCallback(() => {
    onComplete(score, wrongAnswers);
  }, [onComplete, score, wrongAnswers]);

  const handleOptionSelect = useCallback((index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === question.correctAnswer) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      setAvatarStatus('correct');
      setFlashStatus('flash-success');
    } else {
      setStreak(0);
      setTotalWrong(prev => prev + 1);
      setAvatarStatus('wrong');
      setFlashStatus('flash-error');
      setWrongAnswers(prev => [...prev, {
        question: question,
        selectedOptionIndex: index
      }]);
    }

    // Reset flash after animation
    setTimeout(() => setFlashStatus(''), 800);
  }, [isAnswered, question]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setAvatarStatus('idle'); // Reset avatar for next question
    } else {
      handleComplete();
    }
  }, [currentQuestionIndex, questions.length, handleComplete]);

  // Keyboard Shortcuts for Speed Studying
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent shortcut interference if typing in an input (though we have none)
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (!isAnswered) {
        // Numbers 1-4
        if (e.key === '1') handleOptionSelect(0);
        if (e.key === '2') handleOptionSelect(1);
        if (e.key === '3') handleOptionSelect(2);
        if (e.key === '4') handleOptionSelect(3);

        // Letters a, b, c, d
        if (e.key.toLowerCase() === 'a') handleOptionSelect(0);
        if (e.key.toLowerCase() === 'b') handleOptionSelect(1);
        if (e.key.toLowerCase() === 'c') handleOptionSelect(2);
        if (e.key.toLowerCase() === 'd') handleOptionSelect(3);
      } else {
        // Space or Enter to go to next
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault(); // Prevent scrolling on space
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, handleOptionSelect, handleNext]);


  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!question) return null;

  return (
    <div className={`quiz-container page-transition ${flashStatus}`}>
      <div className="quiz-header-wrapper glass-panel">
        <div className="quiz-header-top">
          <h2>{subject.title}</h2>
          <div className="header-controls">
            <label className="toggle-container">
              <input 
                type="checkbox" 
                checked={isShuffled}
                onChange={(e) => setIsShuffled(e.target.checked)}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Shuffle</span>
            </label>
            <div className="timer">
              <span className="timer-icon">⏱️</span>
              <span className={timeLeft < 60 ? 'text-error' : ''}>{formatTime(timeLeft)}</span>
            </div>
            <button className="btn-outline btn-sm mobile-hide" onClick={onExit}>Exit</button>
          </div>
        </div>
        
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="quiz-meta">
          <span>Q {currentQuestionIndex + 1} / {questions.length}</span>
          <span className="score-badge">Score: {score}</span>
          <button className="btn-outline btn-sm mobile-show" onClick={onExit} style={{display: 'none'}}>Exit</button>
        </div>
      </div>

      <div className="question-card glass-panel" key={currentQuestionIndex}>
        <h3 className="question-text">{question.text}</h3>
        
        <div className="options-grid">
          {question.options.map((option, index) => {
            let optionClass = 'option-btn stagger-item';
            
            if (isAnswered) {
              if (index === question.correctAnswer) {
                optionClass += ' correct';
              } else if (index === selectedOption) {
                optionClass += ' wrong';
              } else {
                optionClass += ' disabled';
              }
            } else if (selectedOption === index) {
              optionClass += ' selected';
            }

            return (
              <button
                key={index}
                className={optionClass}
                style={{ animationDelay: `${0.1 + (index * 0.05)}s` }}
                onClick={() => handleOptionSelect(index)}
                disabled={isAnswered}
              >
                <div className="option-content">
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                </div>
                
                {isAnswered && index === question.correctAnswer && (
                  <span className="status-icon success-pop">✓</span>
                )}
                {isAnswered && index === selectedOption && index !== question.correctAnswer && (
                  <span className="status-icon error-pop">✗</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="quiz-footer stagger-item" style={{ animationDelay: '0.4s' }}>
        <div className="shortcut-hint">
          {isAnswered ? 'Press Space to continue' : 'Press 1-4 or A-D to select'}
        </div>
        <button 
          className="btn-primary next-btn" 
          onClick={handleNext}
          disabled={!isAnswered}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
        </button>
      </div>

      <Avatar 
        status={avatarStatus} 
        streak={streak} 
        totalWrong={totalWrong} 
        correctAnswer={question.options[question.correctAnswer]} 
      />
    </div>
  );
}

export default Quiz;
