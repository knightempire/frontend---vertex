import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Clock, Award, Mountain } from 'lucide-react';
import Nav from './nav'; // Your navbar

const CrossClimb = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [gameState, setGameState] = useState('intro'); // intro, playing, result
  const [selectedPath, setSelectedPath] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [climbScores, setClimbScores] = useState([0, 0, 0]);
  
  const climbChallenges = [
    {
      question: "Find the safe path up the mountain",
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      correctPath: [2, 5, 8],
      difficulty: "easy", // 45 seconds
      gridSize: 3,
      points: 100,
      hint: "Start from the lower rocky path"
    },
    {
      question: "Navigate through the ice wall",
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      correctPath: [3, 7, 11],
      difficulty: "medium", // 30 seconds
      gridSize: 4,
      points: 150,
      hint: "Follow the diagonal cracked ice"
    },
    {
      question: "Cross the final ridge to summit",
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      correctPath: [1, 5, 9],
      difficulty: "hard", // 20 seconds
      gridSize: 3,
      points: 200,
      hint: "The winds are strong on the edges"
    }
  ];

  // Set timer based on difficulty
  const getDifficultyTime = (difficulty) => {
    switch(difficulty) {
      case "easy": return 45;
      case "medium": return 30;
      case "hard": return 20;
      default: return 30;
    }
  };

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(getDifficultyTime(climbChallenges[0].difficulty));
    setSelectedPath([]);
  };

  const nextChallenge = () => {
    setShowFeedback(false);
    setCurrentQuestion(currentQuestion + 1);
    setSelectedPath([]);
    setTimeLeft(getDifficultyTime(climbChallenges[currentQuestion + 1].difficulty));
  };

  const selectStep = (number) => {
    const currentChallenge = climbChallenges[currentQuestion];
    const expectedStep = currentChallenge.correctPath[selectedPath.length];
    
    if (number === expectedStep) {
      const newPath = [...selectedPath, number];
      setSelectedPath(newPath);
      
      // Check if path is complete
      if (newPath.length === currentChallenge.correctPath.length) {
        calculateScore();
      }
    } else {
      // Wrong step, show feedback
      setFeedbackType('incorrect');
      setShowFeedback(true);
      
      // Reset path after delay
      setTimeout(() => {
        setSelectedPath([]);
        setShowFeedback(false);
      }, 1500);
    }
  };

  const calculateScore = () => {
    const currentChallenge = climbChallenges[currentQuestion];
    
    // Calculate score based on time left
    const timeBonus = Math.floor(timeLeft * 2);
    const challengeScore = Math.floor(currentChallenge.points + timeBonus);
    
    const newClimbScores = [...climbScores];
    newClimbScores[currentQuestion] = challengeScore;
    setClimbScores(newClimbScores);
    
    setFeedbackType('correct');
    setShowFeedback(true);
    
    if (currentQuestion === climbChallenges.length - 1) {
      const totalScore = newClimbScores.reduce((sum, score) => sum + score, 0);
      setScore(totalScore);
      setTimeout(() => {
        setGameState('result');
      }, 2000);
    }
  };

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing' || timeLeft === null) return;
    
    if (timeLeft <= 0) {
      setFeedbackType('timeout');
      setShowFeedback(true);
      setTimeout(() => {
        if (currentQuestion < climbChallenges.length - 1) {
          nextChallenge();
        } else {
          const totalScore = climbScores.reduce((sum, score) => sum + score, 0);
          setScore(totalScore);
          setGameState('result');
        }
      }, 2000);
      return;
    }
    
    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timerId);
  }, [timeLeft, gameState]);

  const renderGrid = () => {
    const currentChallenge = climbChallenges[currentQuestion];
    const gridSize = currentChallenge.gridSize;
    const gridClass = `grid-cols-${gridSize === 3 ? "3" : "4"}`;
    
    return (
      <div className={`grid ${gridClass} gap-3 mt-6`}>
        {currentChallenge.options.map((option) => {
          const stepIndex = selectedPath.indexOf(option);
          const isSelected = stepIndex !== -1;
          
          return (
            <motion.button
              key={option}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => selectStep(option)}
              disabled={isSelected || showFeedback}
              className={`p-6 rounded-lg text-center font-bold text-lg transition-all ${
                isSelected 
                  ? `bg-blue-600 text-white border-4 border-blue-300` 
                  : `bg-white text-blue-900 border-2 hover:border-blue-500 border-blue-200`
              }`}
            >
              {isSelected ? (stepIndex + 1) : option}
            </motion.button>
          );
        })}
      </div>
    );
  };

  const renderMountainSVG = () => {
    const currentChallenge = climbChallenges[currentQuestion];
    
    return (

      <div className="mb-6">
        <svg viewBox="0 0 200 120" className="mx-auto w-full max-w-md">
          {/* Base mountain */}
          <polygon 
            points="10,110 100,20 190,110" 
            fill="#e0e7ff" 
            stroke="#4b5563" 
            strokeWidth="2"
          />
          
          {/* Mountain details based on difficulty */}
          {currentChallenge.difficulty === "easy" && (
            <>
              <polyline 
                points="40,90 60,70 80,85 100,65 120,80 160,60" 
                fill="none" 
                stroke="#6b7280" 
                strokeWidth="2" 
                strokeDasharray="2"
              />
              <circle cx="60" cy="70" r="3" fill="#3b82f6" />
              <circle cx="100" cy="65" r="3" fill="#3b82f6" />
              <circle cx="160" cy="60" r="3" fill="#3b82f6" />
            </>
          )}
          
          {currentChallenge.difficulty === "medium" && (
            <>
              <polyline 
                points="40,90 70,75 90,85 120,60 150,70 170,50" 
                fill="none" 
                stroke="#4b5563" 
                strokeWidth="3" 
                strokeDasharray="4"
              />
              <path 
                d="M50,100 Q65,85 80,95 Q95,80 110,90 Q125,75 140,85" 
                fill="none" 
                stroke="#9ca3af" 
                strokeWidth="1.5"
              />
              <circle cx="70" cy="75" r="3" fill="#2563eb" />
              <circle cx="120" cy="60" r="3" fill="#2563eb" />
              <circle cx="170" cy="50" r="3" fill="#2563eb" />
            </>
          )}
          
          {currentChallenge.difficulty === "hard" && (
            <>
              <polyline 
                points="30,100 50,80 70,90 100,40 130,65 160,45" 
                fill="none" 
                stroke="#374151" 
                strokeWidth="3" 
                strokeDasharray="1"
              />
              <path 
                d="M40,110 Q60,80 70,100 Q90,60 110,80 Q130,50 150,70 Q170,40 180,60" 
                fill="none" 
                stroke="#6b7280" 
                strokeWidth="2"
              />
              <path 
                d="M50,90 L65,80 L80,70 L95,60 L110,50 L125,40" 
                fill="none" 
                stroke="#dc2626" 
                strokeWidth="1.5" 
                strokeDasharray="4 2"
              />
              <circle cx="50" cy="80" r="3" fill="#1d4ed8" />
              <circle cx="100" cy="40" r="3" fill="#1d4ed8" />
              <circle cx="160" cy="45" r="3" fill="#1d4ed8" />
            </>
          )}
          
          {/* Flag at summit */}
          <polygon 
            points="100,20 100,10 110,15 100,20" 
            fill="#ef4444" 
          />
          <line 
            x1="100" y1="20" x2="100" y2="10" 
            stroke="#374151" 
            strokeWidth="1.5"
          />
        </svg>
      </div>

    );
  };

  const renderFeedback = () => {
    if (!showFeedback) return null;
    
    let content;
    let bgColor;
    
    if (feedbackType === 'correct') {
      content = (
        <div className="flex items-center justify-center space-x-2">
          <CheckCircle className="w-6 h-6" />
          <span>Perfect climb! You found the right path!</span>
        </div>
      );
      bgColor = 'bg-green-500';
    } else if (feedbackType === 'incorrect') {
      content = (
        <div className="flex items-center justify-center space-x-2">
          <AlertCircle className="w-6 h-6" />
          <span>Slipped! That's not the right step.</span>
        </div>
      );
      bgColor = 'bg-red-500';
    } else if (feedbackType === 'timeout') {
      content = (
        <div className="flex items-center justify-center space-x-2">
          <Clock className="w-6 h-6" />
          <span>Time's up! The weather changed.</span>
        </div>
      );
      bgColor = 'bg-yellow-500';
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-6 p-4 rounded-lg text-white text-center ${bgColor}`}
      >
        {content}
        {feedbackType === 'correct' && (
          <div className="mt-2 text-lg font-bold">
            Points earned: {climbScores[currentQuestion]}
          </div>
        )}
        {(feedbackType === 'correct' || feedbackType === 'timeout') && currentQuestion < climbChallenges.length - 1 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextChallenge}
            className="mt-4 bg-white text-blue-600 px-6 py-2 rounded-lg font-bold"
          >
            Next Challenge
          </motion.button>
        )}
      </motion.div>
    );
  };

  const renderDifficultyBadge = (difficulty) => {
    let color = "bg-green-100 text-green-800";
    if (difficulty === "medium") color = "bg-yellow-100 text-yellow-800";
    if (difficulty === "hard") color = "bg-red-100 text-red-800";
    
    return (
      <span className={`px-2 py-1 rounded-full text-sm font-medium ${color}`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  };

  const renderIntro = () => (
    
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto text-center"
    >
      <div className="mb-6">
        <Mountain className="w-16 h-16 text-blue-600 mx-auto" />
      </div>
      <h1 className="text-3xl font-bold text-blue-800 mb-4">Cross Climb Challenge</h1>
      <p className="text-gray-600 mb-6">
        Navigate the correct path up the mountain at each stage.
        One wrong step and you'll have to restart the climb!
      </p>
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between border-b pb-2">
          <span className="font-medium">Challenges</span>
          <span className="font-bold">{climbChallenges.length}</span>
        </div>
        <div className="flex items-center justify-between border-b pb-2">
          <span className="font-medium">Difficulty</span>
          <div className="flex space-x-2">
            {renderDifficultyBadge("easy")}
            {renderDifficultyBadge("medium")}
            {renderDifficultyBadge("hard")}
          </div>
        </div>
        <div className="flex items-center justify-between border-b pb-2">
          <span className="font-medium">Max Points</span>
          <span className="font-bold">{climbChallenges.reduce((sum, q) => sum + q.points, 0)} + time bonuses</span>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startGame}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
      >
        Start Climbing
      </motion.button>
    </motion.div>
  );

  const renderPlaying = () => {
    const currentChallenge = climbChallenges[currentQuestion];
    const progressPercent = (selectedPath.length / currentChallenge.correctPath.length) * 100;
    
    return (

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium text-gray-500">
            Challenge {currentQuestion + 1} of {climbChallenges.length}
          </div>
          <div className="flex items-center">
            {renderDifficultyBadge(currentChallenge.difficulty)}
            <div className={`ml-4 flex items-center gap-1 ${
              timeLeft < 10 ? 'text-red-600' : 'text-blue-600'
            }`}>
              <Clock className="w-5 h-5" />
              <span className="font-mono font-bold">{timeLeft}s</span>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-blue-800 mb-2">{currentChallenge.question}</h2>
        <p className="text-gray-600 mb-2">Hint: {currentChallenge.hint}</p>
        
        {renderMountainSVG()}
        
        <div className="mb-4 bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        
        <p className="text-blue-800 font-medium mb-2">
          Progress: Step {selectedPath.length} of {currentChallenge.correctPath.length}
        </p>
        
        {renderGrid()}
        {renderFeedback()}
      </motion.div>

    );
  };

  const renderResult = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto text-center"
    >
      <div className="mb-6">
        <Award className="w-16 h-16 text-yellow-500 mx-auto" />
      </div>
      <h1 className="text-3xl font-bold text-blue-800 mb-4">Summit Reached!</h1>
      <p className="text-gray-600 mb-6">
        You've completed all climbing challenges. Here's your score:
      </p>
      
      <div className="text-5xl font-bold text-blue-600 mb-8">
        {score} points
      </div>
      
      <div className="space-y-4 mb-8">
        {climbChallenges.map((challenge, idx) => (
          <div key={idx} className="flex items-center justify-between border-b pb-3">
            <div className="text-left">
              <div className="font-medium">Challenge {idx + 1}</div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                {renderDifficultyBadge(challenge.difficulty)}
                <span className="ml-2">{challenge.points} base points</span>
              </div>
            </div>
            <div className="font-bold text-xl">{climbScores[idx]}</div>
          </div>
        ))}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setGameState('intro');
          setCurrentQuestion(0);
          setScore(0);
          setClimbScores([0, 0, 0]);
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
      >
        Climb Again
      </motion.button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
      <Nav />
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 py-8 px-4">
      <div className="container mx-auto">
        {gameState === 'intro' && renderIntro()}
        {gameState === 'playing' && renderPlaying()}
        {gameState === 'result' && renderResult()}
      </div>
    </div>
    </div>
  );
};

export default CrossClimb;