import { NotFound } from "components/Form/NotFound";
import { Game } from "pages/GamePages/Game";
import { GameLoading } from "pages/GamePages/GameLoading";
import { GameMatch } from "pages/GamePages/GameMatch";
import { KakaoCallback } from "pages/LoginPages/KakaoCallback";
import { KakaoLogin } from "pages/LoginPages/KakaoLogin";
import { KakaoLogout } from "pages/LoginPages/KakaoLogout";
import { SignUp } from "pages/LoginPages/SignUp";
import { Main } from "pages/MainPages/Main";
import { Menu } from "pages/MainPages/Menu";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <KakaoLogin/>,
        errorElement: <NotFound/>,
    },
    {
        path: "kakaoCallback",
        element: <KakaoCallback/>,
        errorElement: <NotFound/>,
    },
    {
        path: "signup",
        element: <SignUp/>,
        errorElement: <NotFound/>,
    },
    {
        path: "kakaoLogout",
        element: <KakaoLogout/>,
        errorElement: <NotFound/>,
    },
    {
        path: "main",
        element: <Main/>,
        errorElement: <NotFound/>,
    },
    {
        path: "menu",
        element: <Menu/>,
        errorElement: <NotFound/>,
    },
    {
        path: "game/*",
        element: <Game/>,
        errorElement: <NotFound/>,
    },
    {
        path: "match",
        element: <GameMatch/>,
        errorElement: <NotFound/>,
    },
    {
        path: "loading",
        element: <GameLoading/>,
        errorElement: <NotFound/>,
    },
]);

export default router;