import React from "react";
import { Route, Routes } from "react-router-dom";
import { Game } from "pages/GamePages/Game";

export const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/game" element={<Game />} />
      </Routes>
    </div>
  );
};
