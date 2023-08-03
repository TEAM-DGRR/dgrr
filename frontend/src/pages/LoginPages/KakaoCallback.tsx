import { useEffect } from "react";
import axios from "axios"

export const KakaoCallback = () => {
    useEffect(() => {
        // 인가 코드 받기
        const code = new URL(window.location.href).searchParams.get("code");

        // 인가 코드 보내기
        axios.post(
            `/kakao/kakaoCallback`,
            { code : code }
        )
        .then((res: any) => {
            // 유저 정보가 있으면 메인으로 보내기

            // 없다면 회원가입 화면으로 보내기
        })
        .catch((Error: any) => {
            console.log(Error)
        })
    }, [])
    
    return(
        <>
        </>
    )
};