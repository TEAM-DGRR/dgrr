import 'assets/scss/App.scss';
import { Game } from 'pages/GamePages/Game';
import { GameMatch } from 'pages/GamePages/GameMatch';
import { KakaoCallback } from 'pages/LoginPages/KakaoCallback';
import { KakaoLogin } from 'pages/LoginPages/KakaoLogin';
import { SignUp } from 'pages/LoginPages/SignUp';
import { Main } from 'pages/MainPages/Main';
// import { KakaoLogout } from "pages/LoginPages/KakaoLogout";
// import { Menu } from "pages/MainPages/Menu";
import axios from 'axios';
import { GameLoading } from 'pages/GamePages/GameLoading';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MyProfile } from 'pages/ProfilePages/MyProfile';

export const App = () => {
	// 모바일 뷰포트 계산
	function setScreenSize() {
		const vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
	}
	const token = localStorage.getItem('token');
	useEffect(() => {
		setScreenSize();
		console.log(token);
		if (token) {
			console.log('여기 오냐고');
			axios.defaults.headers.common['Authorization'] = token;
		}
	}, []);

	return (
		<div className='App'>
			<Routes>
				{/* 로그인 관련 */}
				<Route path='/' element={<KakaoLogin />} />
				<Route path='/KakaoCallback' element={<KakaoCallback />} />
				<Route path='/signup' element={<SignUp />} />

				<Route path='/main' element={<Main />} />
				<Route path='/game' element={<Game />} />
				<Route path='/myprofile' element={<MyProfile />} />
			</Routes>
		</div>
	);
};
