import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import Nav from './nav'; // Your navbar

const generateRandomLetters = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return alphabet[Math.floor(Math.random() * alphabet.length)];
};

const generateWordSearchGrid = (words) => {
  const gridSize = 10; // Define grid size
  let grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
  const directions = ['horizontal', 'vertical', 'diagonal'];

  const placeWord = (word) => {
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const wordLength = word.length;

    let row, col, directionValid = false;
    while (!directionValid) {
      row = Math.floor(Math.random() * gridSize);
      col = Math.floor(Math.random() * gridSize);

      if (direction === 'horizontal' && col + wordLength <= gridSize) {
        // Check if space is free
        let canPlace = true;
        for (let i = 0; i < wordLength; i++) {
          if (grid[row][col + i] !== '') {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          // Place the word
          for (let i = 0; i < wordLength; i++) {
            grid[row][col + i] = word[i];
          }
          directionValid = true;
        }
      }

      if (direction === 'vertical' && row + wordLength <= gridSize) {
        let canPlace = true;
        for (let i = 0; i < wordLength; i++) {
          if (grid[row + i][col] !== '') {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          for (let i = 0; i < wordLength; i++) {
            grid[row + i][col] = word[i];
          }
          directionValid = true;
        }
      }

      if (direction === 'diagonal' && row + wordLength <= gridSize && col + wordLength <= gridSize) {
        let canPlace = true;
        for (let i = 0; i < wordLength; i++) {
          if (grid[row + i][col + i] !== '') {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          for (let i = 0; i < wordLength; i++) {
            grid[row + i][col + i] = word[i];
          }
          directionValid = true;
        }
      }
    }
  };

  words.forEach(word => placeWord(word));

  // Fill in remaining empty spaces with random letters
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col] === '') {
        grid[row][col] = generateRandomLetters();
      }
    }
  }

  return grid;
};

const WordSearchGame = () => {
  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [gameWords, setGameWords] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);

  const wordsList = ['CAT', 'DOG', 'RAT', 'TAR', 'ART', 'BAT', 'TAB', 'LOG']; // Can be dynamic or large list
  const [words, setWords] = useState([]);

  // Initialize the game grid and words
  useEffect(() => {
    const randomWords = wordsList.sort(() => 0.5 - Math.random()).slice(0, 5); // Pick 5 random words
    const newGrid = generateWordSearchGrid(randomWords);
    setGrid(newGrid);
    setWords(randomWords);
    setGameWords(randomWords);
  }, []);

  // Handle cell click to select letters
  const handleCellClick = (row, col) => {
    setSelectedCells(prev => {
      const newSelection = [...prev, { row, col }];
      return newSelection;
    });

    const selectedWord = getWordFromCells(selectedCells);
    if (gameWords.includes(selectedWord)) {
      setFoundWords(prev => [...prev, selectedWord]);
      if (foundWords.length + 1 === gameWords.length) {
        setIsGameWon(true);
      }
    }
  };

  // Convert selected cells into a word
  const getWordFromCells = (cells) => {
    return cells.map(cell => grid[cell.row][cell.col]).join('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Nav />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-5xl font-extrabold text-indigo-700 mb-8">📝 Word Search</h1>
        
        {!isGameWon ? (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl text-center space-y-8"
          >
            {/* Word Search Grid */}
            <div className="grid grid-cols-10 gap-1">
              {grid.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`p-4 bg-gray-200 hover:bg-gray-300 rounded-lg ${selectedCells.some(cell => cell.row === rowIndex && cell.col === colIndex) ? 'bg-blue-500 text-white' : ''}`}
                  >
                    {cell}
                  </button>
                ))
              ))}
            </div>

            <p className="text-lg mt-6">Words Found: {foundWords.join(', ')}</p>
          </motion.div>
        ) : (
          <div className="text-center relative">
            <Confetti />
            <motion.h2 className="text-5xl font-bold text-indigo-700 mt-6">🎉 You Found All Words!</motion.h2>
            <button
              onClick={() => window.location.reload()}
              className="mt-8 px-8 py-3 bg-blue-500 hover:bg-blue-700 text-white rounded-full font-semibold text-lg transition-all duration-300"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordSearchGame;
