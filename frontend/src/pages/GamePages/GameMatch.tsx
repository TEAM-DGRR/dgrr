// GameMatch.tsx

import "assets/scss/Match.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "./GameContext";

import vsPersonProfile1 from "assets/images/match-person1.png";
import vsPersonProfile2 from "assets/images/match-person2.png";


// const USER1_NICKNAME = "나 이수연인데";
// const USER1_INTRO = "대표적인 양서류 중 하나. 고어로는 '머구리'라 했으며[2], 사투리로 '개구락지'라고도 한다.";
// const USER2_NICKNAME = "개구락지";
// const USER2_INTRO = "비개구리처럼 알에서 태어날 때 즈음에 이미 개구리인 종류도 존재한다.";

export const GameMatch = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);

  // Stomp
  const { stompClient, isStompConnected, gameConfig } = useGameContext();
  const { gameSessionId, openViduToken, startTime, myInfo, enemyInfo } = gameConfig;
  
  
  // const vsPersonProfile1 = myInfo.profileImage;
  const USER1_NICKNAME = myInfo.nickname;
  const USER1_INTRO = myInfo.description;

  // const vsPersonProfile2 = enemyInfo.profileImage;
  const USER2_NICKNAME = enemyInfo.nickname;
  const USER2_INTRO = enemyInfo.description;

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    console.log("GameMatch에서 찍히는 useGameContext : ", useGameContext);
    console.log("GameMatch에서 찍히는 isStompConnected : ", isStompConnected);

    if (seconds === 5) {
      navigate("/game/play");
    }

    // Cleanup on unmount
    return () => clearInterval(interval);

  }, [seconds, gameConfig, navigate]);

  return (
    <div className="MatchPage">
      {/* Adding the VersusImage in the center of MatchPage */}
      <div className="VersusImage"></div>

      <div className="MatchedPerson1">
        <div className="MatchedPersonBackground1"></div>
        <div className="MatchedPersonProfile">
          <img src={vsPersonProfile1} alt='vsPersonProfile1'/>
        </div>
        <div className="MatchedPersonNickName">
          {USER1_NICKNAME}
        </div>
        <div className="MatchedPersonIntro">
          {USER1_INTRO}
        </div>
      </div>
      
      <div className="MatchedPerson2">
        <div className="MatchedPersonBackground2"></div>
        <div className="MatchedPersonProfile">
          <img src={vsPersonProfile2} alt='vsPersonProfile2'/>
        </div>
        <div className="MatchedPersonNickName">
          {USER2_NICKNAME}
        </div>
        <div className="MatchedPersonIntro">
          {USER2_INTRO}
        </div>
      </div>
    </div>
  );
};
