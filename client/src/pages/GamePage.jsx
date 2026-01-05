import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Confetti from 'react-confetti';
import './Game.css';
import { CircularProgress, Box } from '@mui/material';

const WINNING_SCORE = 25;
const GAME_DURATION = 45;

const wasteTypes = [
  { text: '🍎apple', type: 'wet' }, { text: '🍕Leftoverfood', type: 'wet' },
  { text: '📰Paper', type: 'dry' }, { text: '🍾PlasticBottle', type: 'dry' },
  { text: '📦CardBoard', type: 'dry' }, { text: '🥫Can', type: 'dry' },
  { text: '🥬Vegetable waste', type: 'wet' },
];

function GamePage({ gameId }) {
  const { user, updateUser, loading } = useAuth();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState('instructions');
  const [fallingItem, setFallingItem] = useState(null);
  const [showConfettiOnWin, setShowConfettiOnWin] = useState(false);
  const navigate = useNavigate();
  const requestRef = useRef();
  const gameAreaRef = useRef(null);
  const scoreRef = useRef(score);
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => { scoreRef.current = score; }, [score]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setFallingItem(null);
    setGameState('playing');
    setShowConfettiOnWin(false);
    hasSubmitted.current = false;
  };

  const spawnNewItem = () => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;
    const newItemTemplate = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
    const newItem = {
      ...newItemTemplate,
      id: Date.now(),
      x: Math.random() * (gameArea.offsetWidth - 60),
      y: -60,
      speed: Math.random() * 1.5 + 1.5
    };
    setFallingItem(newItem);
  };
  
  // FIX: This function is now memoized with useCallback
  const endGame = useCallback((didWin) => {
    if (gameState !== 'playing' || !user) return;
    if (!didWin) {
      setGameState('lost');
      return;
    }
    setGameState('won');
    setShowConfettiOnWin(true);
  }, [gameState, user]); // Add dependencies for the useCallback hook

  useEffect(() => {
    if (gameState === 'won' && user && !hasSubmitted.current) {
      const submitScore = async () => {
        hasSubmitted.current = true;

        const optimisticUser = {
          ...user,
          points: user.points + 25,
          completedChallenges: [...user.completedChallenges, gameId],
        };
        updateUser(optimisticUser);

        const token = localStorage.getItem('token');
        try {
          const response = await axios.post(`http://127.0.0.1:8000/api/challenges/submit`, {
            userId: user.id,
            challengeId: gameId
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log("Server response on submission:", response.data);
          updateUser(response.data);
          console.log("Server state synced successfully.");
        } catch (err) {
          console.error("Failed to submit result to server:", err);
          hasSubmitted.current = false;
        }
      };
      submitScore();
    }
  }, [gameState, user, gameId, updateUser]);

  const handleBinClick = (binType) => {
    if (!fallingItem || gameState !== 'playing') return;

    setScore(currentScore => {
      const isCorrect = fallingItem.type === binType;
      const newScore = isCorrect ? currentScore + 1 : Math.max(0, currentScore - 1);
      if (newScore >= WINNING_SCORE) {
        endGame(true);
      }
      return newScore;
    });

    if (scoreRef.current < WINNING_SCORE) {
      spawnNewItem();
    }
  };

  // FIX: The dependencies have been changed to no longer include endGame
  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          endGame(scoreRef.current >= WINNING_SCORE);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, endGame]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (!fallingItem) spawnNewItem();
    const animate = () => {
      setFallingItem(currentItem => {
        if (!currentItem) return null;
        const gameArea = gameAreaRef.current;
        if (!gameArea) return currentItem;
        const newY = currentItem.y + currentItem.speed;
        if (newY > gameArea.offsetHeight) {
          spawnNewItem();
          return null;
        }
        return { ...currentItem, y: newY };
      });
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, fallingItem]);

  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (gameState === 'won') {
    return (
      <div className="result-screen">
        {showConfettiOnWin && <Confetti />}
        <h1 className="game-result">🎉 You Won! 🎉</h1>
        <button 
          onClick={() => navigate('/leaderboard', { state: { celebrate: true } })} 
          className="start-button"
        >
          Check Your Rank!
        </button>
        <button 
          onClick={() => navigate('/path/waste-management', { state: { celebrate: true } })} 
          className="start-button"
        >
          Back to Games
        </button>
      </div>
    );
  }

  if (gameState === 'lost') return <div className="result-screen"><h1 className="game-result">❌ Try Again</h1><button onClick={startGame} className="start-button">Retry</button></div>;

  return (
    <div className="game-container">
      {gameState === 'instructions' && (<div className="instructions-overlay"><div className="instructions-content"><h2>Waste Sorting Mania</h2><h4>What this game teaches:</h4><p>This game teaches the most important step in waste management: <strong>segregation</strong>.</p><h4>How to play:</h4><ol><li>An emoji item will fall from the top.</li><li>Decide if it's 'Wet Waste' or 'Dry Waste'.</li><li>Click the correct bin at the bottom.</li><li>Score {WINNING_SCORE} points before time runs out to win!</li></ol><button onClick={startGame} className="start-button">Start Game</button></div></div>)}
      {gameState === 'playing' && (
        <>
          <h1 className="game-header">Waste Sorting Mania</h1>
          <div className="game-stats">
            <span>Score: {score} / {WINNING_SCORE}</span>
            <span>Time: {timeLeft}s</span>
          </div>
          <div className="game-area" ref={gameAreaRef}>
            <div className="play-area">
              {fallingItem && (<div className="waste-item" style={{ top: `${fallingItem.y}px`, left: `${fallingItem.x}px` }}>{fallingItem.text}</div>)}
            </div>
            <div className="bin-container">
              <button className="bin wet" onClick={() => handleBinClick('wet')}>Wet Waste</button>
              <button className="bin dry" onClick={() => handleBinClick('dry')}>Dry Waste</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default GamePage;