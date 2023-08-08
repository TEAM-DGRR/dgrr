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
            `http://localhost:8080/member/kakao-callback?code=${code}`,
        )
        .then((res: any) => {
            // 없다면 회원가입 화면으로 보내기
            if (res.data.key === "signUp") {
                alert("res.data + " + JSON.stringify(res.data));
                navigate("/signup", { state: { id: res.data.id } })
            } else {
                // 유저 정보가 있으면 메인으로 보내기
                console.log(res.data);
                axios.get(`http://localhost:8080/member/login?id=${res.data.id}`,)
                .then((res:any) => {
                    alert("res.data : " + JSON.stringify(res.data));
                    alert("res.header: " + JSON.stringify(res.headers))
                    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`
                    navigate('/main');
                })
                .catch((Error: any) => {
                    console.log("hhhiii")
                    console.log(Error)
                })
                // axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
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