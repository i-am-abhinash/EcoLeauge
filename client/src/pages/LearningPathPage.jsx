import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { Container, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import './LearningPathPage.css';

const WASTE_MANIA_ID = "68ce80f664bf857de6b6800a";
const RECYCLE_ROUTER_ID = "68ce810f64bf857de6b6800b";
const RECYCLE_FLOW_ID = "68cf6d2664bf857de6b68077";
const LANDFILL_LOGIC_ID = "68cf6d5f0fede65dc6af65a1";
const WASTE_SIMULATOR_ID = "68d0ef9464bf857de6b681f7";
const COMPOST_COMMAND_ID = "68d0f00d64bf857de6b681f9";
const GRAND_QUIZ_ID = "68d0f2a164bf857de6b681fa";

const wasteManagementLevels = [
  { id: WASTE_MANIA_ID, name: 'Level 1: Waste Sorting Mania', prerequisite: null, path: `/game/${WASTE_MANIA_ID}` },
  { id: RECYCLE_ROUTER_ID, name: 'Level 2: Recycle Router', prerequisite: WASTE_MANIA_ID, path: `/game/${RECYCLE_ROUTER_ID}` },
  { id: RECYCLE_FLOW_ID, name: 'Level 3: Recycle Flow', prerequisite: RECYCLE_ROUTER_ID, path: `/game/${RECYCLE_FLOW_ID}` },
  { id: LANDFILL_LOGIC_ID, name: 'Level 4: Landfill Logic', prerequisite: RECYCLE_FLOW_ID, path: `/game/${LANDFILL_LOGIC_ID}` },
  { id: WASTE_SIMULATOR_ID, name: 'Level 5: Waste Simulator', prerequisite: LANDFILL_LOGIC_ID, path: `/game/${WASTE_SIMULATOR_ID}` },
  { id: COMPOST_COMMAND_ID, name: 'Level 6: Compost Command', prerequisite: WASTE_SIMULATOR_ID, path: `/game/${COMPOST_COMMAND_ID}` },
  { id: GRAND_QUIZ_ID, name: 'Grand Quiz', prerequisite: COMPOST_COMMAND_ID, path: `/game/${GRAND_QUIZ_ID}` },
];
const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const cardVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

function LearningPathPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);
  if (!user) { return null; }

  const completedChallenges = user.completedChallenges || [];

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 6, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4, color: 'text.primary' }}>
        Waste Management 
      </Typography>
      <div className="challenge-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
        {wasteManagementLevels.map((level, index) => {
          let isUnlocked = false;

          // Unlocking logic for the first three games
          if (index < 3) {
            isUnlocked = !level.prerequisite || completedChallenges.includes(level.prerequisite);
          } else {
            // All games after the third are permanently locked
            isUnlocked = false;
          }

          return (
            <div key={level.id} className={`challenge-card-wrapper ${level.id === GRAND_QUIZ_ID ? 'grand-quiz-card-wrapper' : ''}`} style={{ opacity: isUnlocked ? 1 : 0.5 }}>
              <Card className="challenge-card">
                <CardActionArea 
                  component={isUnlocked && level.path ? Link : 'div'} 
                  to={isUnlocked ? level.path : '#'}
                  disabled={!isUnlocked}
                  sx={{ cursor: isUnlocked && level.path ? 'pointer' : 'default', height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h6" component="div" sx={{ color: 'text.primary', fontWeight: 600 }}>
                      {level.name}
                    </Typography>
                    {!isUnlocked && <Typography sx={{ mt: 1 }}>🔒 Locked</Typography>}
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
export default LearningPathPage;