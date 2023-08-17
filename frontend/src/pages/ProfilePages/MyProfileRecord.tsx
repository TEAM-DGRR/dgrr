import arrowleft from "assets/images/ico_arrow-left_24px.svg";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import profileImg from "assets/images/peeps-avatar.png";
import winImg from "assets/images/result_win.svg";
import loseImg from "assets/images/result_lose.svg";
import drawImg from "assets/images/result_draw.svg";
import axios from "axios";
import "assets/scss/Profile.scss";

export const MyProfileRecord = () => {
  const navigate = useNavigate();

  //전적 저장 배열
  const [battleDetailList, setBattleDetailList] = useState([
    {
      battleResult: "",
      createdAt: "",
      opponentProfileImage: "",
      opponentNickname: "",
      opponentDescription: "",
    },
  ]);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const fetchRecordData = async () => {
      axios.defaults.headers.common["Authorization"] =
        localStorage.getItem("token");
      const response = await axios
        .get(`${process.env.REACT_APP_API_URL}/battle`)
        .then((res: any) => {
          // console.log(res.data);
          setBattleDetailList(res.data);
        })
        .catch((err: any) => {
          console.log(err);
        });
    };

    fetchRecordData();
  }, []);

  return (
    <div className="MyProfileRecord">
      <div className="MarginFrame">
        <div className="navbar">
          <div className="navbar-left">
            <img
              src={arrowleft}
              alt="마이 프로필"
              onClick={() => {
                navigate("/myprofile");
              }}
            />
            <span>최근 전적</span>
          </div>
        </div>
        <div className="record">
          <div className="recordList">
            <ul className="list_ul">
              {battleDetailList.map((item, index) => (
                <li key={index} className="battle-item">
                  <div className="battle-result">
                    <div className="result-left">
                      <img
                        className="result-image"
                        src={
                          item.battleResult === "WIN"
                            ? winImg
                            : item.battleResult === "LOSE"
                            ? loseImg
                            : drawImg
                        }
                        alt="승리 이미지"
                      />
                      <img
                        className="profile-image"
                        src={item.opponentProfileImage}
                        alt="프로필 이미지"
                      />
                      <span className="nickname">{item.opponentNickname}</span>
                    </div>

                    <div className="result-right">
                      <span className="date">{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
