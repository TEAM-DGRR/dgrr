import axios from "axios"
import { useState } from "react"


export const NicknameCheck = () => {

  // 닉네임 관련 state
  const [NicknameValue, setNicknameValue] = useState("")

  // 중복된 닉네임 문구 visvibility state
  const [see, setSee] = useState(false)

  // 닉네임 인풋 저장
  const saveNickname = (e:any) => {
    setNicknameValue(e.target.value)
  }

  // 닉네임 중복 검사
  const checkNickname = (e: any) => {
    e.preventDefault();
    const nickname = NicknameValue

    axios.get(`${process.env.REACT_APP_API_URL}/member/nickname-check?nickname=${nickname}`,)
      .then((res: any) => {
        // true면 다른 닉네임하라고 알려주기
        if (res.data.nicknameExits === true) {
          setSee(true)
        }
        // false면 넘겨주기
        setSee(false)
    })
  }

  return (
    <div>
      <p>닉네임</p>
      <input type="search" placeholder="닉네임을 입력해주세요" onChange={saveNickname} />
      <span style={{visibility : see? 'visible' : 'hidden'}}>이미 등록된 닉네임입니다</span>
      <button onClick={checkNickname}>중복검사</button>
    </div>
  )

}