import menuIco from "assets/images/ico_menu_24px.svg";
import personIco from "assets/images/ico_person_24px.svg";
import character from "assets/images/logo_character.png";
import title from "assets/images/logo_title.png";
import "assets/scss/Main.scss";
import { Button } from "components/Elements/Button/BasicButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ExplainModal } from "components/Elements/ExplainModal";

export const Main = () => {
  const navigate = useNavigate();
  const [explainsee, setExplainsee] = useState(false);

  const onClick = () => {
    // 메뉴로
    navigate("/menu");
  };

  const handleRandomMatch = () => {
    navigate("/game/loading");
  };

  // 설명 모달 보여주기
  const showModal = () => {
    setExplainsee(true);
  };

  // 설명 모달 닫기
  const closeModal = () => {
    setExplainsee(false);
  };

  return (
    <div className="MainPage">
      <div className="MainNav">
        {explainsee ? <ExplainModal onClose={closeModal} /> : null}
        <img src={menuIco} alt="메뉴 아이콘" onClick={onClick} />
        <img
          src={personIco}
          alt="프로필 아이콘"
          onClick={() => {
            navigate("/myprofile");
          }}
        />
      </div>
      <div className="MainBody">
        <div className="MainImages">
          <img src={character} alt="캐릭터" id="character" />
          <img src={title} alt="타이틀" id="title" />
        </div>

        <div className="MainBtns">
          <Button color="grey">방 만들기</Button>
          <Button onClick={showModal}>게임 설명</Button>
          <Button onClick={handleRandomMatch}>랜덤 매칭</Button>
        </div>
      </div>
    </div>
  );
};
