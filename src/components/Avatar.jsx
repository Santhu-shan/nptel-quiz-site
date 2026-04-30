import React, { useState, useEffect } from 'react';
import './Avatar.css';

function Avatar({ status, streak, totalWrong, correctAnswer, timeOnQuestion }) {
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState('Hey! Ready to study? 🐶');
  const [mood, setMood] = useState('idle'); // idle, happy, sad, shocked, walking

  useEffect(() => {
    // Handling status changes (correct/wrong)
    if (status === 'correct') {
      setMood(streak > 2 ? 'shocked' : 'happy');
      
      const happyMessages = [
        "paravala hey, nala padichu erukan pola ✨",
        "Woof! Right on the money! 🐾",
        "Good human! Have a treat! 🦴",
        "You're top dog! 🐕"
      ];
      
      const streakMessages = [
        "pinnran la! Unstoppable! 🔥",
        `Arooo! ${streak} in a row! 🏆🐾`,
        "Sema! Keep going! 🚀"
      ];

      setMessage(streak >= 2 ? streakMessages[Math.floor(Math.random() * streakMessages.length)] : happyMessages[Math.floor(Math.random() * happyMessages.length)]);
      
      const timer = setTimeout(() => setMood('idle'), 3000);
      return () => clearTimeout(timer);
    } 
    else if (status === 'wrong') {
      setMood('sad');
      
      const wrongMessages = [
        "ethu kuda theriyatha? 😅",
        `Ruh-roh! It was actually "${correctAnswer}". 🐶`,
        "Enna boss ipdi panreengale! 📉"
      ];

      const manyWrongsMessages = [
        "olunga padichitu vanthu eluthu pooo! 🛖",
        "Ayyayyo! Mudila... 🐈😂",
        "Konjam focus pannunga! 📚"
      ];

      setMessage(totalWrong >= 2 ? manyWrongsMessages[Math.floor(Math.random() * manyWrongsMessages.length)] : wrongMessages[Math.floor(Math.random() * wrongMessages.length)]);
      
      const timer = setTimeout(() => setMood('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [status, streak, totalWrong, correctAnswer]);

  // Handle Idle/Walking logic
  useEffect(() => {
    if (status === 'idle') {
      if (timeOnQuestion > 15) {
        setMood('walking');
        setMessage("time hachu, answer theriyala ya? 🚶‍♂️🐶");
      } else if (timeOnQuestion > 30) {
        setMessage("I'm waiting... still waiting... 😴");
      } else if (timeOnQuestion === 0) {
        setMood('idle');
        setMessage("Next question, let's go! 🐾");
      }
    }
  }, [timeOnQuestion, status]);

  return (
    <div className="avatar-top-container animate-fade-in">
      <div className={`avatar-wrapper mood-${mood}`}>
        <div className="avatar-icon">🐶</div>
        <div className="chat-bubble-top glass-panel">
          {message}
        </div>
      </div>
    </div>
  );
}

export default Avatar;
