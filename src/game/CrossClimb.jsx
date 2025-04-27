import React, { useState } from 'react';
import Confetti from 'react-confetti';
import Nav from './nav'; // Ensure this is the correct path to your Nav component
import { motion } from 'framer-motion';

const CrossClimb = () => {
  const [step, setStep] = useState(0); // Track the current step
  const [won, setWon] = useState(false); // Track if the player has won
  const [incorrectSelection, setIncorrectSelection] = useState(null); // Track incorrect selection

  const correctPath = [2, 5, 6]; // Define the correct path (don’t reveal this in the UI)

  // Handle button clicks
  const handleSelect = (number) => {
    console.log('Selected number:', number);
    console.log('Current step:', step);

    // Check if the selected number is correct for the current step
    if (number === correctPath[step]) {
      // If it's the last step, the player wins
      if (step === correctPath.length - 1) {
        setWon(true);
        console.log('You won!');
      } else {
        // Move to the next step
        setStep(step + 1);
        setIncorrectSelection(null); // Clear any previous incorrect selection
      }
    } else {
      // If wrong, track the incorrect selection and reset step
      setIncorrectSelection(number);
      setStep(0); // Reset to the first step
      console.log('Wrong selection, reset step.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 flex flex-col">
      <Nav />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold mb-8 text-[#023e8a]">Cross Climb</h1>

        {!won ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-2xl text-center"
          >
            {/* Mountain SVG */}
            <svg viewBox="0 0 200 200" className="mx-auto mb-6 w-40 h-40">
              {/* More complex mountain path */}
              <polyline
                points="20,180 60,100 100,140 140,60 180,180"
                fill="none"
                stroke="#0077b6"
                strokeWidth="5"
              />
              {/* Indicate the path points */}
              <circle cx="60" cy="100" r="5" fill="#0077b6" />
              <circle cx="100" cy="140" r="5" fill="#0077b6" />
              <circle cx="140" cy="60" r="5" fill="#0077b6" />
            </svg>

            {/* Instructions for user */}
            <p className="text-gray-600">Climb the mountain by clicking the correct numbers.</p>

            {/* Buttons for selecting the numbers */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => handleSelect(n)}
                  className={`px-6 py-4 rounded-xl text-lg font-bold transition ${
                    incorrectSelection === n
                      ? 'bg-red-600 hover:bg-red-800' // Highlight wrong selection
                      : 'bg-[#0077b6] hover:bg-blue-900'
                  } text-white`}
                >
                  {n}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="text-center relative">
            <Confetti />
            <motion.h2 className="text-5xl font-bold text-blue-800 mt-6" animate={{ scale: [1, 1.2, 1] }}>
              🧗‍♂️ Climbed Successfully! 🧗‍♂️
            </motion.h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrossClimb;
