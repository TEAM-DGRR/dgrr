import versus from "assets/images/match-versus.png";
import tierBronze from "assets/images/tier_bronze.png";
import tierGold from "assets/images/tier_gold.png";
import tierSilver from "assets/images/tier_silver.png";
import "assets/scss/GameResult.scss";
import { Button } from "components/Elements/Button/BasicButton";
import { PrograssBar } from "components/Elements/PrograssBar";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useGameContext } from "./GameContext";

export const GameResult = () => {
  const { gameConfig, myGameResult, disconnectStompClient } = useGameContext();
  const { myInfo, enemyInfo } = gameConfig;
  // eslint-disable-next-line
  const { firstRoundTime, secondRoundTime, gameResult, reward, afterRank } =
    myGameResult;

  const navigate = useNavigate();

  //progressBar - info
  //progressBar - DataUpdate
  const newRating = myInfo.rating;
  //rating을 기준으로 다음 등급까지 얼마나 남았는지 계산하는 로직
  let nextRating =
    newRating >= 1400 && newRating < 1600 ? 1600 : newRating < 1800 ? 1800 : 0; //다음 등급 Rating
  let percent = nextRating !== 0 ? 100 - (nextRating - newRating) / 2 : 100;
  // eslint-disable-next-line
  const progressBarStates = [0, percent]; // 초기값은 0으로 설정하거나, 원하는 값으로 설정하세요.
  const endState = 100;

  // Result페이지가 처음 렌더링 될 때 StompClient 연결을 해제
  useEffect(() => {
    disconnectStompClient();
  });
  // endState가 업데이트될 때 GSAP 애니메이션을 실행
  useEffect(() => {}, [progressBarStates]);

  return (
    <div className="GameResult">
      <div className="border">
        <div className="result">{gameResult}</div>
        <div className="tier">
          <div className="tierImage">
            <img
              src={
                newRating >= 1400 && newRating < 1600
                  ? tierBronze
                  : newRating < 1800
                  ? tierSilver
                  : tierGold
              }
              alt="티어 예시"
            />
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
              <img className="versus-image" src={versus} alt="versus" />
              <img
                className="profile-image"
                src={enemyInfo.profileImage}
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
              <Button
                width="100%"
                onClick={() => {
                  navigate("/game/loading");
                }}
              >
                한판 더?
              </Button>
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
