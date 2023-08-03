import { useMemo, useRef, useState } from "react"
import blankImg from "assets/images/character.svg"
// import axios from "axios";

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
  }
  
  // 사진 업로드
  const uploadImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    
    if (fileList !== null && fileList.length > 0) {
      const formData = new FormData();
      const url = URL.createObjectURL(fileList[0]);
      
      // 미리보기용으로 이미지 state에 저장
      setProfileImg({
        file: fileList[0],
        thumbnail: url,
        type: fileList[0].type.slice(0, 5),
      });
      
      // formdata에 담아서 서버로 전송
      formData.append('image', fileList[0]);
      
      // axios({
        //   baseURL: '',
        //   url: '',
        //   method: 'POST',
        //   data: formData,
        //   headers: {
          //   },
          // });
        }
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

    {/* 프로필 이미지 제출 폼 */}
    <form>
      {/* 버튼 누르면 미리보기 안 바뀜 > 고쳐야함 */}
      <button onClick={fileInput}>파일 업로드 버튼</button>
      <input type="file" accept="image/*" ref={fileInputRef} onChange={uploadImg} />
    </form>
    
    {/* 닉네임 부분은 따로 분리시켜서 다시 만들기 */}
    <p>닉네임</p>
    <input type="search" placeholder="닉네임을 입력해주세요" />
    <button>중복검사</button>
    
    <p>한 줄 소개</p>
    <input type="search" placeholder="즐겁게 게임해요~" />

    <button>회원가입하고 시작하기</button>

    </div>
  )
}