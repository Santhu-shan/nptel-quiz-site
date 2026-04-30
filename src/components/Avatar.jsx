import React, { useState, useEffect, useCallback } from 'react';
import './Avatar.css';

const DICTIONARY = {
  en: {
    idle: [
      "Ready to study? Let's go! 🐾",
      "I'm bored, pick an answer! 🐕",
      "Time is ticking... tick tock! ⏱️",
      "Still thinking? You got this! ✨",
      "Don't leave me hanging! 🦴"
    ],
    walking: [
      "Time's up! Don't you know the answer? 🚶‍♂️🐶",
      "Still waiting... I might take a nap! 😴",
      "Come on, even a cat could answer this! 🐈",
      "Is the question too hard? 🧠❓"
    ],
    correct: [
      "Spot on! 🎯",
      "You're top dog! 🐕",
      "Good human! Have a treat! 🦴",
      "Such smart! Much correct! Wow! ✨",
      "Genius alert! 🚀"
    ],
    streak: [
      "Unstoppable! You're on fire! 🔥",
      "Arooo! A true scholar! 🐺🏆",
      "Is this a speedrun? Amazing! ⚡"
    ],
    wrong: [
      "Ruh-roh! Not quite. 🐶",
      "Barking up the wrong tree! 🌳",
      "Ouch, that hurt! 😅",
      "Try again, I believe in you! 🐾"
    ],
    manyWrongs: [
      "Are you just guessing now? 😂",
      "Wake up! Focus! ☕",
      "Maybe take a break? 📚",
      "In the doghouse! 🛖"
    ],
    analytics_good: [
      "You're a superstar! Keep it up! 🌟",
      "Great performance! You're ready for the exam! 🎓"
    ],
    analytics_bad: [
      "We need to work harder on some areas! 📉",
      "Don't worry, every mistake is a lesson! 📖",
      "Let's focus on your weak spots! 🦴"
    ]
  },
  ta: {
    idle: [
      "Ready-ah? Aarambikalaama? 🐾",
      "Seekram oru option-a pick pannu! 🐕",
      "Time aachuruchu, yosi yosi! ⏱️",
      "Yenna boss, ivlo neram? ✨",
      "Bored-a iruku, seekram! 🦴"
    ],
    walking: [
      "Time hachu, answer theriyala ya? 🚶‍♂️🐶",
      "Innum yosikriya? Thoongiruva pola! 😴",
      "Ithu kuda theriyala na yeppadi? 🐈",
      "Enna logic ithu? 🧠❓"
    ],
    correct: [
      "Paravala hey, nala padichu erukan pola ✨",
      "Sema! Correct-u! 🎯",
      "Kalakura po! 🐕",
      "Vera level! ✨",
      "Super-u! 🚀"
    ],
    streak: [
      "Pinnran la! Unstoppable! 🔥",
      "Arooo! Nee thaan king-u! 🐺🏆",
      "Semma speed-u! ⚡"
    ],
    wrong: [
      "Ethu kuda theriyatha? 😅",
      "Ayyayyo! Thappaache! 🐶",
      "Enna boss ipdi panreengale! 📉",
      "Oru nimisham yosi! 🐾"
    ],
    manyWrongs: [
      "Olunga padichitu vanthu eluthu pooo! 🛖",
      "Ayyayyo! Mudila... 🐈😂",
      "Konjam focus pannunga boss! 📚",
      "Sirippu thaan varuthu! 😂"
    ],
    analytics_good: [
      "Pinnita! Nee thaan topper-u! 🌟",
      "Nalla prepare pannirka, exam-la kalakiruva! 🎓"
    ],
    analytics_bad: [
      "Konjam weak-a iruka pola, padikanum! 📉",
      "Paravala, innum nalla try pannu! 📖",
      "Weak areas-a focus pannunga boss! 🦴"
    ]
  }
};

