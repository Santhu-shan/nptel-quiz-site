import React, { useState, useEffect } from 'react';
import CourseSelection from './components/CourseSelection';
import Quiz from './components/Quiz';
import Results from './components/Results';
import Study from './components/Study';
import Analytics from './components/Analytics';
import './App.css'; 

function App() {
  const [currentView, setCurrentView] = useState('selection'); // 'selection', 'quiz', 'results', 'study', 'analytics'
  const [selectedSubject, setSelectedSubject] = useState(null);
  
  // Quiz completion data
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);

  // Analytics persistence
  const [quizHistory, setQuizHistory] = useState([]);

  useEffect(() => {
    // Load history on mount
    const saved = localStorage.getItem('nptel_quiz_history');
    if (saved) {
      try {
        setQuizHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveHistory = (newHistory) => {
    setQuizHistory(newHistory);
    localStorage.setItem('nptel_quiz_history', JSON.stringify(newHistory));
  };

  const handleSelectSubject = (subject, mode) => {
    setSelectedSubject(subject);
    setCurrentView(mode); 
  };

  const handleQuizComplete = (finalScore, wrongList) => {
    setScore(finalScore);
    setWrongAnswers(wrongList);
    
    // Save to history
    const historyEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      subjectId: selectedSubject.id,
      subjectTitle: selectedSubject.title,
      score: finalScore,
      totalQuestions: selectedSubject.questions.length,
      wrongAnswers: wrongList
    };
    saveHistory([...quizHistory, historyEntry]);

    setCurrentView('results');
  };

  const handleRestart = () => {
    setCurrentView('selection');
    setSelectedSubject(null);
    setScore(0);
    setWrongAnswers([]);
  };

  const handleOpenAnalytics = () => {
    setCurrentView('analytics');
  };

  return (
    <>
      <div className="macos-bg light-mesh"></div>
      <div className="container">
        {currentView === 'selection' && (
          <CourseSelection 
            onSelectSubject={handleSelectSubject} 
            onOpenAnalytics={handleOpenAnalytics}
          />
        )}
        
        {currentView === 'quiz' && selectedSubject && (
          <Quiz 
            subject={selectedSubject} 
            onComplete={handleQuizComplete} 
            onExit={handleRestart}
          />
        )}

        {currentView === 'study' && selectedSubject && (
          <Study 
            subject={selectedSubject} 
            onExit={handleRestart}
          />
        )}
        
        {currentView === 'results' && selectedSubject && (
          <Results 
            score={score} 
            totalQuestions={selectedSubject.questions.length} 
            wrongAnswers={wrongAnswers}
            onRestart={handleRestart}
            subject={selectedSubject}
          />
        )}

        {currentView === 'analytics' && (
          <Analytics 
            history={quizHistory}
            onBack={handleRestart}
            clearHistory={() => saveHistory([])}
          />
        )}
      </div>
    </>
  );
}

export default App;
