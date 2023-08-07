import React from "react";
import { Route, Routes } from "react-router-dom";
import { Game } from "pages/GamePages/Game";
import { KakaoLogin } from "pages/LoginPages/KakaoLogin";
import { KakaoCallback } from "pages/LoginPages/KakaoCallback";
import { SignUp } from "pages/LoginPages/SignUp";
import { Main } from "pages/MainPages/Main";
import { MyProfile } from "pages/ProfilePages/MyProfile";

export const App = () => {
  return (
    <div className="App">
      <Routes>
        {/* 로그인 관련 */}
        <Route path="/" element={<KakaoLogin />} />
        <Route path="/KakaoCallback" element={<KakaoCallback />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/main" element={<Main />} />
        <Route path="/game" element={<Game />} />
        <Route path="/myprofile" element={<MyProfile />} />
      </Routes>
    </div>
  );
};
