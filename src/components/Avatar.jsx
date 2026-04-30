import React, { useState, useEffect } from 'react';
import './Avatar.css';

function Avatar({ status, streak, totalWrong, correctAnswer }) {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [mood, setMood] = useState('idle'); // idle, happy, sad, shocked

  useEffect(() => {
    if (status === 'idle') {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    if (status === 'correct') {
      setMood(streak > 3 ? 'shocked' : 'happy');
      
      const happyMessages = [
        "Woof! Right on the money! 🐾",
        "Good human! Have a treat! 🦴",
        "You're top dog! 🐕",
        "Such smart! Much correct! Wow! ✨",
        "*Tail wags aggressively* 🐶💨"
      ];
      
      const streakMessages = [
        `Arooo! ${streak} in a row! You're on fire! 🐺🔥`,
        `Unstoppable! Streak of ${streak}! Fetch that A+! 🎾`,
        `Best in Show! ${streak} correct! 🏆🐾`
      ];

      setMessage(streak >= 3 ? streakMessages[Math.floor(Math.random() * streakMessages.length)] : happyMessages[Math.floor(Math.random() * happyMessages.length)]);
    } 
    else if (status === 'wrong') {
      setMood('sad');
      
      const wrongMessages = [
        `Ruh-roh! The answer was actually "${correctAnswer}". 🐶`,
        `Barking up the wrong tree! It's "${correctAnswer}". 🌳`,
        `*Whines* Nope! It was "${correctAnswer}". Keep trying! 🥺`,
      ];

      const manyWrongsMessages = [
        `Did a cat answer that? It's "${correctAnswer}"! 🐈😂`,
        `You're in the doghouse now! It was "${correctAnswer}". 🛖`,
        `*Tilts head* Are you just guessing? It's "${correctAnswer}". 🐶❓`
      ];

      setMessage(totalWrong >= 3 ? manyWrongsMessages[Math.floor(Math.random() * manyWrongsMessages.length)] : wrongMessages[Math.floor(Math.random() * wrongMessages.length)]);
    }

    // Auto hide after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [status, streak, totalWrong, correctAnswer]);

  if (!isVisible) return null;

  return (
    <div className="avatar-container animate-slide-up">
      <div className="chat-bubble glass-panel">
        {message}
      </div>
      <div className={`avatar-icon mood-${mood}`}>
        🐶
      </div>
    </div>
  );
}

export default Avatar;
