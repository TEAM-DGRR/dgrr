// Game.tsx

import { Route, Routes } from "react-router-dom";
import { GameLoading } from "./GameLoading";
import { GameMatch } from "./GameMatch";
import { GamePlay } from "./GamePlay";

import { GameProvider } from "./GameContext";


export const Game = () => {
  return (
    <div>
      <GameProvider>
        <Routes>
          <Route path="/loading" element={<GameLoading />} />
          <Route path="/match" element={<GameMatch />} />
          <Route path="/play" element={<GamePlay />} />
        </Routes>
      </GameProvider>
    </div>
  );
};