function Avatar({ status, streak, totalWrong, correctAnswer, timeOnQuestion, type = 'quiz', stats = null }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('dog_lang') || 'en');
  const [message, setMessage] = useState('');
  const [mood, setMood] = useState('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAutoSpeak, setIsAutoSpeak] = useState(() => localStorage.getItem('dog_auto_speak') === 'true');
  const [isVisible, setIsVisible] = useState(true);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ta' : 'en';
    setLanguage(newLang);
    localStorage.setItem('dog_lang', newLang);
  };

  const toggleAutoSpeak = () => {
    const newVal = !isAutoSpeak;
    setIsAutoSpeak(newVal);
    localStorage.setItem('dog_auto_speak', newVal);
    if (!newVal) window.speechSynthesis.cancel();
  };

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Tamil mix doesn't have a direct synthesizer in most browsers, using hi-IN or similar
    utterance.lang = language === 'ta' ? 'hi-IN' : 'en-US'; 
    utterance.rate = 0.9; // Slightly slower for better clarity
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [language]);

  // Auto-speak whenever message changes
  useEffect(() => {
    if (isAutoSpeak && message) {
      speak(message);
    }
  }, [message, isAutoSpeak, speak]);

  useEffect(() => {
    const langDict = DICTIONARY[language];
    let newMessage = '';

    setIsVisible(true);

    if (type === 'analytics' && stats) {
      const moodType = stats.averageScore > 70 ? 'analytics_good' : 'analytics_bad';
      setMood(stats.averageScore > 70 ? 'happy' : 'sad');
      const messages = langDict[moodType];
      newMessage = messages[Math.floor(Math.random() * messages.length)];
    } else {
      if (status === 'correct') {
        setMood(streak > 2 ? 'shocked' : 'happy');
        const messages = streak >= 2 ? langDict.streak : langDict.correct;
        newMessage = messages[Math.floor(Math.random() * messages.length)];
      } else if (status === 'wrong') {
        setMood('sad');
        const messages = totalWrong >= 2 ? langDict.manyWrongs : langDict.wrong;
        let msg = messages[Math.floor(Math.random() * messages.length)];
        if (correctAnswer) msg += ` (${language === 'ta' ? 'Sariyaana pathil' : 'Correct answer'}: ${correctAnswer})`;
        newMessage = msg;
      } else if (status === 'idle') {
        if (timeOnQuestion > 15) {
          setMood('walking');
          const messages = langDict.walking;
          newMessage = messages[Math.floor(Math.random() * messages.length)];
        } else if (timeOnQuestion === 0) {
          setMood('idle');
          const messages = langDict.idle;
          newMessage = messages[Math.floor(Math.random() * messages.length)];
        } else {
          // Keep current message but allow visibility to stay
          return;
        }
      }
    }

    setMessage(newMessage);

    // Auto hide after 5 seconds
    const timer = setTimeout(() => {
      if (status !== 'idle' || timeOnQuestion === 0) {
        setIsVisible(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [status, streak, totalWrong, correctAnswer, timeOnQuestion, language, type, stats]);

  if (!isVisible && status === 'idle' && timeOnQuestion > 0 && timeOnQuestion < 15) return null;

  return (
    <div className="avatar-top-container animate-fade-in">
      <div className={`avatar-wrapper mood-${mood}`}>
        <div className="avatar-clickable" onClick={toggleLanguage} title="Tap to change language">
          <div className="avatar-icon">🐶</div>
          <span className="lang-indicator">{language.toUpperCase()}</span>
        </div>
        <div className="chat-bubble-top glass-panel">
          <div className="chat-content">{message}</div>
          <button 
            className={`speaker-btn ${isAutoSpeak ? 'active' : ''} ${isSpeaking ? 'speaking' : ''}`} 
            onClick={toggleAutoSpeak}
            title={isAutoSpeak ? "Turn off Auto-Speak" : "Turn on Auto-Speak"}
          >
            {isAutoSpeak ? '🔊' : '🔈'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Avatar;
