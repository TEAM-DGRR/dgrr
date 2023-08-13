import { NotFound } from 'components/Form/NotFound';
import { Game } from 'pages/GamePages/Game';
import { KakaoCallback } from 'pages/LoginPages/KakaoCallback';
import { KakaoLogin } from 'pages/LoginPages/KakaoLogin';
import { KakaoLogout } from 'pages/LoginPages/KakaoLogout';
import { SignUp } from 'pages/LoginPages/SignUp';
import { Main } from 'pages/MainPages/Main';
import { Menu } from 'pages/MainPages/Menu';
import { MyProfile } from 'pages/ProfilePages/MyProfile';
import { createBrowserRouter } from 'react-router-dom';
import { Unauthorized } from 'components/Form/Unauthorized';

const router = createBrowserRouter([
	{
		path: '/',
		element: <KakaoLogin />,
		errorElement: <NotFound />,
	},
	{
		path: 'kakaoCallback',
		element: <KakaoCallback />,
		errorElement: <NotFound />,
	},
	{
		path: 'signup',
		element: <SignUp />,
		errorElement: <NotFound />,
	},
	{
		path: 'kakaoLogout',
		element: <KakaoLogout />,
		errorElement: <NotFound />,
	},
	{
		path: 'main',
		element: <Main />,
		errorElement: <NotFound />,
	},
	{
		path: 'menu',
		element: <Menu />,
		errorElement: <NotFound />,
	},
	{
		path: 'myprofile/*',
		element: <MyProfile />,
		errorElement: <NotFound />,
	},
	{
		path: 'game/*',
		element: <Game />,
		errorElement: <NotFound />,
	},
	{
		path: 'not-found',
		element: <NotFound/>,
		errorElement: <NotFound/>,
	},
	{
		path: 'unauthorized',
		element: <Unauthorized/>,
		errorElement:<Unauthorized/>, 
	}
	// {
	//     path: "game/match",
	//     element: <GameMatch />,
	//     errorElement: <NotFound />,
	// },
	// {
	//     path: "game/loading",
	//     element: <GameLoading />,
	//     errorElement: <NotFound />,
	// },
]);

export default router;
