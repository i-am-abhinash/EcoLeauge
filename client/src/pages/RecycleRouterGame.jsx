import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Confetti from 'react-confetti';
import './Game.css';
import './RecycleRouter.css';

const GAME_DURATION = 50;

const pairs = [
  { item: 'Plastic Bottle', product: 'Fleece Jacket' },
  { item: 'Newspaper', product: 'Egg Carton' },
  { item: 'Glass Jar', product: 'New Bottle' },
  { item: 'Aluminum Can', product: 'Bicycle Frame' },
  { item: 'Food Scraps', product: 'Compost' },
  { item: 'Old Tire', product: 'Playground Surface' },
];

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function RecycleRouterGame({ gameId }) {
  const { user, updateUser } = useAuth();
  const [gameState, setGameState] = useState('instructions');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();
  const hasSubmitted = useRef(false);

  const setupGame = () => {
    const gameCards = pairs.flatMap((pair, index) => [
      { id: index * 2, type: index, content: pair.item, isFlipped: false },
      { id: index * 2 + 1, type: index, content: pair.product, isFlipped: false }
    ]);
    setCards(shuffleArray(gameCards));
    setFlipped([]);
    setMatched([]);
    setTimeLeft(GAME_DURATION);
    setGameState('playing');
    setShowConfetti(false);
    hasSubmitted.current = false;
  };

  useEffect(() => {
    if (gameState !== 'playing' || timeLeft === 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); setGameState('lost'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleCardClick = (index) => {
    if (isChecking || flipped.length === 2 || cards[index].isFlipped) return;
    
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    setFlipped([...flipped, newCards[index]]);
  };
  
  // This useEffect handles the card matching logic
  useEffect(() => {
    if (flipped.length === 2) {
      setIsChecking(true);
      const [first, second] = flipped;
      if (first.type === second.type) {
        setMatched([...matched, first.type]);
        setFlipped([]);
        setIsChecking(false);
      } else {
        setTimeout(() => {
          const newCards = [...cards];
          newCards.find(c => c.id === first.id).isFlipped = false;
          newCards.find(c => c.id === second.id).isFlipped = false;
          setCards(newCards);
          setFlipped([]);
          setIsChecking(false);
        }, 1200);
      }
    }
  }, [flipped, cards, matched]);

  useEffect(() => {
    if (matched.length === pairs.length && user && !hasSubmitted.current) {
      hasSubmitted.current = true;
      setGameState('won');
      setShowConfetti(true);

      const optimisticUser = {
        ...user,
        points: user.points + 10,
        completedChallenges: [...user.completedChallenges, gameId],
      };
      updateUser(optimisticUser);

      const token = localStorage.getItem('token');
      axios.post(`http://127.0.0.1:8000/api/challenges/submit`, { userId: user.id, challengeId: gameId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
          updateUser(response.data);
          console.log("Submission successful.");
      })
      .catch(err => {
          console.error("Submission failed:", err);
          hasSubmitted.current = false;
      });
    }
  }, [matched, gameId, user, updateUser]);

  if (gameState === 'won') return (
    <div className="result-screen">
      {showConfetti && <Confetti />}
      <h1 className="game-result">You Won! 🎉</h1>
      <button onClick={() => navigate('/leaderboard', { state: { celebrate: true } })} className="start-button">
        Check Your Rank
      </button>
      <button onClick={() => navigate('/path/waste-management', { state: { celebrate: true } })} className="start-button">
        Back to Games
      </button>
    </div>
  );
  if (gameState === 'lost') return <div className="result-screen"><h1 className="game-result">Try Again!</h1><button onClick={setupGame} className="start-button">Retry</button></div>;
  
  return (
    <div className="game-container">
      {gameState === 'instructions' && (
        <div className="instructions-overlay">
          <div className="instructions-content">
            <h2>Recycle Router</h2>
            <h4>What this game teaches:</h4>
            <p>This puzzle shows how recycling gives old items a new life! It's not just waste; it's a resource for creating new products.</p>
            <h4>How to play:</h4>
            <ol>
                <li>Click a card to reveal a discarded item.</li>
                <li>Click a second card to find the new product it can become.</li>
                <li>If they match, the pair is found. If not, they flip back.</li>
                <li>Find all the pairs before time runs out!</li>
            </ol>
            <button onClick={setupGame} className="start-button">Start Game</button>
          </div>
        </div>
      )}
      {gameState === 'playing' && (
        <>
          <h1 className="game-header">Recycle Router</h1>
          <div className="game-stats"><span>Matches: {matched.length} / {pairs.length}</span><span>Time: {timeLeft}</span></div>
          <div className="matching-grid">
            {cards.map((card, index) => (
              <div 
                key={index} 
                className={`card ${card.isFlipped || matched.includes(card.type) ? 'is-flipped' : ''} ${matched.includes(card.type) ? 'is-matched' : ''}`} 
                onClick={() => handleCardClick(index)}
              >
                <div className="card-face card-face-front">♻️</div>
                <div className="card-face card-face-back">{card.content}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default RecycleRouterGame;