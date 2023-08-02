import { useEffect } from "react";
import axios from "axios"

export const KakaoCallback = () => {
    useEffect(() => {
        // 인가 코드 받기
        const REST_API_KEY = `${process.env.REACT_APP_REST_API_KEY}`;
        const REDIRECT_URI = `${process.env.REACT_APP_REDIRECT_URI}`;
        const code = new URL(window.location.href).searchParams.get("code");
        const grantType = "authorization_code";

        // 토큰 받기
        axios.post(
            `https://kauth.kakao.com/oauth/token?grant_type=${grantType}&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${code}`,
            {},
            { headers: { "Content-type": "application/x-www-form-urlencoded;charset=utf-8" } }
        )
        .then((res: any) => {
            console.log(res);
            // const { access_token } = res.data;
            // axios.post(
            //     `/kakao/kakaoCallback`,
            //     {
            //         headers: {
            //             code: access_token,
            //         }
            //     }
            // )
            // .then((res: any) => {
            //     // 유저 정보가 있으면 메인으로 보내기

            //     // 없다면 회원가입 화면으로 보내기
            // })
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