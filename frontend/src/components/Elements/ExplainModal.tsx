import "assets/scss/ExplainModal.scss";
import closeIco from "assets/images/ico_close.png";

export const ExplainModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="explainmodal-bg">
      <div className="explainmodal-body">
        <div className="explainmodal-title">
          <p style={{ width: 24 }}></p>
          <p className="explain-title">게임 설명</p>
          <img src={closeIco} alt="닫기버튼" onClick={onClose} />
        </div>
        <p>안녕하세요! 저희는 1:1 실시간 웃음 참기 서비스 데구르르 입니다.</p>
        <br />
        <p>"상대방을 웃겨라"</p>
        <br />
        <ul>
          <li>
            1. 2라운드로 진행됩니다. 각 라운드별로 공격자와 수비자가 정해지며
            라운드가 전환되면 공격과 수비자가 바뀌게 됩니다.
          </li>
          <li>2. 공격턴에는 상대방을 웃게 만들면 됩니다.</li>
          <li>3. 수비턴에는 상대방의 웃음 공격을 참아야합니다. </li>
          <li>4. 수비자가 웃을 경우 라운드가 전환됩니다. </li>
          <li>
            5. 각 턴은 30초간 진행되며, 수비 측에서 30초간 웃음을 참는다면
            라운드가 전환 됩니다.
          </li>
          <li>
            6. 두 라운드 결과를 취합하여 결과가 판정됩니다.
            <ul id="explain-6">
              <li>
                A. 한쪽 플레이어만 웃은 경우 해당 플레이어를 웃게 만든 공격자가
                승리하게 됩니다.
              </li>
              <li>B. 두 플레이어 모두 웃지 않은 경우, 무승부로 처리 됩니다 </li>
              <li>
                C. 두 플레이어 모두 웃은 경우, 더 빠르게 웃은 플레이어가
                패배합니다.
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};
