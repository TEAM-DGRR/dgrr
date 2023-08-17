import backIco from "assets/images/ico_back.svg";
import { useNavigate } from "react-router";
import {
  useMemo,
  useRef,
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
} from "react";
import "assets/scss/Signup.scss";
import { Input } from "components/Form/Input";
import { Button } from "components/Elements/Button/BasicButton";
import photoUpload from "assets/images/ico_photo.png";
import axios from "axios";
import { useLocation } from "react-router";
type UploadImg = {
  file: File;
  thumbnail: string;
  type: string;
};

export const MyProfileUpdate = () => {
  const navigate = useNavigate();

  // code 받아오기
  const location = useLocation();
  const id = location.state?.id;

  // 사용자 정보 저장
  const [member, setMember] = useState({
    memberId: 0,
    nickname: "",
    description: "",
    profileImage: "",
  });

  const beforeNickname = member.nickname;

  // 올린 파일 경로
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // 프로필 이미지 state
  const [profileImg, setProfileImg] = useState<UploadImg | null>({
    file: new File([], ""),
    thumbnail: member.profileImage,
    type: "",
  });
  // 버튼이 눌리면 파일 업로드 창 띄우기
  const fileInput = () => {
    fileInputRef.current?.click();
  };

  // 닉네임 관련 경고 문구
  const [checkstate, setCheckstate] = useState("");

  // 닉네임 state
  const [nickname, setNickname] = useState(member.nickname);

  // 상태 메세지 state
  const [description, setDescription] = useState(member.description);
  // 경고 문구 visibility state
  const [see, setSee] = useState(false);
  //프로필사진 수정여부
  const [profileUpdate, setProfileUpdate] = useState(false);

  const fetchMemberData = async () => {
    axios.defaults.headers.common["Authorization"] =
      localStorage.getItem("token");
    const response = await axios
      .get(`${process.env.REACT_APP_API_URL}/member/member-id`)
      .then((res: any) => {
        setMember(res.data.member);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  useEffect(() => {
    // 닉네임 변경 감지
    setNickname(member.nickname);
    setDescription(member.description);
  }, [member]);

  // 닉네임 변경상태 받기
  const onChangeNickname = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setSee(false);
  };
  // 상태메시지 변경상태 받기
  const onChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  // 사진 업로드
  const uploadImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    setProfileUpdate(true);

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
          setProfileImg({
            file: fileList[0],
            thumbnail: res.data,
            type: fileList[0].type.slice(0, 5),
          });
          // console.log("썸네일 변경헀냐고");
          const mem = { ...member, profileImage: res.data };
          setMember(mem);
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  };

  // 수정하기
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const regex = /^[a-zA-Z가-힣0-9]*$/;
    // 닉네임 조건을 만족하고 기존 닉네임과 다르다면 중복검사
    // console.log(nickname + " === " + beforeNickname);
    if (nickname.length >= 2 && regex.test(nickname)) {
      if (nickname !== beforeNickname) {
        //닉네임이 바뀐 경우
        axios
          .get(
            `${process.env.REACT_APP_API_URL}/member/nickname-check?nickname=${nickname}`
          )
          .then((res: any) => {
            // 없다면 수정하기 진행
            if (res.data.nicknameExists === "false") {
              updateMemberProfile();
            }
            // 존재하면 경고 문구 보여주기
            else {
              setCheckstate("이미 존재하는 닉네임입니다");
              setSee(true);
            }
          });
      } else {
        updateMemberProfile();
      }
    } else {
      if (nickname.length < 2) {
        setCheckstate("닉네임을 2글자 이상 입력해주세요");
      } else {
        setCheckstate("한글/영어/숫자만 사용해주세요");
      }
      setSee(true);
    }
  };

  //멤버 정보 업데이트 함수
  const updateMemberProfile = () => {
    if (profileImg && profileImg.thumbnail) {
      //새 파일로 프로필 업로드 한 경우
      axios
        .put(`${process.env.REACT_APP_API_URL}/member`, {
          memberId: member.memberId,
          nickname: nickname,
          profileImage: profileImg.thumbnail,
          description: description,
        })
        .then((res: any) => {
          navigate("/myprofile");
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      //파일 업로드 하지 않은 경우
      axios
        .put(`${process.env.REACT_APP_API_URL}/member`, {
          memberId: member.memberId,
          nickname: nickname,
          profileImage: member.profileImage,
          description: description,
        })
        .then((res: any) => {
          navigate("/myprofile");
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  };

  // 프로필 이미지 미리보기 부분
  const ShowImg = useMemo(() => {
    // if (!profileImg?.thumbnail || profileImg?.thumbnail == null || profileImg?.thumbnail === '') {
    if (!profileUpdate) {
      axios.defaults.headers.common["Authorization"] =
        localStorage.getItem("token");
      const response = axios
        .get(`${process.env.REACT_APP_API_URL}/member/member-id`)
        .then((res: any) => {
          setMember(res.data.member);
          return (
            <img
              src={member.profileImage}
              alt="프로필 이미지"
              id="ex-profile"
            />
          );
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      return (
        <img
          src={profileImg?.thumbnail}
          alt={profileImg?.type}
          onClick={fileInput}
          id="ex-profile"
        />
      );
    }
  }, [profileImg, member.profileImage]);

  return (
    <div className="MyProfileUpdate">
      <div className="MarginFrame">
        <div className="navbar">
          <div className="navbar-left">
            <img
              src={backIco}
              alt="마이 프로필"
              onClick={() => {
                navigate("/myprofile");
              }}
            />
            <span>내 정보 수정</span>
          </div>
        </div>
      </div>
      <form onSubmit={onSubmit} className="signupForm">
        <label className="label" id="profileImg-label">
          <img src={member.profileImage} id="ex-profile" />

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
            defaultValue={member.nickname}
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
            defaultValue={member.description}
          />
        </label>
        <label className="label">
          <Button onClick={onSubmit} color="blue" width="100%">
            수정하기
          </Button>
        </label>
      </form>
    </div>
  );
};
