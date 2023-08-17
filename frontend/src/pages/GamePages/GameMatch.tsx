// GameMatch.tsx

import MatchingSoundPath from "assets/audio/game-matching.mp3";
import attack from "assets/images/match-attack.png";
import defense from "assets/images/match-defense.png";
import "assets/scss/Match.scss";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "./GameContext";

export const GameMatch = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);

  // Stomp
  const { gameConfig } = useGameContext();
  const { myInfo, enemyInfo } = gameConfig;

  const vsPersonProfile1 = enemyInfo.profileImage;
  const USER1_NICKNAME = enemyInfo.nickname;
  const USER1_INTRO = enemyInfo.description;

  const USER2_TURN = gameConfig.turn === "first" ? attack : defense;
  const USER2_TURN_MESSAGE =
    USER2_TURN === attack
      ? "상대방을 먼저 웃기세요!"
      : "웃음을 참아야만 합니다!";

  const vsPersonProfile2 = myInfo.profileImage;
  const USER2_NICKNAME = myInfo.nickname;
  const USER2_INTRO = myInfo.description;
  const MatchingSound = useRef(new Audio(MatchingSoundPath)).current;

  useEffect(() => {
    MatchingSound.play();
    // console.log("GameMatch Page로 넘어왔습니다.");

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (seconds === 5) {
      MatchingSound.pause();
      MatchingSound.currentTime = 0;
      navigate("/game/play");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds, navigate]);

  return (
    <div className="MatchPage">
      <div className="MatchedPersonTurn">
        <img src={USER2_TURN} alt="USER2_TURN"></img>
        <p>{USER2_TURN_MESSAGE}</p>
      </div>
      <div className="VersusImage"></div>

      <div className="MatchedPerson1">
        <div className="MatchedPersonBackground1"></div>
        <div className="MatchedPersonProfile">
          <img src={vsPersonProfile1} alt="vsPersonProfile1" />
        </div>
        <div className="MatchedPersonNickName">
          <p>{USER1_NICKNAME}</p>
        </div>
        <div className="MatchedPersonIntro">
          <p>{USER1_INTRO}</p>
        </div>
      </div>

      <div className="MatchedPerson2">
        <div className="MatchedPersonBackground2"></div>
        <div className="MatchedPersonProfile">
          <img src={vsPersonProfile2} alt="vsPersonProfile2" />
        </div>
        {/* <div className="MatchedPersonTurn">
          <img src={USER2_TURN} alt='USER2_TURN'></img>
        </div> */}
        <div className="MatchedPersonNickName">
          <p>{USER2_NICKNAME}</p>
        </div>
        <div className="MatchedPersonIntro">
          <p>{USER2_INTRO}</p>
        </div>
      </div>
    </div>
  );
};
