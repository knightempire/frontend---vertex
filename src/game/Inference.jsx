import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from './nav'; // Your navbar component

const TimedBingoGame = () => {
  // Game states
  const [gameState, setGameState] = useState('intro'); // 'intro', 'playing', 'results'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [questionResults, setQuestionResults] = useState([]);

  // Define the game questions with varying difficulty
  const questions = [
    {
      question: "Which animal makes the sound 'Meow'?",
      image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
      options: ['Dog', 'Cat', 'Bird', 'Fish'],
      correctAnswer: 'Cat',
      timeLimit: 10, // Easy - 10 seconds
      points: 10,
      difficulty: 'Easy'
    },
    {
      question: "What is the capital of France?",
      image: 'https://images.unsplash.com/photo-1499856871958-5b9357976b82',
      options: ['London', 'Paris', 'Rome', 'Berlin'],
      correctAnswer: 'Paris',
      timeLimit: 8, // Medium - 8 seconds
      points: 15,
      difficulty: 'Medium'
    },
    {
      question: "What is 14 × 19?",
      image: 'https://images.unsplash.com/photo-1564939558297-fc396f18e5c7',
      options: ['266', '246', '256', '276'],
      correctAnswer: '266',
      timeLimit: 6, // Hard - 6 seconds
      points: 25,
      difficulty: 'Hard'
    }
  ];

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      // Time's up - handle as wrong answer
      handleTimeUp();
    }
    
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  // Start the game
  const startGame = () => {
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setQuestionResults([]);
    setTimeLeft(questions[0].timeLimit);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    
    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    
    // Calculate points based on correct answer and remaining time
    if (correct) {
      const pointsEarned = questions[currentQuestion].points;
      setScore(prevScore => prevScore + pointsEarned);
    }
    
    // Store question result
    setQuestionResults(prev => [
      ...prev, 
      { 
        question: questions[currentQuestion].question,
        selectedAnswer: answer,
        correctAnswer: questions[currentQuestion].correctAnswer,
        isCorrect: correct,
        timeSpent: questions[currentQuestion].timeLimit - timeLeft,
        points: correct ? questions[currentQuestion].points : 0,
        difficulty: questions[currentQuestion].difficulty
      }
    ]);
    
    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prevQuestion => prevQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeLeft(questions[currentQuestion + 1].timeLimit);
      } else {
        setGameState('results');
      }
    }, 2000);
  };

  // Handle when time runs out
  const handleTimeUp = () => {
    setQuestionResults(prev => [
      ...prev, 
      { 
        question: questions[currentQuestion].question,
        selectedAnswer: "Time's up!",
        correctAnswer: questions[currentQuestion].correctAnswer,
        isCorrect: false,
        timeSpent: questions[currentQuestion].timeLimit,
        points: 0,
        difficulty: questions[currentQuestion].difficulty
      }
    ]);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prevQuestion => prevQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeLeft(questions[currentQuestion + 1].timeLimit);
      } else {
        setGameState('results');
      }
    }, 2000);
  };

  // Reset game
  const resetGame = () => {
    setGameState('intro');
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setQuestionResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex flex-col">
      <Nav />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-5xl font-extrabold text-indigo-700 mb-8">🎮 Timed Bingo Challenge</h1>

        {gameState === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl text-center space-y-8"
          >
            <h2 className="text-2xl font-semibold text-indigo-800">
              Welcome to the Timed Bingo Challenge!
            </h2>
            <p className="text-lg text-gray-700">
              Answer 3 questions of increasing difficulty before time runs out!
              <br/>The faster you answer correctly, the more points you earn.
            </p>
            
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div key={idx} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Question {idx + 1} ({q.difficulty})</span>
                  <span className="text-indigo-600">{q.timeLimit} seconds • {q.points} points</span>
                </div>
              ))}
            </div>
            
            <button
              onClick={startGame}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-800 text-white font-semibold rounded-full transition-all duration-300 text-lg"
            >
              Start Game
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div
            key={`question-${currentQuestion}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl text-center space-y-6"
          >
            {/* Timer and Progress */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">
                Question {currentQuestion + 1} of {questions.length}
                <span className="ml-2 text-sm text-gray-500">
                  {questions[currentQuestion].difficulty}
                </span>
              </div>
              <div className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-indigo-600'}`}>
                ⏱️ {timeLeft}s
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
            {questions[currentQuestion] && (
  <div 
    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000" 
    style={{ width: `${(timeLeft / questions[currentQuestion].timeLimit) * 100}%` }}
  ></div>
)}

            </div>
            
            {/* Question */}
            <div className="relative w-64 h-64 overflow-hidden rounded-2xl mx-auto">
              <img
                src={questions[currentQuestion].image}
                alt="Question Image"
                className="object-cover w-full h-full"
              />
            </div>
            
            <h2 className="text-2xl font-semibold text-indigo-800">
              {questions[currentQuestion].question}
            </h2>
            
            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {questions[currentQuestion].options.map((option, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl text-lg font-medium shadow transition-all duration-300
                    ${selectedAnswer === option 
                      ? (isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
                      : selectedAnswer !== null && option === questions[currentQuestion].correctAnswer
                        ? 'bg-green-500 text-white' 
                        : 'bg-white hover:bg-indigo-50'
                    }
                  `}
                >
                  {option}
                </motion.button>
              ))}
            </div>
            
            {/* Feedback Message */}
            <AnimatePresence>
              {isCorrect !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'} mt-4`}
                >
                  {isCorrect 
                    ? `🎉 Correct! +${questions[currentQuestion].points} points` 
                    : `❌ Incorrect! The correct answer is: ${questions[currentQuestion].correctAnswer}`
                  }
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {gameState === 'results' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-3xl text-center space-y-8"
          >
            <motion.h2
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1 }}
              className="text-4xl font-bold text-indigo-700"
            >
              {score >= 40 ? '🏆' : score >= 20 ? '🎯' : '👍'} Game Results
            </motion.h2>
            
            <div className="text-3xl font-bold text-indigo-600">
              Final Score: {score} points
            </div>
            
            <div className="space-y-4 mt-6">
              <h3 className="text-xl font-semibold text-gray-700">Question Summary:</h3>
              
              {questionResults.map((result, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className={`flex flex-col md:flex-row justify-between p-4 rounded-xl ${
                    result.isCorrect ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
                  }`}
                >
                  <div className="text-left mb-2 md:mb-0">
                    <div className="font-medium">Question {idx + 1} ({result.difficulty})</div>
                    <div className="text-sm text-gray-600 mt-1">{result.question}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>
                      {result.isCorrect ? `✓ Correct (+${result.points})` : '✗ Incorrect'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {result.timeSpent}s / {questions[idx].timeLimit}s
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="pt-6">
              <button
                onClick={resetGame}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-800 text-white font-semibold rounded-full transition-all duration-300 text-lg"
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

export default TimedBingoGame;