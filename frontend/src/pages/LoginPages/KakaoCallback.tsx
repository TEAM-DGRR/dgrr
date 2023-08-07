import { useEffect } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";

export const KakaoCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // 인가 코드 받기
        const code = new URL(window.location.href).searchParams.get("code");

        // 인가 코드 보내기
        axios.get(
            `http://localhost:8080/member/kakaoCallback?code=${code}`,
        )
        .then((res: any) => {
            // 없다면 회원가입 화면으로 보내기
            if (res.data.key === "signUp") {
                navigate("/signup", { state: { code: code } })
            } else {
                // 유저 정보가 있으면 메인으로 보내기
                navigate('/main')
            }
        })
        .catch((Error: any) => {
            console.log(Error)
        })
    })
    
    return(
        <>
        </>
    )
};