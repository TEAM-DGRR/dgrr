import arrowleft from 'assets/images/ico_arrow-left_24px.svg';
import editImg from 'assets/images/ico_edit_24px.svg';
import personImg from 'assets/images/ico_person_24px.svg';
import profileImg from 'assets/images/peeps-avatar.png';
import tierGold from 'assets/images/tier_gold.png';
import 'assets/scss/Profile.scss';
import { useNavigate } from 'react-router';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

export const MyProfile = () => {
	const navigate = useNavigate();
	// 회원정보 받아오기 나중에 추가예정

	const progressBarContainerRef = useRef(null);
	const progressBarRef = useRef(null);
	const progressBarTextRef = useRef(null);

	const progressBarStates = [0, 75];

	useEffect(() => {
		let time = 0;
		let endState = 100;

		progressBarStates.forEach((state) => {
			// let randomTime = Math.floor(Math.random() * 3000);
			let Time = 20;
			setTimeout(() => {
				if (state === endState) {
					gsap.to(progressBarRef.current, {
						x: `${state}%`,
						duration: 2,
						backgroundColor: '#ffd700',
					});
				} else {
					gsap.to(progressBarRef.current, {
						x: `${state}%`,
						duration: 1,
					});
				}
			}, Time + time);
			time += Time;
		});
	}, []); // useEffect를 컴포넌트가 처음 렌더링될 때만 실행되도록 빈 배열 전달

	return (
		<div className='MyProfile'>
			<div className='MarginFrame'>
				<div className='navbar'>
					<div className='navbar-left'>
						<img
							src={arrowleft}
							alt='뒤로가기'
							onClick={() => {
								navigate('/main');
							}}
						/>
						<span>마이프로필</span>
					</div>
					<img src={editImg} alt='프로필편집' />
				</div>

				<div className='profileBody'>
					<div className='profileImage'>
						<img src={profileImg} alt='프로필 예시' />
					</div>
					<div className='profileInfo'>
						{/* 회원정보 받아온 후에 연결시켜줄거임 */}
						<span className='nickname'>이승규만 노린다</span>
						<span className='description'>
							BTS 이승규 최명하 김현아 박미정 전영호 박재범 Let's go
						</span>
					</div>
				</div>

				<div className='tier'>
					<span>내 티어</span>
					<div className='tierImage'>
						<img src={tierGold} alt='티어 예시' />
					</div>
					<div>
						<div className='container'>
							<div className='progress-bar__container' ref={progressBarContainerRef}>
								<div className='progress-bar' ref={progressBarRef}>
									<span className='progress-bar__text' ref={progressBarTextRef}>
										Uploaded Successfully!
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='record'>
					<div className='recordTitle'>
						<span className='recentlyBattle'>최근 전적</span>
						<span className='moreBattle'>더보기+</span>
					</div>
					<div className='divisionLine'></div>
					<div>list</div>
				</div>
			</div>
		</div>
	);
};
