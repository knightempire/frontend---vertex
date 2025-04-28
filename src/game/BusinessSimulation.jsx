import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Nav from './nav'; // Your navbar

// Round configurations with question logic
const roundsConfig = [
  {
    label: 'Easy',
    question: 'Select all even numbers',
    timeLimit: 30,
    basePoints: 10,
    isCorrect: (n) => n % 2 === 0,
  },
  {
    label: 'Medium',
    question: 'Select all numbers divisible by 3',
    timeLimit: 25,
    basePoints: 20,
    isCorrect: (n) => n % 3 === 0,
  },
  {
    label: 'Hard',
    question: 'Select all prime numbers',
    timeLimit: 20,
    basePoints: 30,
    isCorrect: (n) => {
      if (n < 2) return false;
      for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
      }
      return true;
    },
  },
];

// Generate random numbers for the bingo board
const generateBingoNumbers = () => {
  const nums = Array.from({ length: 25 }, (_, i) => i + 1);
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  return nums;
};

// Simple confetti component
const Confetti = ({ active }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) return;
    
    // Generate random confetti particles
    const newParticles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20 - Math.random() * 80,
      size: 5 + Math.random() * 7,
      color: ['#FFC700', '#FF0058', '#2E7DAF', '#17B978'][Math.floor(Math.random() * 4)],
      speed: 3 + Math.random() * 7
    }));
    
    setParticles(newParticles);
    
    // Clean up
    return () => setParticles([]);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}vw`, y: `${p.y}vh` }}
          animate={{
            y: '110vh',
            rotate: [0, 360],
          }}
          transition={{
            duration: p.speed,
            ease: 'linear',
            repeat: Infinity,
            delay: Math.random() * 2
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: '2px',
          }}
        />
      ))}
    </div>
  );
};

// Results summary component
const ResultsSummary = ({ results, score, onPlayAgain, showAnimation }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg mt-10 mb-10"
    >
      <h1 className="text-3xl font-bold text-center text-[#003566] mb-6">Quiz Results</h1>
      <div className="space-y-6">
        {results.map((res, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: showAnimation ? 1 : 0, x: showAnimation ? 0 : -20 }}
            transition={{ delay: i * 0.3, duration: 0.5 }}
            className={`p-4 rounded-lg ${
              res.status === 'won' ? 'bg-green-50 border-l-4 border-green-500' : 
              'bg-red-50 border-l-4 border-red-500'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{res.label} Round</h2>
              <span className={`text-lg font-bold ${
                res.status === 'won' ? 'text-green-600' : 'text-red-600'
              }`}>
                {res.status === 'won' ? `+${res.earned} pts` : '0 pts'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {res.status === 'won' ? (
                <div className="space-y-1">
                  <div>Base points: {res.basePoints}</div>
                  <div>Time bonus: +{res.timeBonus}</div>
                  <div>Found all {res.correctAnswers} correct answers</div>
                </div>
              ) : res.status === 'timeout' ? (
                <div>Time ran out. Found {res.selectedAnswers} out of {res.correctAnswers} correct answers.</div>
              ) : (
                <div>Selected an incorrect number.</div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      <hr className="my-6 border-gray-200" />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: showAnimation ? 1 : 0.9, opacity: showAnimation ? 1 : 0 }}
        transition={{ delay: results.length * 0.3 + 0.2, duration: 0.5 }}
        className="bg-blue-100 p-6 rounded-xl"
      >
        <h2 className="text-2xl font-semibold text-[#003566] flex justify-between items-center">
          <span>Total Score:</span>
          <motion.span 
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ delay: results.length * 0.3 + 0.5, duration: 0.5 }}
            className="text-3xl font-bold"
          >
            {score} pts
          </motion.span>
        </h2>
      </motion.div>
      
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showAnimation ? 1 : 0, y: showAnimation ? 0 : 20 }}
        transition={{ delay: results.length * 0.3 + 0.8, duration: 0.5 }}
        onClick={onPlayAgain}
        className="mt-6 w-full py-3 bg-[#003566] text-white rounded-xl font-semibold shadow-lg"
      >
        Play Again
      </motion.button>
    </motion.div>
  );
};

