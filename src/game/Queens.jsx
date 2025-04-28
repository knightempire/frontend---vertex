import React, { useState, useEffect } from 'react';
import { Clock, Award, AlertCircle, CheckCircle } from 'lucide-react';

const QueensChallenge = () => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [gameState, setGameState] = useState('intro'); // intro, playing, result
  const [score, setScore] = useState(0);
  const [challengeScores, setChallengeScores] = useState([0, 0, 0]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [message, setMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  
  // Challenge-specific states
  const [queens, setQueens] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [knightMoves, setKnightMoves] = useState([]);
  
  const challenges = [
    {
      title: "Place 4 Queens",
      description: "Place 4 queens on the board so that no queen can attack another.",
      size: 4,
      targetCount: 4,
      type: "queens",
      difficulty: "easy", // 60 seconds
      points: 100,
      solution: [[0,1], [1,3], [2,0], [3,2]], // One possible solution
    },
    {
      title: "Chess Knights Tour",
      description: "Create a knight's path that visits each cell exactly once. Start from the highlighted cell.",
      size: 5,
      targetCount: 25, // 5x5 board
      type: "knights",
      difficulty: "medium", // 120 seconds
      points: 200,
      startPosition: [0, 0],
    },
    {
      title: "Queens Domination",
      description: "Place the minimum number of queens to attack or occupy every cell on the board.",
      size: 6,
      targetCount: 6, // Minimum queens needed for 6x6
      type: "domination",
      difficulty: "hard", // 180 seconds
      points: 300,
    }
  ];

  // Set timer based on difficulty
  const getDifficultyTime = (difficulty) => {
    switch(difficulty) {
      case "easy": return 60;
      case "medium": return 120;
      case "hard": return 180;
      default: return 60;
    }
  };

  const startGame = () => {
    setGameState('playing');
    resetChallenge();
    setTimeLeft(getDifficultyTime(challenges[0].difficulty));
  };

  const resetChallenge = () => {
    setQueens([]);
    setSelectedCells([]);
    setKnightMoves([]);
    setMessage('');
    setShowFeedback(false);
  };

  const nextChallenge = () => {
    setCurrentChallenge(currentChallenge + 1);
    resetChallenge();
    setTimeLeft(getDifficultyTime(challenges[currentChallenge + 1].difficulty));
  };

  // QUEENS CHALLENGE LOGIC
  const isUnderAttack = (row, col, queensArray = queens) => {
    for (let [qRow, qCol] of queensArray) {
      if (qRow === row && qCol === col) return true; // Same position
      if (qRow === row || qCol === col) return true; // Same row or column
      if (Math.abs(qRow - row) === Math.abs(qCol - col)) return true; // Same diagonal
    }
    return false;
  };

  // For Queens Domination challenge
  const getAllAttackedCells = (queensArray, size) => {
    const attacked = new Set();
    
    for (let [qRow, qCol] of queensArray) {
      // Add queen position
      attacked.add(`${qRow},${qCol}`);
      
      // Add all cells in the same row, column, and diagonals
      for (let i = 0; i < size; i++) {
        // Row
        attacked.add(`${qRow},${i}`);
        // Column
        attacked.add(`${i},${qCol}`);
        
        // Diagonals (all 4 directions)
        const offsets = [-i, i];
        for (let rowOffset of offsets) {
          for (let colOffset of offsets) {
            const newRow = qRow + rowOffset;
            const newCol = qCol + colOffset;
            if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
              if (Math.abs(rowOffset) === Math.abs(colOffset)) {
                attacked.add(`${newRow},${newCol}`);
              }
            }
          }
        }
      }
    }
    
    return attacked;
  };

  // KNIGHTS TOUR LOGIC
  const isValidKnightMove = (fromRow, fromCol, toRow, toCol) => {
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    return (rowDiff === 1 && colDiff === 2) || (rowDiff === 2 && colDiff === 1);
  };

  const handleCellClick = (row, col) => {
    if (showFeedback) return;
    
    const currentQ = challenges[currentChallenge];
    
    if (currentQ.type === "queens" || currentQ.type === "domination") {
      // Handle queens placement
      if (queens.some(([qRow, qCol]) => qRow === row && qCol === col)) {
        // Remove queen if already placed
        setQueens(queens.filter(([qRow, qCol]) => !(qRow === row && qCol === col)));
        setMessage('Queen removed.');
        return;
      }
      
      if (currentQ.type === "queens" && isUnderAttack(row, col)) {
        setMessage('❌ Cannot place Queen here! It is under attack.');
        return;
      }
      
      const newQueens = [...queens, [row, col]];
      setQueens(newQueens);
      setMessage('✅ Queen placed successfully!');
      
      // Check win condition
      if (currentQ.type === "queens" && newQueens.length === currentQ.targetCount) {
        // Check if the solution is valid
        let valid = true;
        for (let i = 0; i < newQueens.length; i++) {
          for (let j = i + 1; j < newQueens.length; j++) {
            const [row1, col1] = newQueens[i];
            const [row2, col2] = newQueens[j];
            if (row1 === row2 || col1 === col2 || Math.abs(row1 - row2) === Math.abs(col1 - col2)) {
              valid = false;
              break;
            }
          }
          if (!valid) break;
        }
        
        if (valid) {
          // Instead of just calculating the score, also provide immediate feedback with "Next Challenge" button
          calculateScore();
        } else {
          setMessage('❌ Queens can attack each other! Try again.');
        }
      } else if (currentQ.type === "domination") {
        // Check if all cells are covered
        const attackedCells = getAllAttackedCells(newQueens, currentQ.size);
        const totalCells = currentQ.size * currentQ.size;
        
        if (attackedCells.size === totalCells) {
          if (newQueens.length <= currentQ.targetCount) {
            calculateScore();
          } else {
            setMessage(`✅ All cells covered, but try using fewer queens (target: ${currentQ.targetCount}).`);
          }
        }
      }
    } else if (currentQ.type === "knights") {
      // Knights tour logic
      if (knightMoves.length === 0) {
        // First move must be from the starting position
        if (row === currentQ.startPosition[0] && col === currentQ.startPosition[1]) {
          setKnightMoves([[row, col]]);
          setSelectedCells([[row, col]]);
        } else {
          setMessage('Start from the highlighted cell!');
        }
        return;
      }
      
      // Check if cell is already visited
      if (selectedCells.some(([r, c]) => r === row && c === col)) {
        setMessage('❌ Cell already visited!');
        return;
      }
      
      // Check if move is valid knight move
      const [lastRow, lastCol] = knightMoves[knightMoves.length - 1];
      if (isValidKnightMove(lastRow, lastCol, row, col)) {
        const newMoves = [...knightMoves, [row, col]];
        setKnightMoves(newMoves);
        setSelectedCells([...selectedCells, [row, col]]);
        
        // Check if all cells are visited
        if (newMoves.length === currentQ.targetCount) {
          calculateScore();
        }
      } else {
        setMessage('❌ Invalid knight move!');
      }
    }
  };

  const calculateScore = () => {
    const currentQ = challenges[currentChallenge];
    
    // Calculate score based on time left and difficulty
    const timeBonus = Math.floor(timeLeft * 0.5);
    const challengeScore = Math.floor(currentQ.points + timeBonus);
    
    const newChallengeScores = [...challengeScores];
    newChallengeScores[currentChallenge] = challengeScore;
    setChallengeScores(newChallengeScores);
    
    setFeedbackType('correct');
    setShowFeedback(true);
    
    if (currentChallenge === challenges.length - 1) {
      const totalScore = newChallengeScores.reduce((sum, score) => sum + score, 0);
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
        if (currentChallenge < challenges.length - 1) {
          nextChallenge();
        } else {
          const totalScore = challengeScores.reduce((sum, score) => sum + score, 0);
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

  // Improved board rendering with responsive design
  const renderBoard = () => {
    const currentQ = challenges[currentChallenge];
    const size = currentQ.size;
    
    // Create the grid template for responsive sizing
    const gridTemplateColumns = `repeat(${size}, minmax(0, 1fr))`;
    
    return (
      <div 
        className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-xl" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns,
          gap: '2px' 
        }}>
        {Array.from({ length: size * size }).map((_, index) => {
          const row = Math.floor(index / size);
          const col = index % size;
          
          let cellContent = '';
          let extraClasses = '';
          
          if (currentQ.type === "queens" || currentQ.type === "domination") {
            const hasQueen = queens.some(([qRow, qCol]) => qRow === row && qCol === col);
            if (hasQueen) {
              cellContent = '♛';
              extraClasses = 'text-purple-700';
            }
            
            // For domination, show which cells are under attack
            if (currentQ.type === "domination" && !hasQueen) {
              if (isUnderAttack(row, col)) {
                extraClasses = 'bg-red-200';
              }
            }
          } else if (currentQ.type === "knights") {
            // Highlight starting position
            if (knightMoves.length === 0 && row === currentQ.startPosition[0] && col === currentQ.startPosition[1]) {
              extraClasses = 'bg-green-200 ring-2 ring-green-500';
            }
            
            // Show knight's path
            const moveIndex = knightMoves.findIndex(([r, c]) => r === row && c === col);
            if (moveIndex !== -1) {
              cellContent = `${moveIndex + 1}`;
              extraClasses = 'bg-blue-200 font-bold';
            }
            
            // Show knight on last position
            if (knightMoves.length > 0 && moveIndex === knightMoves.length - 1) {
              cellContent = '♞';
              extraClasses = 'text-blue-700 bg-blue-100';
            }
          }
          
          // Responsive cell sizing
          return (
            <div
              key={index}
              onClick={() => handleCellClick(row, col)}
              className={`
                flex items-center justify-center 
                cursor-pointer select-none transition
                aspect-square text-lg sm:text-xl md:text-2xl font-bold
                ${ (row + col) % 2 === 0 ? 'bg-white' : 'bg-gray-300' }
                ${extraClasses}
                hover:opacity-80 active:opacity-70
              `}
            >
              {cellContent}
            </div>
          );
        })}
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
          <span>Perfect! Challenge completed successfully!</span>
        </div>
      );
      bgColor = 'bg-green-500';
    } else if (feedbackType === 'timeout') {
      content = (
        <div className="flex items-center justify-center space-x-2">
          <Clock className="w-6 h-6" />
          <span>Time's up!</span>
        </div>
      );
      bgColor = 'bg-yellow-500';
    }
    
    return (
      <div className={`mt-6 p-4 rounded-lg text-white text-center ${bgColor}`}>
        {content}
        {feedbackType === 'correct' && (
          <div className="mt-2 text-lg font-bold">
            Points earned: {challengeScores[currentChallenge]}
          </div>
        )}
        {currentChallenge < challenges.length - 1 && (
          <button
            onClick={nextChallenge}
            className="mt-4 bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors"
          >
            Next Challenge
          </button>
        )}
      </div>
    );
  };

  const renderIntro = () => (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 max-w-md md:max-w-lg mx-auto text-center">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4">Queens Challenge</h1>
      <p className="text-gray-600 mb-6">
        Test your chess skills with three challenging puzzles!
      </p>
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between border-b pb-2">
          <span className="font-medium">Challenges</span>
          <span className="font-bold">{challenges.length}</span>
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
          <span className="font-bold">{challenges.reduce((sum, c) => sum + c.points, 0)} + time bonuses</span>
        </div>
      </div>
      <button
        onClick={startGame}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full sm:w-auto"
      >
        Start Challenge
      </button>
    </div>
  );

  const renderPlaying = () => {
    const currentQ = challenges[currentChallenge];
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <div className="text-sm font-medium text-gray-500">
            Challenge {currentChallenge + 1} of {challenges.length}
          </div>
          <div className="flex items-center gap-2">
            {renderDifficultyBadge(currentQ.difficulty)}
            <div className={`flex items-center gap-1 ${
              timeLeft < 10 ? 'text-red-600' : 'text-blue-600'
            }`}>
              <Clock className="w-5 h-5" />
              <span className="font-mono font-bold">{timeLeft}s</span>
            </div>
          </div>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-2">{currentQ.title}</h2>
        <p className="text-gray-600 mb-4 sm:mb-6">{currentQ.description}</p>
        
        {/* Chess board */}
        {renderBoard()}
        
        {/* Message display */}
        {message && !showFeedback && (
          <div className={`mt-4 sm:mt-6 px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-center text-base sm:text-lg font-semibold 
            ${message.startsWith('✅') ? 'bg-green-400 text-white' : 'bg-blue-100 text-blue-800'}`}
          >
            {message}
          </div>
        )}
        
        {renderFeedback()}
        
        {/* Game controls */}
        <div className="flex justify-center mt-4 sm:mt-6 gap-4">
          {/* Reset button only shown when not showing feedback */}
          {!showFeedback && (
            <button
              onClick={resetChallenge}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Reset Board
            </button>
          )}
          
          {/* Next Challenge button appears when a challenge is correctly solved */}
          {feedbackType === 'correct' && currentChallenge < challenges.length - 1 && (
            <button
              onClick={nextChallenge}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
            >
              Next Challenge
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderResult = () => (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md md:max-w-lg mx-auto text-center">
      <div className="mb-6">
        <Award className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4">Challenges Complete!</h1>
      <p className="text-gray-600 mb-6">
        You've completed all chess challenges. Here's your score:
      </p>
      
      <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-6 sm:mb-8">
        {score} points
      </div>
      
      <div className="space-y-4 mb-6 sm:mb-8">
        {challenges.map((challenge, idx) => (
          <div key={idx} className="flex items-center justify-between border-b pb-3">
            <div className="text-left">
              <div className="font-medium">{challenge.title}</div>
              <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                {renderDifficultyBadge(challenge.difficulty)}
                <span className="ml-2">{challenge.points} base points</span>
              </div>
            </div>
            <div className="font-bold text-lg sm:text-xl">{challengeScores[idx]}</div>
          </div>
        ))}
      </div>
      
      <button
        onClick={() => {
          setGameState('intro');
          setCurrentChallenge(0);
          setScore(0);
          setChallengeScores([0, 0, 0]);
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full sm:w-auto"
      >
        Play Again
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 py-4 sm:py-8 px-2 sm:px-4">
      <div className="container mx-auto">
        {gameState === 'intro' && renderIntro()}
        {gameState === 'playing' && renderPlaying()}
        {gameState === 'result' && renderResult()}
      </div>
    </div>
  );
};

export default QueensChallenge;