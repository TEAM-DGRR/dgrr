import profileImg from "assets/images/peeps-avatar.png";
import tierGold from "assets/images/tier_gold.png";
import "assets/scss/GameResult.scss";
import { Button } from "components/Elements/Button/BasicButton";
import { PrograssBar } from "components/Elements/PrograssBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useGameContext } from "./GameContext";

export const GameResult = () => {
  const { gameConfig, myGameResult } = useGameContext();
  const { myInfo, enemyInfo } = gameConfig;
  const { firstRoundTime, secondRoundTime, gameResult, reward, afterRank } =
    myGameResult;

  const navigate = useNavigate();

  //progressBar - info
  const [progressBarStates, setProgressBarStates] = useState([0, 100]); // 초기값은 0으로 설정하거나, 원하는 값으로 설정하세요.
  const endState = 100;

  // endState가 업데이트될 때 GSAP 애니메이션을 실행
  useEffect(() => {}, [progressBarStates]);

  return (
    <div className="GameResult">
      <div className="border">
        <div className="result">승리</div>
        <div className="tier">
          <span>내 티어</span>
          <div className="tierImage">
            <img src={tierGold} alt="티어 예시" />
          </div>
          <div>
            <div className="container">
              <PrograssBar
                tier={
                  myInfo.rating >= 1400 && myInfo.rating < 1600
                    ? "bronze"
                    : myInfo.rating < 1800
                    ? "silver"
                    : "gold"
                }
                rating={myInfo.rating}
                endState={endState}
                progressBarStates={progressBarStates}
              />
            </div>
          </div>
        </div>

        <div className="battle-bottom">
          <div className="battle-result">
            <div className="result-left">
              <img
                className="profile-image"
                src={profileImg}
                alt="프로필 이미지"
              />
              <div className="profile-info">
                <span className="nickname">{enemyInfo.nickname}</span>
                <span className="description">{enemyInfo.description}</span>
              </div>
            </div>
            <div className="result-right">
              <Button width="100%">재도전?</Button>
            </div>
          </div>

          <div className="result-button">
            <div className="result-button-width">
              <Button width="100%">한판 더?</Button>
            </div>
            <div className="result-button-width">
              <Button
                width="100%"
                onClick={() => {
                  navigate("/main");
                }}
              >
                메인으로
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