const BingoQuiz = () => {
  const [roundIndex, setRoundIndex] = useState(0);
  const [numbers, setNumbers] = useState(generateBingoNumbers());
  const [selected, setSelected] = useState([]);
  const [won, setWon] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [wrongCell, setWrongCell] = useState(null);
  const [timer, setTimer] = useState(roundsConfig[0].timeLimit);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [animateResults, setAnimateResults] = useState(false);

  // Compute correct numbers for current round
  const correctNumbers = useMemo(
    () => numbers.filter((n) => roundsConfig[roundIndex].isCorrect(n)),
    [numbers, roundIndex]
  );

  // Reset the game
  const resetGame = () => {
    setRoundIndex(0);
    setNumbers(generateBingoNumbers());
    setSelected([]);
    setWon(false);
    setWrong(false);
    setWrongCell(null);
    setTimer(roundsConfig[0].timeLimit);
    setScore(0);
    setResults([]);
    setShowConfetti(false);
    setShowResults(false);
    setAnimateResults(false);
  };

  // Countdown timer
  useEffect(() => {
    if (won || wrong || timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(interval);
  }, [timer, won, wrong]);

  // Handle timeout
  useEffect(() => {
    if (timer === 0 && !won && !wrong) {
      endRound(false, 'timeout');
    }
  }, [timer, won, wrong]);

  const handleSelect = (num) => {
    if (won || wrong || timer <= 0 || selected.includes(num)) return;
    
    if (!roundsConfig[roundIndex].isCorrect(num)) {
      setWrong(true);
      setWrongCell(num);
      endRound(false, 'wrong');
    } else {
      const newSel = [...selected, num];
      setSelected(newSel);
      
      // Check if all correct numbers are selected
      if (newSel.length === correctNumbers.length) {
        setWon(true);
        setShowConfetti(true);
        endRound(true, 'won');
      }
    }
  };

  const endRound = (hasWon, status) => {
    const { basePoints, timeLimit } = roundsConfig[roundIndex];
    let earned = 0;
    let timeBonus = 0;
    
    if (hasWon) {
      // Calculate bonus points based on remaining time
      timeBonus = Math.floor((timer / timeLimit) * basePoints);
      earned = basePoints + timeBonus;
      setScore((s) => s + earned);
      
      // Show confetti for 3 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
    
    // Save round results
    setResults((r) => [
      ...r,
      { 
        label: roundsConfig[roundIndex].label, 
        status, 
        earned,
        basePoints,
        timeBonus: timeBonus,
        correctAnswers: correctNumbers.length,
        selectedAnswers: selected.length
      },
    ]);
  };

  // Advance to next round or show results
  const nextRound = () => {
    const next = roundIndex + 1;
    
    if (next < roundsConfig.length) {
      // Reset for next round
      setRoundIndex(next);
      setNumbers(generateBingoNumbers());
      setSelected([]);
      setWon(false);
      setWrong(false);
      setWrongCell(null);
      setTimer(roundsConfig[next].timeLimit);
    } else {
      // Show results
      setShowResults(true);
      // Delay the animation start
      setTimeout(() => {
        setAnimateResults(true);
      }, 200);
    }
  };

  // Results view
  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">

        <Nav />
        <div className="min-h-screen bg-blue-50 flex flex-col items-center">
        <Confetti active={animateResults} />
        <ResultsSummary 
          results={results} 
          score={score} 
          onPlayAgain={resetGame} 
          showAnimation={animateResults}
        />
      </div>
      </div>
    );
  }

  // Round UI
  const { label, question, timeLimit } = roundsConfig[roundIndex];
  const progress = (timer / timeLimit) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
      <Nav />
      <Confetti active={showConfetti} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 text-[#003566]">
            Round {roundIndex + 1}: {label}
          </h1>
          <p className="text-xl mb-4 text-gray-700">{question}</p>
          
          <div className="w-full max-w-md mx-auto mb-2">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: `${Math.max(0, progress)}%` }}
                transition={{ duration: 0.5, ease: 'linear' }}
                className={`h-full rounded-full ${
                  progress > 60 ? 'bg-green-500' : 
                  progress > 30 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>Selected: {selected.length}/{correctNumbers.length}</span>
              <span>{timer}s</span>
            </div>
          </div>
        </motion.div>

        {!won && !wrong && timer > 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-2xl rounded-3xl p-6 w-full max-w-lg"
          >
            <div className="grid grid-cols-5 gap-3">
              {numbers.map((num, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleSelect(num)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={
                    num === wrongCell 
                      ? { 
                          x: [0, -8, 8, -8, 8, 0],
                          backgroundColor: ['#ade8f4', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b'],
                        } 
                      : {}
                  }
                  transition={{ duration: 0.5 }}
                  className={`aspect-square flex items-center justify-center rounded-xl text-lg font-semibold 
                    ${selected.includes(num)
                      ? 'bg-[#003566] text-white'
                      : 'bg-[#ade8f4] text-[#003566] hover:bg-blue-300'}`}
                >
                  {num}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full"
          >
            <motion.h2
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className={`text-5xl font-bold mb-6 ${
                won ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {won ? '🎉 Correct! 🎉' : wrong ? '😞 Wrong!' : '⏰ Time Up!'}
            </motion.h2>
            
            <div className="text-xl text-gray-800 mb-6">
              {won && (
                <>
                  <p>You found all {correctNumbers.length} correct answers!</p>
                  <p className="mt-2">
                    <span className="font-semibold">
                      You earned {results[results.length - 1].earned} points
                    </span>
                    <br />
                    <span className="text-sm">
                      ({roundsConfig[roundIndex].basePoints} base + {results[results.length - 1].timeBonus} time bonus)
                    </span>
                  </p>
                </>
              )}
              {wrong && (
                <p>You selected an incorrect number.</p>
              )}
              {!won && !wrong && (
                <p>Time ran out! You found {selected.length} out of {correctNumbers.length} correct answers.</p>
              )}
            </div>
            
            <motion.button
              onClick={nextRound}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-[#003566] text-white rounded-xl text-lg font-semibold shadow-lg"
            >
              {roundIndex < roundsConfig.length - 1 ? 'Next Round' : 'See Results'}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BingoQuiz;