import 'assets/scss/Game.scss';

import { Route, Routes } from 'react-router-dom';
import { GameProvider } from './GameContext';
import { GameLoading } from './GameLoading';
import { GameMatch } from './GameMatch';
import { GamePlay } from './GamePlay';
import { GameResult } from './GameResult';

export const Game = () => {
	return (
		<GameProvider>
			<Routes>
				<Route path='/loading' element={<GameLoading />} />
				<Route path='/match' element={<GameMatch />} />
				<Route path='/play' element={<GamePlay />} />
				<Route path='/result' element={<GameResult />} />
			</Routes>
		</GameProvider>
	);
};
