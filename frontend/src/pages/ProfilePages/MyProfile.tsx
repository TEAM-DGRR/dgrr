import arrowleft from "assets/images/ico_arrow-left_24px.svg"
import editImg from "assets/images/ico_edit_24px.svg"
import personImg from "assets/images/ico_person_24px.svg"
import "assets/scss/Profile.scss"
import { useNavigate } from "react-router"

export const MyProfile = () => {
  const navigate = useNavigate();
  // 회원정보 받아오기 나중에 추가예정

  return (
    <div className="MyProfile">
      <div className="navbar">
        <div>
          <img src={arrowleft} alt="뒤로가기" onClick={()=>{ navigate('/main') }} />
          <span>프로필</span>
        </div>
        <img src={editImg} alt="프로필편집" />
      </div>

      <div className="profileBody">
        <img src={personImg} alt="프로필 예시" />
        <div>
          {/* 회원정보 받아온 후에 연결시켜줄거임 */}
          <p>닉네임</p>
          <p>상태 메세지</p>
        </div>
      </div>

      <div className="tier">
        <h4>내 티어</h4>
      </div>

      <div className="record">
        <h4>최근 전적</h4>
      </div>
    </div>
  )
}