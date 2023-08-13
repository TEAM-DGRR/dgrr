import 'assets/scss/GameResult.scss';
import tierGold from 'assets/images/tier_gold.png';
import profileImg from 'assets/images/peeps-avatar.png';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'components/Elements/Button/BasicButton';
import { useNavigate } from 'react-router';

export const GameResult = () => {
	const navigate = useNavigate();
	const battleResult = {
		myInfo: {
			//내 정보
		},
		enemyInfo: {
			//상대 정보
			nickname: '이승규',
			description: '내가 잼ㅋ민ㅋ킹ㅋ👑',
		},
		firstRoundTime: 10,
		secondRoundTime: 20,
		reward: 40,
		afterRank: 'GOLD', //BRONZE,SILVER,GOLD
	};

	//progressBar
	const progressBarContainerRef = useRef(null);
	const progressBarRef = useRef(null);
	const progressBarTextRef = useRef(null);

	const progressBarStates = [50, 75];

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
		<div className='GameResult'>
			<div className='border'>
				<div className='result'>승리</div>
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

				<div className='battle-bottom'>
					<div className='battle-result'>
						<div className='result-left'>
							<img className='profile-image' src={profileImg} alt='프로필 이미지' />
							<div className='profile-info'>
								<span className='nickname'>{battleResult.enemyInfo.nickname}</span>
								<span className='description'>{battleResult.enemyInfo.description}</span>
							</div>
						</div>
						<div className='result-right'>
							<Button size='md'>재도전?</Button>
						</div>
					</div>

					<div className='result-button'>
						<div className='result-button-width'>
							<Button>한판 더?</Button>
						</div>
						<div className='result-button-width'>
							<Button
								onClick={() => {
									navigate('/main');
								}}
							>
								메인으로
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
