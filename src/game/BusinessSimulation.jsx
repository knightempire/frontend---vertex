import React, { useState } from 'react';
import Confetti from 'react-confetti';
import Nav from './nav';
import { motion } from 'framer-motion';

const generateBingoNumbers = () => {
  const numbers = Array.from({ length: 25 }, (_, i) => i + 1);
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return numbers;
};

const Bingo = () => {
  const [numbers, setNumbers] = useState(generateBingoNumbers());
  const [selected, setSelected] = useState([]);
  const [won, setWon] = useState(false);

  const handleSelect = (number) => {
    if (!selected.includes(number)) {
      const newSelected = [...selected, number];
      setSelected(newSelected);
      checkWin(newSelected);
    }
  };

  const checkWin = (selectedNumbers) => {
    const winningCombinations = [
      [0, 1, 2, 3, 4],   // Rows
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24],
      [0, 5, 10, 15, 20], // Columns
      [1, 6, 11, 16, 21],
      [2, 7, 12, 17, 22],
      [3, 8, 13, 18, 23],
      [4, 9, 14, 19, 24],
      [0, 6, 12, 18, 24], // Diagonals
      [4, 8, 12, 16, 20]
    ];

    const selectedIndices = numbers.map((num, index) => selectedNumbers.includes(num) ? index : -1).filter(i => i !== -1);

    for (let combo of winningCombinations) {
      if (combo.every(index => selectedIndices.includes(index))) {
        setWon(true);
        break;
      }
    }
  };

  const resetGame = () => {
    setNumbers(generateBingoNumbers());
    setSelected([]);
    setWon(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Nav />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold mb-8 text-[#003566]">Bingo Challenge</h1>

        {!won ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-4xl"
          >
            <div className="grid grid-cols-5 gap-4">
              {numbers.map((num, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleSelect(num)}
                  whileTap={{ scale: 0.9 }}
                  className={`w-16 h-16 flex items-center justify-center rounded-xl text-lg font-semibold 
                    ${selected.includes(num) ? 'bg-[#003566] text-white' : 'bg-[#ade8f4] text-[#003566] hover:bg-blue-300'}`}
                >
                  {num}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="text-center relative">
            <Confetti />
            <motion.h2 className="text-5xl font-bold text-blue-800 mt-6" animate={{ scale: [1, 1.2, 1] }}>
              🎉 BINGO! 🎉
            </motion.h2>
            <motion.button
              onClick={resetGame}
              whileHover={{ scale: 1.05 }}
              className="mt-8 px-6 py-3 bg-[#003566] text-white rounded-xl text-lg font-semibold shadow-lg hover:bg-blue-900 transition"
            >
              Play Again
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bingo;
