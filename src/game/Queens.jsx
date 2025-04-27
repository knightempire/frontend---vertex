import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Install framer-motion for animations: npm install framer-motion
import Nav from './nav';

const QueensGame = () => {
  const size = 8;
  const [queens, setQueens] = useState([]);
  const [message, setMessage] = useState('');
  const [isWin, setIsWin] = useState(false);

  const isUnderAttack = (row, col) => {
    for (let [qRow, qCol] of queens) {
      if (qRow === row || qCol === col || Math.abs(qRow - row) === Math.abs(qCol - col)) {
        return true;
      }
    }
    return false;
  };

  const handleCellClick = (row, col) => {
    if (isWin) return; // Stop if already won

    if (queens.some(([qRow, qCol]) => qRow === row && qCol === col)) {
      setMessage('Queen already placed here!');
      return;
    }

    if (isUnderAttack(row, col)) {
      setMessage('❌ Cannot place Queen here! It is under attack.');
      return;
    }

    const newQueens = [...queens, [row, col]];
    setQueens(newQueens);
    setMessage('✅ Queen placed successfully!');

    if (newQueens.length === 8) {
      setIsWin(true);
      setMessage('🎉 Congratulations! You placed all 8 Queens!');
    }
  };

  const handleReset = () => {
    setQueens([]);
    setMessage('');
    setIsWin(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 flex flex-col">
      <Nav />
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center justify-center p-6">
     
      <h1 className="text-4xl font-bold text-[#0073b1] mb-4">Queens Game</h1>

      {/* Message display */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 px-6 py-3 rounded-full text-lg font-semibold 
            ${message.startsWith('✅') || message.startsWith('🎉') ? 'bg-green-400 text-white' : 'bg-red-400 text-white'}`}
        >
          {message}
        </motion.div>
      )}

      {/* Chess Board */}
      <div className="grid grid-cols-8 gap-1">
        {Array.from({ length: size * size }).map((_, index) => {
          const row = Math.floor(index / size);
          const col = index % size;
          const hasQueen = queens.some(([qRow, qCol]) => qRow === row && qCol === col);

          return (
            <motion.div
              key={index}
              onClick={() => handleCellClick(row, col)}
              className={`w-16 h-16 flex items-center justify-center text-2xl font-bold cursor-pointer select-none
                ${ (row + col) % 2 === 0 ? 'bg-white' : 'bg-gray-400' }
                ${ hasQueen ? 'text-red-600' : '' }
              `}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              {hasQueen ? '♛' : ''}
            </motion.div>
          );
        })}
      </div>

      {/* Reset Button */}
      <button 
        onClick={handleReset}
        className="mt-8 px-8 py-3 bg-[#0073b1] text-white font-semibold rounded-full hover:bg-[#005582] transition"
      >
        Reset Board
      </button>

      {/* Win Animation */}
      {isWin && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 z-50"
        >
          <div className="bg-white p-10 rounded-3xl text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-green-500 mb-4">🎉 You Win! 🎉</h2>
            <p className="text-xl mb-6">All 8 queens placed correctly.</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-green-500 hover:bg-green-700 text-white rounded-full font-semibold"
            >
              Play Again
            </button>
          </div>
        </motion.div>
      )}
    </div>
    </div>
  );
};

export default QueensGame;
