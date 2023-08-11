import { useEffect } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";

export const KakaoLogout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
        navigate("/");
        
      })
    
    return(
        <>
        로그아웃 대기
        </>
    )
};