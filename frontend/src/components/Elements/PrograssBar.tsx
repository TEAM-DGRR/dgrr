import React from 'react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import 'assets/scss/PrograssBar.scss';

interface IPrograssBarProps {
	tier?: string;
	rating?: number;
	endState?: number;
	progressBarStates?: number[];
}

export const PrograssBar = (props: IPrograssBarProps) => {
	const progressBarContainerRef = useRef(null);
	const progressBarRef = useRef<any>(null);
	const progressBarTextRef = useRef(null);

	const { rating = 0, tier = '', endState = 100, progressBarStates = [0, 0] } = props;
	let time = 0;

	useEffect(() => {
		progressBarStates.forEach((state) => {
			let Time = 20;
			setTimeout(() => {
				if (state === endState) {
					gsap.to(progressBarRef.current, {
						x: `${state}%`,
						duration: 2,
						// backgroundColor: '#ffd700',
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
	}, [progressBarStates, endState]);

	return (
		<div className={classNames('progress-bar__container', tier)} ref={progressBarContainerRef}>
			<div className={classNames('progress-bar', tier)} ref={progressBarRef}>
				<span className={classNames('progress-bar__text', tier)} ref={progressBarTextRef}>
					MAX
				</span>
			</div>
		</div>
	);
};
