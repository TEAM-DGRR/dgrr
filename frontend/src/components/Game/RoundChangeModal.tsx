import attack from "assets/images/match-attack.png";
import defense from "assets/images/match-defense.png";
import "assets/scss/RoundChangeModal.scss";
import { memo } from "react";

export const RoundChangeModal = memo(({ role }: { role: string }) => {
  return (
    <div className="roundchange-modal-background">
      <div className="roundchange-modal">
        {/* turn에 따라서 정보 다르게 보여주기 */}
        {role === "attack" ? (
          <>
            <img src={attack} alt="공격" />
            <p>상대방을 웃기세요!</p>
          </>
        ) : (
          <>
            <img src={defense} alt="방어" />
            <p>웃음을 참아보세요!</p>
          </>
        )}
      </div>
    </div>
  );
});
