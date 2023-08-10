import React from 'react';
import "assets/scss/Loding.scss";
import LoadingLogo from "assets/images/logo_character.png";

const LoadingMessage = "게임을 찾는 중입니다...";
export const GameLoading = () => {
  return (
    <div className="GameLoadingScreen">
      <div className="RotatingElement">
        <img src={LoadingLogo} alt="a"/>
      </div>
      <div className="LoadingText">
        {Array.from(LoadingMessage).map((char, index) => (
          <span key={index}>{char}</span>
        ))}
      </div>
    </div>
  );
};
