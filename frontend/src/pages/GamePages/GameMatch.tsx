import "assets/scss/Match.scss";

import vsPersonProfile1 from "assets/images/match-person1.png";
import vsPersonProfile2 from "assets/images/match-person2.png";

const USER1_NICKNAME = "나 이수연인데";
const USER1_INTRO = "대표적인 양서류 중 하나. 고어로는 '머구리'라 했으며[2], 사투리로 '개구락지'라고도 한다.";
const USER2_NICKNAME = "개구락지";
const USER2_INTRO = "비개구리처럼 알에서 태어날 때 즈음에 이미 개구리인 종류도 존재한다.";

export const GameMatch = () => {
  return (
    <>
    <link href="https://fonts.googleapis.com/css2?family=Overpass:wght@300;400;700&display=swap" rel="stylesheet"></link>
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
    </>
  );
};
