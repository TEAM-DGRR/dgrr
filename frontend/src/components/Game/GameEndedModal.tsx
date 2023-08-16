import "assets/scss/GameEndedModal.scss";
import { memo } from "react";

export const GameEndedModal = memo(
  ({ role, message }: { role: string; message: string }) => {
    return (
      <div className="gameended-modal-background">
        <div className="gameended-modal">
          <p>{message}</p>
          <p>게임을 종료합니다</p>
        </div>
      </div>
    );
  }
);
