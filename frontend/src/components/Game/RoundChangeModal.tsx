import attack from "assets/images/match-attack.png";
import defense from "assets/images/match-defense.png";
import "assets/scss/RoundChangeModal.scss";
import { memo } from "react";

export const RoundChangeModal = memo(
  ({ role, result }: { role: string; result: string }) => {
    return (
      <div className="roundchange-modal-background">
        <div className="roundchange-modal">
          {/* turn에 따라서 정보 다르게 보여주기 */}
          {role === "attack" ? (
            <>
              <img src={attack} alt="공격" />
              {result === "HOLD_BACK" ? (
                <p>웃음을 참았어요!</p>
              ) : (
                <p>웃음을 참지 못했어요</p>
              )}
              <p>상대방을 웃기세요!</p>
            </>
          ) : (
            <>
              <img src={defense} alt="방어" />
              {result === "HOLD_BACK" ? (
                <p>상대가 웃지 않았어요</p>
              ) : (
                <p>상대가 웃었어요!</p>
              )}
              <p>웃음을 참아보세요!</p>
            </>
          )}
        </div>
      </div>
    );
  }
);
