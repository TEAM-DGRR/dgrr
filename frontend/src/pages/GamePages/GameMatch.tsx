import "assets/scss/Match.scss";

import vsPersonIco1 from "assets/images/ico_vs_person1.svg";
import vsPersonIco2 from "assets/images/ico_vs_person2.svg";

// 이미지는 받아올 것
import vsPersonProfile1 from "assets/images/match-pserson1.png";
import vsPersonProfile2 from "assets/images/match-pserson2.png";

const USER1_NICKNAME = "나 이수연인데";
const USER1_INTRO = "대표적인 양서류 중 하나. 고어로는 '머구리'라 했으며[2], 사투리로 '개구락지'라고도 한다.";

const USER2_NICKNAME = "개구락지";
const USER2_INTRO = "비개구리처럼 알에서 태어날 때 즈음에 이미 개구리인 종류도 존재한다.";


export const GameMatch = () => {

  return (
    <>
      <div className="MatchPage">
        {/* user1 Start */}
        <div className="MatchedPerson1">
          <img src={vsPersonIco1} alt="vsPersonIco1" />

          <div className="MatchedPersonProfile">
            <img src={vsPersonProfile1} alt='vsPersonProfile1'/>
          </div>

          <div className="MatchedPersonNickName">
            <text>{USER1_NICKNAME}</text> 
          </div>

          <div className="MatchedPersonIntro">
            <text>{USER1_INTRO}</text> 
          </div>
          
        </div>
        {/* user1 End */}

        {/* user2 Start */}
        <div className="MatchedPerson2">
          <img src={vsPersonIco2} alt="vsPersonIco2" />
          <div className="MatchedPersonProfile">
            <img src={vsPersonProfile2} alt='vsPersonProfile2'/>
          </div>

          <div className="MatchedPersonNickName">
            <text>{USER2_NICKNAME}</text> 
          </div>

          <div className="MatchedPersonIntro">
            <text>{USER2_INTRO}</text> 
          </div>

        </div>
        {/* user2 End */}
      </div>
    </>
  );
};
