import arrowleft from 'assets/images/ico_arrow-left_24px.svg';
import editImg from 'assets/images/ico_edit_24px.svg';
import profileImg from 'assets/images/peeps-avatar.png';
import tierGold from 'assets/images/tier_gold.png';
import winImg from 'assets/images/result_win.svg';
import loseImg from 'assets/images/result_lose.svg';
import drawImg from 'assets/images/result_draw.svg';
import questionImg from 'assets/images/question.svg';
import 'assets/scss/Profile.scss';
import { useNavigate } from 'react-router';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import TierInfoModal from 'components/Game/Elements/TierInfoModal'; // 모달 컴포넌트 임포트

export const MyProfile = () => {
	const navigate = useNavigate();
	// 회원정보 받아오기 나중에 추가예정

	//modal
	const [isModalOpen, setIsModalOpen] = useState(false);
	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	//battleDetailList
	const battleDetailList = [
		{
			result: 'WIN',
			profileImage: 'path_to_profile_image_1.jpg',
			nickname: '미정미정',
			date: '2023-08-09',
		},
		{
			result: 'DRAW',
			profileImage: 'path_to_profile_image_2.jpg',
			nickname: '웃어웃으라고',
			date: '2023-08-08',
		},
		{
			result: 'LOSE',
			profileImage: 'path_to_profile_image_2.jpg',
			nickname: '마라탕 0단계먹는 명하',
			date: '2023-08-08',
		},
		// ...
	];

	//progressBar
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
			<TierInfoModal isOpen={isModalOpen} closeModal={closeModal} />
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
					<div className='tierInfo'>
						<img src={questionImg} alt='티어 정보 보기' onClick={openModal} />
					</div>
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
					<div className='recordList'>
						<ul className='list_ul'>
							{battleDetailList.map((item, index) => (
								<li key={index} className='battle-item'>
									<div className='battle-result'>
										<div className='result-left'>
											<img
												className='result-image'
												src={
													item.result === 'WIN'
														? winImg
														: item.result === 'LOSE'
														? loseImg
														: drawImg
												}
												alt='승리 이미지'
											/>
											<img className='profile-image' src={profileImg} alt='프로필 이미지' />
											<span className='nickname'>{item.nickname}</span>
										</div>

										<div className='result-right'>
											<span className='date'>{item.date}</span>
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};
