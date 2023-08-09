import { useMemo, useRef, useState, ChangeEvent, FormEvent, useEffect } from "react";
import blankImg from "assets/images/logo_character.png";
import axios from "axios";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import photoUpload from "assets/images/ico_photo.png";
import "assets/scss/Signup.scss";
import { Input } from "components/Elements/Form/Input";


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

  // 중복검사 버튼 문구
  const [checkbtn, setCheckbtn] = useState("중복검사")
  // 닉네임 관련 경고 문구
  const [checkstate, setCheckstate] = useState('')

   // 닉네임 state
   const [nickname, setNickname] = useState("")
   // 상태 메세지 state
   const [description, setDescription] = useState("")
   // 닉네임 중복 검사 통과 state
   const [isChecked, setChecked] = useState(false)
   // 경고 문구 visibility state
   const [see, setSee] = useState(false) 

     // 닉네임 변경상태 받기
  const onChangeNickname = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value)
    setSee(false)
    setChecked(false)
    setCheckbtn('중복확인')
  }
  // 상태메시지 변경상태 받기
  const onChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
  }

  // 닉네임 중복확인
  const nicknameCheck = (e: any) => {
    e.preventDefault();
    setCheckbtn('중복검사')
    setSee(false)
    setChecked(false)
    

    // 닉네임이 두글자 이상이고 특수기호가 없다면 중복확인
    const regex = /^[a-zA-Z가-힣0-9]*$/;
    if (nickname.length >= 2 && regex.test(nickname)) {
      // 닉네임 보내서 중복인지 확인하기
      axios.get(`${process.env.REACT_APP_API_URL}/member/nickname-check?nickname=${nickname}`)
      .then((res: any) => {
        // 없다면 사용 가능하다고 알려주고 중복검사 state 변경해주기
        if (res.data.nicknameExists === 'false') {
          setCheckbtn("확인완료")
          setChecked(true)
        }
        // 존재하면 경고 문구 보여주기
        else {
          setCheckstate('이미 존재하는 닉네임입니다')
          setSee(true)
        }
      })
    } else {
      if (nickname.length < 2) {
        setCheckstate('닉네임을 2글자 이상 입력해주세요')
      } else {
        setCheckstate('한글/영어/숫자만 사용해주세요')
      }
      setSee(true)
    }

  }

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
  }, );
 
  // 사진 업로드
  const uploadImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    
    if (fileList !== null && fileList.length > 0) {
      const url = URL.createObjectURL(fileList[0]);
      // 미리보기용으로 이미지 state에 저장
      setProfileImg({
        file: fileList[0],
        thumbnail: url,
        type: fileList[0].type.slice(0, 5),
      });
        }
  }

  const navigate = useNavigate();

  // 회원가입
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    // 닉네임 중복검사 통과했으면 회원가입 시켜주기
    if (isChecked) {
      axios.post(`${process.env.REACT_APP_API_URL}/member`, {
        nickname: nickname,
        description: description,
        profileImage: profileImg
      }).then((res: any) => {
        
        // code를 다시 담아서 로그인 요청
        axios.post(
          `${process.env.REACT_APP_API_URL}/member`,
          {
            kakaoId: id,
            nickname: nickname,
            profileImg: profileImg,
            description: description,
          }
        ).then((res: any) => {
        console.log(res.data)

        navigate("/main");
      })
      }).catch((err: any) => {
        console.log(err)
      })
    } else {
      // 중복검사 통과못했으면 경고
      setCheckstate('닉네임을 확인해주세요')
      setSee(true)
    }
  }

  // 프로필 이미지 미리보기 부분
  const ShowImg = useMemo(() => {
    if (!profileImg && profileImg == null) {
      return <img src={blankImg} alt="기본 이미지" id="ex-profile" />;
    }
    return <img src={profileImg.thumbnail} alt={profileImg.type} onClick={fileInput} id="ex-profile" />;
  }, [profileImg]);

  return (
    <div className="SignUp">
      <div className="signup-title">
        <p>데구르르에 오신 것을 환영합니다.</p>
      </div>

      <form onSubmit={onSubmit} className="signupForm">
        <label id="profileImg-label">
          {/* 이미지 미리보기 */}
          {ShowImg}

          <label htmlFor="profileImg">
            <img src={photoUpload} id="photo-upload" alt="업로드버튼" />
          </label>
          <br />

          <input
            id="profileImg"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={uploadImg}
          />
        </label>
        <label id="nickname-label">
          <div>
            <span>닉네임 * </span>
            <span style={{ color: "grey" }}>
              한글/영어/숫자 최소 2자~ 최대 12자 가능
            </span>
          </div>
          <div className="input-container">
            <Input width={240} onChange={onChangeNickname} placeholder={'닉네임을 입력해주세요'} />
            <button id="nicknamebtn" onClick={nicknameCheck}>
              {checkbtn}
            </button>
          </div>
          <div className="check-state">
            <span
              style={{ visibility: see ? "visible" : "hidden", color: "red" }}
            >
              {checkstate}
            </span>
            <br />
          </div>
        </label>
        <label id="description-label">
          <span>상태 메세지</span>
          <Input width={320} onChange={onChangeDescription} placeholder={'상태메세지를 입력해주세요'} />
        </label>
        <button id="signupbtn" type="submit">
          회원가입하고 시작하기
        </button>
      </form>
    </div>
  );
};
