import React from 'react';
import 'assets/scss/TierInfoModal.scss';
import tierBronze from 'assets/images/tier_bronze.png';
import tierSilver from 'assets/images/tier_silver.png';
import tierGold from 'assets/images/tier_gold.png';

const Modal = ({ isOpen, closeModal }) => {
	const handleOverlayClick = (e) => {
		if (e.target === e.currentTarget) {
			closeModal();
		}
	};

	if (!isOpen) return null;

	//battleDetailList
	const tierList = [
		{
			tierName: 'bronze',
			tierImage: tierBronze,
			lowRating: 1400,
		},
		{
			tierName: 'silver',
			tierImage: tierSilver,
			lowRating: 1600,
		},
		{
			tierName: 'gold',
			tierImage: tierGold,
			lowRating: 1800,
		},
	];

	return (
		<div className='modal' onClick={handleOverlayClick}>
			<div className='modal-content'>
				<ul className='list-tier'>
					{tierList.map((item, index) => (
						<li key={index} className='tier-item'>
							<div className='tier-info'>
								<img className='tier-image' src={item.tierImage} alt='티어 이미지' />
								<div className='tier-descption'>
									<span className='tier-name'>{item.tierName}</span>
									<span className='tier-lowRating'>{item.lowRating}~</span>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Modal;
