import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box, Button, Typography, Paper } from '@mui/material';
import Confetti from 'react-confetti';
import './Game.css';
import './RecycleFlowGame.css';

const GAME_FLOW = [
  { item: 'Plastic Bottle', question: 'Where does plastic go?', correctPath: 'plastic', correctAnswer: 'Plastics are melted and repurposed into new bottles, bags, and fleece.' },
  { item: 'Newspaper', question: 'What is the first step for paper?', correctPath: 'paper', correctAnswer: 'Paper is shredded and mixed with water to form a pulp.' },
  { item: 'Glass Jar', question: 'How is glass recycled?', correctPath: 'glass', correctAnswer: 'Glass is crushed into small pieces and melted to make new glass products.' },
  { item: 'Food Scraps', question: 'Where should food waste go?', correctPath: 'compost', correctAnswer: 'Compostable waste is turned into nutrient-rich soil.' },
];

function RecycleFlowGame({ gameId }) {
  const { user, updateUser, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [gameState, setGameState] = useState('playing');
  const [feedback, setFeedback] = useState('');
  const [showConfettiOnWin, setShowConfettiOnWin] = useState(false);
  const navigate = useNavigate();
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleDecision = (path) => {
    const currentItem = GAME_FLOW[currentStep];
    if (path === currentItem.correctPath) {
      setFeedback('Correct! ' + currentItem.correctAnswer);
      if (currentStep < GAME_FLOW.length - 1) {
        setTimeout(() => {
          setFeedback('');
          setCurrentStep(currentStep + 1);
        }, 2000);
      } else {
        setGameState('won');
        setShowConfettiOnWin(true);
      }
    } else {
      setFeedback('Incorrect! That path leads to the landfill. Try again.');
      setGameState('lost');
    }
  };

  useEffect(() => {
    if (gameState === 'won' && user && !hasSubmitted.current) {
      const submitScore = async () => {
        hasSubmitted.current = true;
        const finalScore = GAME_FLOW.length * 10;
        
        const optimisticUser = {
          ...user,
          points: user.points + finalScore,
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
  
  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <div className="game-container">
      {showConfettiOnWin && <Confetti />}
      {gameState === 'playing' ? (
        <div className="recycling-flow-game">
          <h1 className="game-header">Recycling Flow</h1>
          <div className="flow-item">{GAME_FLOW[currentStep].item}</div>
          <div className="flow-path">
            <p className="flow-question">{GAME_FLOW[currentStep].question}</p>
            <div className="junction">
              <button onClick={() => handleDecision('plastic')}>Plastic</button>
              <button onClick={() => handleDecision('paper')}>Paper</button>
              <button onClick={() => handleDecision('glass')}>Glass</button>
              <button onClick={() => handleDecision('compost')}>Compost</button>
            </div>
            {feedback && <p className="feedback">{feedback}</p>}
          </div>
        </div>
      ) : gameState === 'won' ? (
        <div className="result-screen">
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
      ) : (
        <div className="result-screen">
          <h1 className="game-result">❌ Try Again</h1>
          <button onClick={() => setGameState('playing')} className="start-button">Retry</button>
        </div>
      )}
    </div>
  );
}

export default RecycleFlowGame;