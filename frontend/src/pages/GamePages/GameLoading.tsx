import { useEffect, useState } from 'react';

import LoadingLogo from "assets/images/logo_character.png";
import "assets/scss/Loding.scss";

const LoadingMessage = "게임을 찾는 중입니다";
export const GameLoading = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="GameLoadingScreen">
      <div className="RotatingElement">
        <img src={LoadingLogo} alt="a"/>
      </div>
      <div className="Timer">{seconds}s</div> {/* This is the new timer display */}
      <div className="LoadingText">
        {Array.from(LoadingMessage).map((char, index) => (
          <span key={index}>{char}</span>
        ))}
      </div>
    </div>
  );
};