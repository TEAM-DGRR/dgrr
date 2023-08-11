import { useEffect } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";

export const KakaoCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // 인가 코드 받기
        const code = new URL(window.location.href).searchParams.get("code");
        
        // const login = () => {

        // }
        // 인가 코드 보내기
        axios.get(
            `${process.env.REACT_APP_API_URL}/member/kakao-callback?code=${code}`,
        )
        .then((res: any) => {
            console.log("res: " + JSON.stringify(res.data))
            // 없다면 회원가입 화면으로 보내기
            if (res.data.key === "signUp") {
                navigate("/signup", { state: { id: res.data.id } })
            } else {
                // 유저 정보가 있으면 로그인 후 메인으로 보내기
                console.log("signUp: " + JSON.stringify(res.data));
                axios.get(
                        `${process.env.REACT_APP_API_URL}/member/login?kakaoId=${res.data.member.kakaoId}`
                ).then((res: any) => {
                    // const { member } = res.data;
                    console.log("login data: " + JSON.stringify(res.data))
                    localStorage.setItem("token", res.data.token);
                    axios.defaults.headers.common["Authorization"] = `${res.data.token}`;
                    axios.get(`${process.env.REACT_APP_API_URL}/member/kakao-id?kakaoId=${res.data.member.kakaoId}`
                    ).then((res:any) => {
                        console.log(JSON.stringify(res.data))
                    })
                    navigate('/main')
                }).catch((err: any) => {
                    console.log(err);
                })
                
            }

        })
        .catch((Error: any) => {
            console.log("hi")
            console.log(Error)
        })
    })
    
    return(
        <>
        </>
    )
};