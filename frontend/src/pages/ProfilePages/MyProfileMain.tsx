import backIco from "assets/images/ico_back.svg";
import editImg from "assets/images/ico_edit_24px.svg";
import profileImg from "assets/images/peeps-avatar.png";
import tierBronze from "assets/images/tier_bronze.png";
import tierSilver from "assets/images/tier_silver.png";
import tierGold from "assets/images/tier_gold.png";
import winImg from "assets/images/result_win.svg";
import loseImg from "assets/images/result_lose.svg";
import drawImg from "assets/images/result_draw.svg";
import questionImg from "assets/images/question.svg";
import "assets/scss/Profile.scss";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import TierInfoModal from "components/Elements/TierInfoModal"; // 모달 컴포넌트 임포트
import axios from "axios";
import { PrograssBar } from "components/Elements/PrograssBar";
import { Button } from "components/Elements/Button/BasicButton";

export const MyProfileMain = () => {
  const navigate = useNavigate();

  //modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 사용자 정보 저장
  const [member, setMember] = useState({
    nickname: "",
    description: "",
    profileImage: "",
  });

  const [battleDetailList, setBattleDetailList] = useState([
    {
      battleResult: "",
      createdAt: "",
      opponentProfileImage: "",
      opponentNickname: "",
      opponentDescription: "",
    },
  ]);

  const [ratingList, setRatingList] = useState([
    {
      rating: 0,
      season: 0,
    },
  ]);

  const [isThereBattleDetail, setIsThereBattleDetail] = useState(true);

  //데이터 로드 되었는지
  const [isLoad, setIsLoad] = useState(false);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  //progressBar - info
  const [progressBarStates, setProgressBarStates] = useState([0, 0]); // 초기값은 0으로 설정
  const endState = 100;

  useEffect(() => {
    // 회원정보 받아오기
    const fetchMemberData = async () => {
      axios.defaults.headers.common["Authorization"] =
        localStorage.getItem("token");
      const response = await axios
        .get(`${process.env.REACT_APP_API_URL}/member/member-id`)
        .then((res: any) => {
          setMember(res.data.member);
          setRatingList(res.data.ratingList);
          setBattleDetailList(res.data.battleDetailList);
          setIsLoad(true);
          if (battleDetailList[0].battleResult === "") {
            setIsThereBattleDetail(false);
          } else {
            setIsThereBattleDetail(true);
          }

          //progressBar - DataUpdate
          const newRating = res.data.ratingList[0].rating;
          //rating을 기준으로 다음 등급까지 얼마나 남았는지 계산하는 로직
          let nextRating =
            newRating >= 1400 && newRating < 1600
              ? 1600
              : newRating < 1800
              ? 1800
              : 0; //다음 등급 Rating
          let percent =
            nextRating !== 0 ? 100 - (nextRating - newRating) / 2 : 100;
          setProgressBarStates([0, percent]); // progressBarStates 업데이트
          // setEndState(newRating); // endState 업데이트
        })
        .catch((err: any) => {
          console.log(err);
        });
    };

    fetchMemberData();
  }, [isLoad]); // useEffect를 컴포넌트가 처음 렌더링될 때만 실행되도록 빈 배열 전달

  // endState가 업데이트될 때 GSAP 애니메이션을 실행
  useEffect(() => {}, [progressBarStates]);

  const handleRandomMatch = () => {
    navigate("/game/loading");
  };

  return (
    <div className="MyProfile">
      <TierInfoModal isOpen={isModalOpen} closeModal={closeModal} />
      {isLoad ? (
        <div className="MarginFrame">
          <div className="navbar">
            <div className="navbar-left">
              <img
                src={backIco}
                alt="뒤로가기"
                onClick={() => {
                  navigate("/main");
                }}
              />
              <span>마이프로필</span>
            </div>
            <img
              src={editImg}
              alt="프로필편집"
              onClick={() => {
                navigate("/myprofile/update", { state: { member } });
              }}
            />
          </div>

          <div className="profileBody">
            <img src={member.profileImage} alt="프로필 예시" />
            <span className="nickname">{member.nickname}</span>
            <span className="description">{member.description}</span>
          </div>

          <div className="tier">
            <div className="tierInfo">
              <span>내 티어</span>
              <img src={questionImg} alt="티어 정보 보기" onClick={openModal} />
            </div>
            <div className="tierImage">
              <img
                src={
                  ratingList[0].rating >= 1400 && ratingList[0].rating < 1600
                    ? tierBronze
                    : ratingList[0].rating < 1800
                    ? tierSilver
                    : tierGold
                }
                alt="티어 예시"
              />
            </div>
            <div>
              <div className="container">
                <PrograssBar
                  tier={
                    ratingList[0].rating >= 1400 && ratingList[0].rating < 1600
                      ? "bronze"
                      : ratingList[0].rating < 1800
                      ? "silver"
                      : "gold"
                  }
                  rating={ratingList[0].rating}
                  endState={endState}
                  progressBarStates={progressBarStates}
                />
              </div>
            </div>
          </div>

          <div className="record">
            <div className="recordTitle">
              <span className="recentlyBattle">최근 전적</span>
              {isThereBattleDetail ? (
                <span
                  className="moreBattle"
                  onClick={() => {
                    navigate("/myprofile/record");
                  }}
                >
                  더보기+
                </span>
              ) : null}
            </div>
            <div className="divisionLine"></div>
            {isThereBattleDetail ? (
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
                          <span className="nickname">
                            {item.opponentNickname}
                          </span>
                        </div>

                        <div className="result-right">
                          <span className="date">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div id="battleDetailNone">
                <p>전적이 아직 없습니다.</p>
                <p>랜덤 매칭으로 티어를 올려보세요!</p>
                <Button onClick={handleRandomMatch}>랜덤 매칭</Button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
