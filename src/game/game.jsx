import React from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from './nav';

const Game = () => {
  const navigate = useNavigate();

  const games = [
    { name: 'Bingo', path: '/game/business-simulation' },
    { name: 'Queens', path: '/game/queens' },
    { name: 'CrossClimb', path: '/game/crossclimb' },
    { name: 'Pinpoint', path: '/game/inference' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Nav />
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold text-[#0073b1] mb-10">Choose Your Game</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game, index) => (
            <button
              key={index}
              onClick={() => navigate(game.path)}
              className="bg-white shadow-lg rounded-2xl p-6 hover:bg-[#0073b1] hover:text-white transition-all duration-300 text-xl font-semibold"
            >
              {game.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
