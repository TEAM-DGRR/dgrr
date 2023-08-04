import { useMemo, useRef, useState, ChangeEvent, MouseEvent } from "react"
import blankImg from "assets/images/logo_character.svg"
import axios from "axios";

type UploadImg = {
  file: File;
  thumbnail: string;
  type: string;
};

export const SignUp = () => {

  // 올린 파일 경로
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // 프로필 이미지 state
  const [profileImg, setProfileImg] = useState<UploadImg | null>(null);
  // 버튼이 눌리면 파일 업로드 창 띄우기 
  const fileInput = () => {
    fileInputRef.current?.click();
  };

  // 닉네임 state
  const [nickname, setNickname] = useState("")
  // 상태 메세지 state
  const [description, setDescription] = useState("")
  // 닉네임 중복 검사 통과 state
  const [isChecked, setChecked] = useState(false)


  // 닉네임 변경상태 받기
  const onChangeNickname = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value)
  }
  // 상태메시지 변경상태 받기
  const onChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  // 닉네임 중복확인
  const nicknameCheck = (e: MouseEvent<HTMLButtonElement>) => {

    // 닉네임 보내서 중복인지 확인하기
    axios.get(`http://localhost:8080/member/nickname-check?nickname=${nickname}`)
    .then((res: any) => {
      // 존재하면 경고 문구 보여주기
      if (res.data.nicknameExists) {
        alert('이미 존재하는 닉네임입니다')
      }
      // 없다면 사용 가능하다고 알려주고 중복검사 state 변경해주기
      alert('사용 가능한 닉네임입니다')
      setChecked(true)
    })

  }
  
  
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

  // 회원가입
  const onSubmit = () => {
    // 닉네임 중복검사 통과했으면 회원가입 시켜주기
    if (isChecked) {
    }
    // 중복검사 통과못했으면 돌려보내기
  }
  
  // 프로필 이미지 미리보기 부분
  const ShowImg = useMemo(() => {
    if (!profileImg && profileImg == null) {
      return <img src={blankImg} alt="기본 이미지" />;
    }
    return <img src={profileImg.thumbnail} alt={profileImg.type} onClick={fileInput} />;
  }, [profileImg])
      

  return (
    <div className="SignUp">
    <p>데구르르에 오신 것을 환영합니다.</p>

    {ShowImg}

      
    <form onSubmit={onSubmit}>
      <label id="profileImg-label">
        <button onClick={fileInput}>
          파일 업로드 버튼
          <input hidden type="file" accept="image/*" ref={fileInputRef} onChange={uploadImg} />
        </button>
        <div>
          <input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
        </div>
      </label>
      <label id="nickname-label">
        <span>닉네임</span>
        <div>
          <input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
        </div>
        <button onChange={nicknameCheck}>중복검사</button>
      </label>
      <label id="description-label">
        <span>상태 메세지</span>
        <div>
          <textarea id="description" name="description" value={description} onChange={onChangeDescription} />
        </div>
      </label>
    <button type="submit">회원가입하고 시작하기</button>
    </form>

    </div>
  )
}