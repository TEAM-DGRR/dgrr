import {
  useMemo,
  useRef,
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
} from "react";
import blankImg from "assets/images/logo_character.png";
import axios from "axios";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import photoUpload from "assets/images/ico_photo.png";
import "assets/scss/Signup.scss";
import { Input } from "components/Form/Input";
import { Button } from "components/Elements/Button/BasicButton";

type UploadImg = {
  file: File;
  thumbnail: string;
  type: string;
};

export const SignUp = () => {
  // code 받아오기
  const location = useLocation();
  const id = location.state?.id;

  // 올린 파일 경로
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // 프로필 이미지 state
  const [profileImg, setProfileImg] = useState<UploadImg | null>(null);
  // 버튼이 눌리면 파일 업로드 창 띄우기
  const fileInput = () => {
    fileInputRef.current?.click();
  };

  // 닉네임 관련 경고 문구
  const [checkstate, setCheckstate] = useState("");

  // 닉네임 state
  const [nickname, setNickname] = useState("");
  // 상태 메세지 state
  const [description, setDescription] = useState("");
  // 경고 문구 visibility state
  const [see, setSee] = useState(false);

  // 닉네임 변경상태 받기
  const onChangeNickname = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setSee(false);
  };
  // 상태메시지 변경상태 받기
  const onChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/member/kakao-id?kakaoId=${id}`)
      .then((response) => {
        console.log("memberId: " + JSON.stringify(response.data));
        console.log("headers: " + JSON.stringify(response.headers));
      })
      .catch((error) => {
        console.error("signUp에서 member check 실패 : " + error);
      });
  }, []);

  // 사진 업로드
  const uploadImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;

    if (fileList !== null && fileList.length > 0) {
      // const url = URL.createObjectURL(fileList[0]);
      // 미리보기용으로 이미지 state에 저장
      const formData = new FormData();
      formData.append("file", fileList[0]);
      axios
        .post(`${process.env.REACT_APP_API_URL}/file`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res: any) => {
          console.log("file upload: " + JSON.stringify(res.data));
          setProfileImg({
            file: fileList[0],
            thumbnail: res.data,
            type: fileList[0].type.slice(0, 5),
          });
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  };

  const navigate = useNavigate();

  // 회원가입
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const regex = /^[a-zA-Z가-힣0-9]*$/;
    // 닉네임 조건을 만족한다면 중복검사
    if (nickname.length >= 2 && regex.test(nickname)) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/member/nickname-check?nickname=${nickname}`
        )
        .then((res: any) => {
          // 없다면 회원가입 진행
          if (res.data.nicknameExists === "false") {
            console.log("??? : " + profileImg?.thumbnail);
            console.log("type: " + typeof profileImg?.thumbnail);
            axios
              .post(`${process.env.REACT_APP_API_URL}/member`, {
                kakaoId: id,
                nickname: nickname,
                profileImage: profileImg?.thumbnail,
                description: description,
              })
              .then((res: any) => {
                console.log(res.data);
                axios
                  .get(
                    `${process.env.REACT_APP_API_URL}/member/login?kakaoId=${res.data.kakaoId}`
                  )
                  .then((res: any) => {
                    console.log("login data: " + JSON.stringify(res.data));
                    localStorage.setItem("token", res.data.token);
                    axios.defaults.headers.common[
                      "Authorization"
                    ] = `${res.data.token}`;
                    axios
                      .get(
                        `${process.env.REACT_APP_API_URL}/member/kakao-id?kakaoId=${res.data.member.kakaoId}`
                      )
                      .then((res: any) => {
                        console.log(JSON.stringify(res.data));
                      });
                  });
                navigate("/main");
              })
              .catch((err: any) => {
                console.log(err);
              });
          }
          // 존재하면 경고 문구 보여주기
          else {
            setCheckstate("이미 존재하는 닉네임입니다");
            setSee(true);
          }
        });
    } else {
      if (nickname.length < 2) {
        setCheckstate("닉네임을 2글자 이상 입력해주세요");
      } else {
        setCheckstate("한글/영어/숫자만 사용해주세요");
      }
      setSee(true);
    }
  };

  // 프로필 이미지 미리보기 부분
  const ShowImg = useMemo(() => {
    if (!profileImg && profileImg == null) {
      return <img src={blankImg} alt="기본 이미지" id="ex-profile" />;
    }
    return (
      <img
        src={profileImg.thumbnail}
        alt={profileImg.type}
        onClick={fileInput}
        id="ex-profile"
      />
    );
  }, [profileImg]);

  return (
    <div className="SignUp">
      <div className="signup-title">
        <p>데구르르에 오신 것을 환영해요!</p>
      </div>

      <form onSubmit={onSubmit} className="signupForm">
        <label className="label" id="profileImg-label">
          {/* 이미지 미리보기 */}
          {ShowImg}

          <label htmlFor="profileImg">
            <img src={photoUpload} id="photo-upload" alt="업로드버튼" />
          </label>

          <input
            id="profileImg"
            type="file"
            accept="image/*"
            ref={fileInputRef} // 미리보기
            onChange={uploadImg} // 바뀌면
          />
        </label>
        <label className="label" id="nickname-label">
          <p className="label-title">닉네임</p>
          <p style={{ color: "#8E8E90" }}>
            한글/영어/숫자 최소 2자~최대 12자 가능
          </p>
          <Input
            maxlength={12}
            onChange={onChangeNickname}
            placeholder={"닉네임을 입력해주세요"}
          />
          <p style={{ visibility: see ? "visible" : "hidden", color: "red" }}>
            {checkstate}
          </p>
        </label>
        <label className="label" id="description-label">
          <p className="label-title">상태 메세지</p>
          <Input
            maxlength={30}
            onChange={onChangeDescription}
            placeholder={"상태 메세지를 입력해주세요"}
          />
        </label>
        <label className="label">
          <Button onClick={onSubmit} color="blue">
            시작하기
          </Button>
        </label>
      </form>
    </div>
  );
};
