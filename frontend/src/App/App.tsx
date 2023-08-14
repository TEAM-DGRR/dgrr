import 'assets/scss/App.scss';
import axios from 'axios';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './Router';

export const App = () => {
	// 모바일 뷰포트 계산
	function setScreenSize() {
		const vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
	}
	const token = localStorage.getItem('token');
	useEffect(() => {
		setScreenSize();
		if (token) {
			axios.defaults.headers.common['Authorization'] = token;
		}
	}, []);

	return (
		<div className='App'>
			<RouterProvider router={router} />
		</div>
	);
};
