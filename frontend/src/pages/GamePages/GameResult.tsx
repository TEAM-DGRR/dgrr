import 'assets/scss/GameResult.scss';
import tierGold from 'assets/images/tier_gold.png';
import profileImg from 'assets/images/peeps-avatar.png';
import { useEffect, useState } from 'react';
import { Button } from 'components/Elements/Button/BasicButton';
import { useNavigate } from 'react-router';
import { PrograssBar } from 'components/Elements/PrograssBar';

export const GameResult = () => {
	const navigate = useNavigate();
	//임의 값 ->나중에는 내 rating 값 넣기
	let rating = 1550;
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

	//progressBar - info
	const [progressBarStates, setProgressBarStates] = useState([0, 100]); // 초기값은 0으로 설정하거나, 원하는 값으로 설정하세요.
	const endState = 100;

	// endState가 업데이트될 때 GSAP 애니메이션을 실행
	useEffect(() => {}, [progressBarStates]);

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
							<PrograssBar
								tier={
									rating >= 1400 && rating < 1600 ? 'bronze' : rating < 1800 ? 'silver' : 'gold'
								}
								rating={rating}
								endState={endState}
								progressBarStates={progressBarStates}
							/>
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
							<Button width='100%'>재도전?</Button>
						</div>
					</div>

					<div className='result-button'>
						<div className='result-button-width'>
							<Button width='100%'>한판 더?</Button>
						</div>
						<div className='result-button-width'>
							<Button
								width='100%'
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
