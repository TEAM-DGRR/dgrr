import "assets/scss/Menu.scss";
import backIco from "assets/images/ico_back.svg";
import winkBreadIco from "assets/images/ico_bread_wink.png";
import { useNavigate } from "react-router-dom";

export const Menu = () => {
  const REST_API_KEY = process.env.REACT_APP_REST_API_KEY;
  const REDIRECT_LOGOUT_URI = `${process.env.REACT_APP_LOGOUT_REDIRECT_URI}`;
  const kakaoLogoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=${REST_API_KEY}&logout_redirect_uri=${REDIRECT_LOGOUT_URI}`;
  const navigate = useNavigate();
  
const onClickBack = () => {

  navigate("/main");
}

  return (
    <div className="MenuPage">
      <div className="MenuNav">
        <img src={backIco} onClick={onClickBack} alt="메뉴 아이콘" />
        <span>메뉴</span>
      </div>
      <div className="MenuBody">
        <div className="MenuBtns">
          <img src={winkBreadIco} alt="빵_윙크" id="wink_bread"/>
          <p>COMMING SOON</p>
        </div>
        <div className="MenuLogout"><span onClick={() => window.location.href = kakaoLogoutUrl}>로그아웃</span></div>
      </div>
    </div>
  );
};
