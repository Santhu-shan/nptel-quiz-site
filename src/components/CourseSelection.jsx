import React, { useState } from 'react';
import { data } from '../data';
import './CourseSelection.css';

function CourseSelection({ onSelectSubject, onOpenAnalytics }) {
  const [viewLevel, setViewLevel] = useState('courses'); 
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setViewLevel('years');
  };

  const handleSelectYear = (year) => {
    setSelectedYear(year);
    setViewLevel('weeks');
  };

  const handleBack = () => {
    if (viewLevel === 'weeks') setViewLevel('years');
    else if (viewLevel === 'years') setViewLevel('courses');
  };

  const handleFullTest = (mode) => {
    const allQuestions = selectedYear.weeks.reduce((acc, week) => {
      return acc.concat(week.questions);
    }, []);

    const fullTestSubject = {
      id: `${selectedYear.id}-full`,
      title: `${selectedYear.title} Full Test`,
      description: `Comprehensive test for all weeks in ${selectedYear.title}`,
      questions: allQuestions
    };

    onSelectSubject(fullTestSubject, mode);
  };

  return (
    <div className="course-selection page-transition">
      <div className="header stagger-item" style={{ animationDelay: '0.1s' }}>
        <h1 className="text-gradient">NPTEL Interactive Quiz</h1>
        <p className="subtitle">
          {viewLevel === 'courses' && 'Select a course to begin'}
          {viewLevel === 'years' && `Select a year for ${selectedCourse?.title}`}
          {viewLevel === 'weeks' && `Select an assignment or full test for ${selectedYear?.title}`}
        </p>
      </div>

      <div className="controls-row stagger-item" style={{ animationDelay: '0.15s' }}>
        {viewLevel !== 'courses' ? (
          <button className="btn-outline btn-sm back-btn" onClick={handleBack}>
            ← Back
          </button>
        ) : (
          <div></div> // Spacer
        )}
        <button className="btn-primary btn-sm analytics-btn" onClick={onOpenAnalytics}>
          📊 My Analytics
        </button>
      </div>

      {/* Level 1: Courses */}
      {viewLevel === 'courses' && (
        <div className="subjects-grid">
          {data.map((course, index) => (
            <div 
              key={course.id} 
              className="subject-card glass-panel stagger-item" 
              style={{ animationDelay: `${0.2 + (index * 0.05)}s` }}
              onClick={() => handleSelectCourse(course)}
            >
              <div className="subject-icon">{course.icon}</div>
              <div className="subject-content">
                <h2>{course.title}</h2>
                <p>{course.description}</p>
              </div>
              <div className="subject-footer">
                <span className="question-count">{course.years.length} Sessions Available</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Level 2: Years */}
      {viewLevel === 'years' && selectedCourse && (
        <div className="subjects-grid">
          {selectedCourse.years.map((year, index) => (
            <div 
              key={year.id} 
              className="subject-card glass-panel stagger-item" 
              style={{ animationDelay: `${0.2 + (index * 0.05)}s` }}
              onClick={() => handleSelectYear(year)}
            >
              <div className="subject-icon">📅</div>
              <div className="subject-content">
                <h2>{year.title}</h2>
                <p>{year.description}</p>
              </div>
              <div className="subject-footer">
                <span className="question-count">{year.weeks.length} Weeks Available</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Level 3: Weeks & Full Test */}
      {viewLevel === 'weeks' && selectedYear && (
        <div className="subjects-grid">
          
          <div className="subject-card glass-panel highlight-card stagger-item" style={{ animationDelay: '0.2s' }}>
            <div className="subject-icon">🏆</div>
            <div className="subject-content">
              <h2>Full Test</h2>
              <p>Test your knowledge across all assignments in {selectedYear.title}</p>
            </div>
            <div className="subject-footer">
              <span className="question-count">
                {selectedYear.weeks.reduce((acc, w) => acc + w.questions.length, 0)} Questions
              </span>
              <div className="action-buttons">
                <button className="btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); handleFullTest('study'); }}>Study</button>
                <button className="btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); handleFullTest('quiz'); }}>Quiz</button>
              </div>
            </div>
          </div>

          {selectedYear.weeks.map((week, index) => (
            <div 
              key={week.id} 
              className="subject-card glass-panel stagger-item" 
              style={{ animationDelay: `${0.25 + (index * 0.05)}s` }}
            >
              <div className="subject-icon">📄</div>
              <div className="subject-content">
                <h2>{week.title}</h2>
                <p>{week.description}</p>
              </div>
              <div className="subject-footer">
                <span className="question-count">{week.questions.length} Questions</span>
                <div className="action-buttons">
                  <button className="btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); onSelectSubject(week, 'study'); }}>Study</button>
                  <button className="btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); onSelectSubject(week, 'quiz'); }}>Quiz</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseSelection;
