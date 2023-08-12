import menuIco from "assets/images/ico_menu_24px.svg";
import personIco from "assets/images/ico_person_24px.svg";
import character from "assets/images/logo_character.png";
import title from "assets/images/logo_title.png";
import "assets/scss/Main.scss";
import { Button } from "components/Elements/Button/BasicButton";
import { useNavigate } from "react-router-dom";

export const Main = () => {
  const navigate = useNavigate();
  
  const onClick = () => {
    // 메뉴로
    navigate("/menu");
  }
  
  return (
    <div className="MainPage">
      <div className="MainNav">
        <img src={menuIco} alt="메뉴 아이콘"
        onClick={onClick} />
        <img
          src={personIco}
          alt="프로필 아이콘"
          onClick={() => {
            navigate("/profile");
          }}
        />
      </div>
      <div className="MainBody">
        <div className="MainImages">
          <img src={character} alt="캐릭터" id="character" />
          <img src={title} alt="타이틀" id="title" />
        </div>
        <div className="MainBtns">
          <Button>코드 입력</Button>
          <Button>방 만들기</Button>
          <Button>랜덤 매칭</Button>
        </div>
      </div>
    </div>
  );
};
